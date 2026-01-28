import Category from '../models/category.model.js';
import Service from '../models/service.model.js';

/**
 * @route   GET /api/categories
 * @desc    Get all active categories (public)
 * @access  Public
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .select('-createdBy -updatedBy')
      .lean();

    // Get service count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const serviceCount = await Service.countDocuments({ 
          categoryId: category._id,
          isActive: true,
          isAvailable: true
        });
        
        return {
          ...category,
          metadata: {
            ...category.metadata,
            activeServices: serviceCount
          }
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categoriesWithCount
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
 * @route   GET /api/categories/:id
 * @desc    Get category by ID (public)
 * @access  Public
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findOne({ 
      _id: id, 
      isActive: true 
    })
      .select('-createdBy -updatedBy')
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const serviceCount = await Service.countDocuments({ 
      categoryId: category._id,
      isActive: true,
      isAvailable: true
    });

    return res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: {
        ...category,
        metadata: {
          ...category.metadata,
          activeServices: serviceCount
        }
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
 * @route   GET /api/categories/:id/services
 * @desc    Get all active services for a category (public)
 * @access  Public
 */
export const getCategoryServices = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists and is active
    const category = await Category.findOne({ 
      _id: id, 
      isActive: true 
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get all active and available services for this category
    const services = await Service.find({ 
      categoryId: id,
      isActive: true,
      isAvailable: true
    })
      .select('-createdBy -updatedBy -bodyContent')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Services retrieved successfully',
      data: {
        category: {
          id: category._id,
          name: category.name,
          slug: category.slug
        },
        services,
        count: services.length
      }
    });
  } catch (error) {
    console.error('Error fetching category services:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};
