import mongoose from 'mongoose';

/**
 * Category Model
 * 
 * Represents service categories in the system (e.g., Professional Makeup, Waxing, etc.)
 * Each category can have multiple services under it.
 */

const categorySchema = new mongoose.Schema({
  // Category name (unique)
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },

  // URL-friendly slug (auto-generated from name)
  slug: {
    type: String,
    required: false, // Not required - will be auto-generated in pre-save hook
    unique: true,
    sparse: true, // Allow multiple null values temporarily
    lowercase: true,
    trim: true
  },

  // Category description
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  // Category image URL (from Cloudinary or S3)
  image: {
    type: String,
    required: [true, 'Category image is required'],
    trim: true
  },

  // Image public ID (for deletion from cloud storage)
  imagePublicId: {
    type: String,
    default: null
  },

  // Display order in UI (for sorting)
  displayOrder: {
    type: Number,
    default: 0,
    min: 0
  },

  // Active status
  isActive: {
    type: Boolean,
    default: true
  },

  // Admin who created this category
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Admin who last updated this category
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Service count (virtual field, calculated)
  // Will be calculated via aggregation or virtual populate

  // Metadata
  metadata: {
    totalServices: {
      type: Number,
      default: 0
    },
    activeServices: {
      type: Number,
      default: 0
    }
  }

}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ displayOrder: 1 });
categorySchema.index({ name: 1 });

// Virtual populate for services
categorySchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'categoryId'
});

// Pre-save middleware to generate slug from name
// This runs BEFORE validation, so slug will be set before validation
categorySchema.pre('save', function(next) {
  // Always generate slug if name exists and slug is missing or name was modified
  if (this.name) {
    // Generate slug for new documents or when name changes
    if (this.isNew || !this.slug || this.isModified('name')) {
      // Generate slug: "Professional Makeup" → "professional-makeup"
      this.slug = this.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
      
      // Ensure slug is not empty (fallback)
      if (!this.slug || this.slug.length === 0) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      }
    }
  }
  next();
});

// Static method to find active categories
categorySchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
};

// Static method to find category with service count
categorySchema.statics.findWithServiceCount = async function() {
  const Service = mongoose.model('Service');
  
  const categories = await this.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .lean();

  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const serviceCount = await Service.countDocuments({ 
        categoryId: category._id,
        isActive: true 
      });
      
      return {
        ...category,
        serviceCount
      };
    })
  );

  return categoriesWithCount;
};

// Instance method to get service count
categorySchema.methods.getServiceCount = async function() {
  const Service = mongoose.model('Service');
  return await Service.countDocuments({ 
    categoryId: this._id,
    isActive: true 
  });
};

// Instance method to check if category can be deleted
categorySchema.methods.canBeDeleted = async function() {
  const Service = mongoose.model('Service');
  const serviceCount = await Service.countDocuments({ categoryId: this._id });
  return serviceCount === 0;
};

const Category = mongoose.model('Category', categorySchema);

export default Category;
