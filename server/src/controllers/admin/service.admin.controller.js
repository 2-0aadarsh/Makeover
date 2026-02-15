import Service from '../../models/service.model.js';
import Category from '../../models/category.model.js';
import UploadFactory from '../../services/upload/uploadFactory.js';
import { validateFile, getFileFromRequest, getMultipleFilesFromRequest } from '../../utils/fileValidation.utils.js';
import mongoose from 'mongoose';

/**
 * Parse first number from a string (e.g. "2.5k" -> 2500, "12000" -> 12000)
 */
const parseFirstNumber = (str) => {
  if (str === undefined || str === null || String(str).trim() === '') return NaN;
  const t = String(str).trim().toLowerCase().replace(/\s/g, '');
  if (t.endsWith('k')) return parseFloat(t.slice(0, -1)) * 1000;
  return parseFloat(t);
};

/**
 * Parse price input from form: supports range ("2.5k-4k"), "Get in touch for pricing", or single number.
 * @returns {{ price: number, priceDisplay: string|null }} or null if invalid
 */
const parsePriceInput = (priceStr, ctaContent) => {
  const isEnquire = ctaContent === 'Enquire Now';
  const empty = priceStr === undefined || priceStr === null || String(priceStr).trim() === '';
  if (empty && isEnquire) return { price: 0, priceDisplay: 'Get in touch for pricing' };
  if (empty && !isEnquire) return null;
  const s = String(priceStr).trim();
  const lower = s.toLowerCase();
  if (/get in touch|price on request|enquiry|for pricing/i.test(lower)) return { price: 0, priceDisplay: 'Get in touch for pricing' };
  if (s.includes('-')) {
    const firstPart = s.split('-')[0].trim();
    const num = parseFirstNumber(firstPart);
    return { price: (isNaN(num) || num < 0) ? 0 : num, priceDisplay: s };
  }
  const num = parseFirstNumber(s);
  if (isNaN(num) || num < 0) return null;
  return { price: num, priceDisplay: null };
};

/**
 * @route   POST /api/admin/services
 * @desc    Create a new service with image upload
 * @access  Admin only
 */
const parseOptionsFromBody = (raw) => {
  if (raw === undefined || raw === null) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      bodyContent,
      price,
      duration,
      categoryId,
      ctaContent,
      cardType,
      serviceType,
      taxIncluded
    } = req.body;

    const options = parseOptionsFromBody(req.body.options);

    // Validate required fields (price optional when CTA is "Enquire Now" or when options provided)
    const cta = ctaContent || 'Add';
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }
    let parsed = null;
    if (options.length > 0) {
      const validOptions = options.filter(o => o && typeof o.label === 'string' && o.label.trim());
      if (validOptions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'When providing options, each option must have a label'
        });
      }
      const normalizedOptions = validOptions.map((o) => {
        const label = String(o.label).trim();
        const optPriceStr = o.priceDisplay || (o.price != null ? String(o.price) : '');
        const optParsed = parsePriceInput(optPriceStr, cta);
        return {
          label,
          price: optParsed ? optParsed.price : 0,
          priceDisplay: optParsed && optParsed.priceDisplay ? optParsed.priceDisplay : null
        };
      });
      parsed = {
        price: normalizedOptions[0].price,
        priceDisplay: normalizedOptions[0].priceDisplay || undefined,
        options: normalizedOptions
      };
    } else {
      parsed = parsePriceInput(price, cta);
      if (!parsed) {
        return res.status(400).json({
          success: false,
          message: 'Price is required for "Add" services. Use a number, range (e.g. 2.5k-4k), or leave empty for "Enquire Now" to show "Get in touch for pricing".'
        });
      }
    }

    // Validate categoryId if provided
    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      if (!category.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add service to inactive category'
        });
      }
    }

    // Get and validate image files
    const files = getMultipleFilesFromRequest(req, 'images');
    
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one service image is required'
      });
    }

    // Validate all files
    const validationErrors = [];
    files.forEach((file, index) => {
      const validation = validateFile(file);
      if (!validation.valid) {
        validationErrors.push(`Image ${index + 1}: ${validation.errors.join(', ')}`);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Image validation failed',
        errors: validationErrors
      });
    }

    // Upload images
    const uploader = UploadFactory.getProvider();
    const uploadResults = await uploader.uploadMultiple(files, 'services');

    // Create service
    const service = new Service({
      name,
      description,
      bodyContent: bodyContent || '',
      price: parsed.price,
      priceDisplay: parsed.priceDisplay || undefined,
      options: parsed.options || undefined,
      duration: duration || null,
      categoryId: categoryId || null,
      ctaContent: cta,
      cardType: cardType || 'Vertical',
      serviceType: serviceType || 'Standard',
      taxIncluded: taxIncluded !== undefined ? taxIncluded : true,
      image: uploadResults.map(r => r.url),
      imagePublicIds: uploadResults.map(r => r.publicId),
      createdBy: req.user.id,
      isActive: true,
      isAvailable: true,
      popularity: 0
    });

    await service.save();

    // Populate category for response
    if (service.categoryId) {
      await service.populate('categoryId', 'name slug image');
    }

    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        id: service._id,
        name: service.name,
        description: service.description,
        bodyContent: service.bodyContent,
        price: service.price,
        priceDisplay: service.priceDisplay || null,
        options: service.options || [],
        formattedPrice: service.formattedPrice,
        duration: service.duration,
        category: service.categoryId,
        ctaContent: service.ctaContent,
        cardType: service.cardType,
        taxIncluded: service.taxIncluded,
        images: service.image,
        isActive: service.isActive,
        isAvailable: service.isAvailable,
        createdAt: service.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/services
 * @desc    Get all services with filters and pagination
 * @access  Admin only
 */
export const getAllServices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      categoryId,
      isActive,
      isAvailable,
      search,
      ctaContent,
      cardType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      query.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    if (ctaContent && ['Add', 'Enquire Now'].includes(ctaContent)) {
      query.ctaContent = ctaContent;
    }

    if (cardType && ['Vertical', 'Horizontal'].includes(cardType)) {
      query.cardType = cardType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { bodyContent: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch services
    const services = await Service.find(query)
      .populate('categoryId', 'name slug image')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const totalServices = await Service.countDocuments(query);
    const totalPages = Math.ceil(totalServices / parseInt(limit));

    // Format services
    const formattedServices = services.map(service => ({
      id: service._id,
      name: service.name,
      description: service.description,
      bodyContent: service.bodyContent,
      price: service.price,
      priceDisplay: service.priceDisplay || null,
      options: service.options || [],
      formattedPrice: service.formattedPrice,
      duration: service.duration,
      category: service.categoryId || { name: service.category || 'N/A' },
      ctaContent: service.ctaContent,
      cardType: service.cardType,
      serviceType: service.serviceType,
      taxIncluded: service.taxIncluded,
      images: service.image,
      isActive: service.isActive,
      isAvailable: service.isAvailable,
      popularity: service.popularity,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    }));

    return res.status(200).json({
      success: true,
      message: 'Services retrieved successfully',
      data: {
        services: formattedServices,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalServices,
          limit: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/services/:id
 * @desc    Get single service details
 * @access  Admin only
 */
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    const service = await Service.findById(id)
      .populate('categoryId', 'name slug image description')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Service details retrieved successfully',
      data: service
    });

  } catch (error) {
    console.error('Error fetching service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/admin/services/:id
 * @desc    Update service (with optional image update)
 * @access  Admin only
 */
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      bodyContent,
      price,
      duration,
      categoryId,
      ctaContent,
      cardType,
      serviceType,
      taxIncluded,
      isActive,
      isAvailable
    } = req.body;
    const optionsRaw = parseOptionsFromBody(req.body.options);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Validate categoryId if provided
    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      service.categoryId = categoryId;
    }

    // Update fields
    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (bodyContent !== undefined) service.bodyContent = bodyContent;
    if (price !== undefined) {
      const cta = ctaContent !== undefined ? ctaContent : service.ctaContent;
      const parsed = parsePriceInput(price, cta);
      if (!parsed) {
        return res.status(400).json({
          success: false,
          message: 'Invalid price. Use a number, range (e.g. 2.5k-4k), or leave empty for "Enquire Now" to show "Get in touch for pricing".'
        });
      }
      service.price = parsed.price;
      service.priceDisplay = parsed.priceDisplay || undefined;
    }
    if (duration !== undefined) service.duration = duration;
    if (ctaContent !== undefined) service.ctaContent = ctaContent;
    if (cardType !== undefined) service.cardType = cardType;
    if (serviceType !== undefined) service.serviceType = serviceType;
    if (taxIncluded !== undefined) service.taxIncluded = taxIncluded;
    if (isActive !== undefined) service.isActive = isActive;
    if (isAvailable !== undefined) service.isAvailable = isAvailable;

    if (optionsRaw.length > 0) {
      const cta = ctaContent !== undefined ? ctaContent : service.ctaContent;
      const validOptions = optionsRaw.filter(o => o && typeof o.label === 'string' && o.label.trim());
      if (validOptions.length > 0) {
        service.options = validOptions.map((o) => {
          const label = String(o.label).trim();
          const optPriceStr = o.priceDisplay || (o.price != null ? String(o.price) : '');
          const optParsed = parsePriceInput(optPriceStr, cta);
          return {
            label,
            price: optParsed ? optParsed.price : 0,
            priceDisplay: optParsed && optParsed.priceDisplay ? optParsed.priceDisplay : null
          };
        });
        service.markModified('options');
        service.price = service.options[0].price;
        service.priceDisplay = service.options[0].priceDisplay || undefined;
      }
    } else if (optionsRaw.length === 0 && req.body && Object.prototype.hasOwnProperty.call(req.body, 'options')) {
      service.options = [];
      service.markModified('options');
    }

    // Handle image update if new images are provided
    const files = getMultipleFilesFromRequest(req, 'images');
    
    if (files.length > 0) {
      // Validate all files
      const validationErrors = [];
      files.forEach((file, index) => {
        const validation = validateFile(file);
        if (!validation.valid) {
          validationErrors.push(`Image ${index + 1}: ${validation.errors.join(', ')}`);
        }
      });

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Image validation failed',
          errors: validationErrors
        });
      }

      // Upload new images
      const uploader = UploadFactory.getProvider();
      const uploadResults = await uploader.uploadMultiple(files, 'services');

      // Delete old images if they exist
      if (service.imagePublicIds && service.imagePublicIds.length > 0) {
        try {
          await uploader.deleteMultiple(service.imagePublicIds);
        } catch (deleteError) {
          console.warn('⚠️ Failed to delete old images:', deleteError);
          // Continue even if delete fails
        }
      }

      service.image = uploadResults.map(r => r.url);
      service.imagePublicIds = uploadResults.map(r => r.publicId);
    }

    service.updatedBy = req.user.id;
    await service.save();

    // Populate for response
    if (service.categoryId) {
      await service.populate('categoryId', 'name slug image');
    }

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: {
        id: service._id,
        name: service.name,
        description: service.description,
        bodyContent: service.bodyContent,
        price: service.price,
        priceDisplay: service.priceDisplay || null,
        options: service.options || [],
        formattedPrice: service.formattedPrice,
        duration: service.duration,
        category: service.categoryId,
        ctaContent: service.ctaContent,
        cardType: service.cardType,
        taxIncluded: service.taxIncluded,
        images: service.image,
        isActive: service.isActive,
        isAvailable: service.isAvailable,
        updatedAt: service.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/admin/services/:id
 * @desc    Delete service
 * @access  Admin only
 */
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Delete images from cloud storage
    if (service.imagePublicIds && service.imagePublicIds.length > 0) {
      try {
        const uploader = UploadFactory.getProvider();
        await uploader.deleteMultiple(service.imagePublicIds);
      } catch (deleteError) {
        console.warn('⚠️ Failed to delete service images:', deleteError);
        // Continue even if image delete fails
      }
    }

    // Delete service
    await Service.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      data: {
        id: service._id,
        name: service.name
      }
    });

  } catch (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/admin/services/:id/toggle-active
 * @desc    Toggle service active status (show/hide on site)
 * @access  Admin only
 */
export const toggleServiceActive = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.isActive = !service.isActive;
    service.updatedBy = req.user.id;
    await service.save();

    return res.status(200).json({
      success: true,
      message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: service._id,
        name: service.name,
        isActive: service.isActive,
        updatedAt: service.updatedAt
      }
    });
  } catch (error) {
    console.error('Error toggling service active:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle service status',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/admin/services/:id/toggle
 * @desc    Toggle service availability
 * @access  Admin only
 */
export const toggleServiceAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.isAvailable = !service.isAvailable;
    service.updatedBy = req.user.id;
    await service.save();

    return res.status(200).json({
      success: true,
      message: `Service ${service.isAvailable ? 'available' : 'unavailable'} successfully`,
      data: {
        id: service._id,
        name: service.name,
        isAvailable: service.isAvailable,
        updatedAt: service.updatedAt
      }
    });

  } catch (error) {
    console.error('Error toggling service availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle service availability',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/services/by-category/:categoryId
 * @desc    Get all services in a category
 * @access  Admin only
 */
export const getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20, isActive, isAvailable } = req.query;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Build query
    const query = { categoryId };
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch services
    const services = await Service.find(query)
      .populate('categoryId', 'name slug image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalServices = await Service.countDocuments(query);
    const totalPages = Math.ceil(totalServices / parseInt(limit));

    return res.status(200).json({
      success: true,
      message: 'Services retrieved successfully',
      data: {
        category: {
          id: category._id,
          name: category.name,
          slug: category.slug,
          image: category.image
        },
        services: services.map(s => ({
          id: s._id,
          name: s.name,
          description: s.description,
          bodyContent: s.bodyContent,
          price: s.price,
          priceDisplay: s.priceDisplay || null,
          formattedPrice: s.priceDisplay || `₹${(s.price || 0).toLocaleString('en-IN')}`,
          duration: s.duration,
          ctaContent: s.ctaContent,
          cardType: s.cardType,
          taxIncluded: s.taxIncluded,
          images: s.image,
          isActive: s.isActive,
          isAvailable: s.isAvailable
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalServices,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching services by category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/services/stats
 * @desc    Get service statistics
 * @access  Admin only
 */
export const getServiceStats = async (req, res) => {
  try {
    // Total services
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });
    const availableServices = await Service.countDocuments({ isAvailable: true });

    // Services by category
    const servicesByCategory = await Service.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $group: {
          _id: '$categoryId',
          categoryName: { $first: { $arrayElemAt: ['$categoryInfo.name', 0] } },
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Services by CTA type
    const servicesByCTA = await Service.aggregate([
      {
        $group: {
          _id: '$ctaContent',
          count: { $sum: 1 }
        }
      }
    ]);

    // Services by card type
    const servicesByCardType = await Service.aggregate([
      {
        $group: {
          _id: '$cardType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Price statistics
    const priceStats = await Service.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalRevenuePotential: { $sum: '$price' }
        }
      }
    ]);

    // Most popular services
    const popularServices = await Service.find({ isActive: true })
      .populate('categoryId', 'name')
      .sort({ popularity: -1 })
      .limit(10)
      .select('name price popularity categoryId')
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Service statistics retrieved successfully',
      data: {
        summary: {
          totalServices,
          activeServices,
          availableServices,
          inactiveServices: totalServices - activeServices,
          unavailableServices: totalServices - availableServices
        },
        servicesByCategory,
        servicesByCTA,
        servicesByCardType,
        priceStats: priceStats[0] || {
          averagePrice: 0,
          minPrice: 0,
          maxPrice: 0,
          totalRevenuePotential: 0
        },
        popularServices: popularServices.map(s => ({
          id: s._id,
          name: s.name,
          category: s.categoryId?.name || 'N/A',
          price: s.price,
          formattedPrice: `₹${s.price.toLocaleString('en-IN')}`,
          popularity: s.popularity
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching service statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service statistics',
      error: error.message
    });
  }
};
