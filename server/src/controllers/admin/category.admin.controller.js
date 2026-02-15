import Category from '../../models/category.model.js';
import Service from '../../models/service.model.js';
import UploadFactory from '../../services/upload/uploadFactory.js';
import { validateFile, getFileFromRequest } from '../../utils/fileValidation.utils.js';
import mongoose from 'mongoose';

/**
 * @route   POST /api/admin/categories
 * @desc    Create a new category with image upload
 * @access  Admin only
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, displayOrder } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    // Get and validate image file
    const file = getFileFromRequest(req, 'image');
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Category image is required'
      });
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Image validation failed',
        errors: validation.errors
      });
    }

    // Upload image
    const uploader = UploadFactory.getProvider();
    const uploadResult = await uploader.upload(file, 'categories');

    // Generate slug from name (as fallback, pre-save hook should also do this)
    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // Create category
    const category = new Category({
      name,
      slug: generateSlug(name), // Explicitly set slug to ensure it exists
      description: description || '',
      image: uploadResult.url,
      imagePublicId: uploadResult.publicId,
      displayOrder: displayOrder || 0,
      createdBy: req.user.id, // Admin user ID from middleware
      metadata: {
        totalServices: 0,
        activeServices: 0
      }
    });

    await category.save();

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
        createdAt: category.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/categories
 * @desc    Get all categories with optional filters
 * @access  Admin only
 */
export const getAllCategories = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      isActive, 
      search,
      sortBy = 'displayOrder',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch categories
    const categories = await Category.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get service count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const serviceCount = await Service.countDocuments({ 
          categoryId: category._id 
        });
        const activeServiceCount = await Service.countDocuments({ 
          categoryId: category._id,
          isActive: true 
        });

        return {
          ...category,
          serviceCount,
          activeServiceCount
        };
      })
    );

    // Get total count
    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / parseInt(limit));

    return res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: {
        categories: categoriesWithCount,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCategories,
          limit: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/categories/:id
 * @desc    Get single category details
 * @access  Admin only
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const category = await Category.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get services in this category
    const services = await Service.find({ categoryId: id })
      .select('name price duration isActive isAvailable')
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Category details retrieved successfully',
      data: {
        ...category,
        services,
        serviceCount: services.length,
        activeServiceCount: services.filter(s => s.isActive).length
      }
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update category (with optional image update)
 * @access  Admin only
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, displayOrder, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if name is being changed and if it conflicts with another category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }

      category.name = name;
    }

    // Update other fields
    if (description !== undefined) category.description = description;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (isActive !== undefined) category.isActive = isActive;

    // Handle image update if new image is provided
    const file = getFileFromRequest(req, 'image');
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: 'Image validation failed',
          errors: validation.errors
        });
      }

      // Upload new image
      const uploader = UploadFactory.getProvider();
      const uploadResult = await uploader.upload(file, 'categories');

      // Delete old image if it exists
      if (category.imagePublicId) {
        try {
          await uploader.delete(category.imagePublicId);
        } catch (deleteError) {
          console.warn('⚠️ Failed to delete old image:', deleteError);
          // Continue even if delete fails
        }
      }

      category.image = uploadResult.url;
      category.imagePublicId = uploadResult.publicId;
    }

    category.updatedBy = req.user.id;
    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
        updatedAt: category.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete category (only if no services exist)
 * @access  Admin only
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has services
    const serviceCount = await Service.countDocuments({ categoryId: id });
    if (serviceCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${serviceCount} service(s). Please delete or reassign services first.`
      });
    }

    // Delete image from cloud storage
    if (category.imagePublicId) {
      try {
        const uploader = UploadFactory.getProvider();
        await uploader.delete(category.imagePublicId);
      } catch (deleteError) {
        console.warn('⚠️ Failed to delete category image:', deleteError);
        // Continue even if image delete fails
      }
    }

    // Delete category
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {
        id: category._id,
        name: category.name
      }
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/categories/:id/services
 * @desc    Get all services in a category
 * @access  Admin only
 */
export const getCategoryServices = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, isActive } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Build query
    const query = { categoryId: id };
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch services
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalServices = await Service.countDocuments(query);
    const totalPages = Math.ceil(totalServices / parseInt(limit));

    return res.status(200).json({
      success: true,
      message: 'Category services retrieved successfully',
      data: {
        category: {
          id: category._id,
          name: category.name,
          slug: category.slug
        },
        services,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalServices,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching category services:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch category services',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/admin/categories/:id/toggle-active
 * @desc    Toggle category active status
 * @access  Admin only
 */
export const toggleCategoryActive = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    category.isActive = !category.isActive;
    category.updatedBy = req.user.id;
    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: category._id,
        name: category.name,
        isActive: category.isActive,
        updatedAt: category.updatedAt
      }
    });

  } catch (error) {
    console.error('Error toggling category status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle category status',
      error: error.message
    });
  }
};
