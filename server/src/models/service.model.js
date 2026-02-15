import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  // Basic Service Information
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Pricing Information (optional when options array is non-empty)
  price: {
    type: Number,
    required: false,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  // Display-only price (e.g. "2.5k-4k", "Get in touch for pricing"). When set, UI shows this instead of formatting price.
  priceDisplay: {
    type: String,
    trim: true,
    default: null,
    maxlength: [100, 'Price display cannot exceed 100 characters']
  },

  // Service options/variants (e.g. "Both Hands", "Both Hands & Legs") with per-option price
  options: [{
    label: { type: String, required: true, trim: true, maxlength: [80, 'Option label cannot exceed 80 characters'] },
    price: { type: Number, required: true, min: 0, default: 0 },
    priceDisplay: { type: String, trim: true, default: null, maxlength: [100, 'Price display cannot exceed 100 characters'] }
  }],

  taxIncluded: {
    type: Boolean,
    default: true
  },
  
  // Service Details
  duration: {
    type: String,
    default: null,
    trim: true
  },
  
  // NEW: Category Reference (replaces old string category)
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false, // Made optional for backward compatibility with existing services
    default: null
  },
  
  // OLD: Legacy category field (kept for backward compatibility)
  // Will be phased out in favor of categoryId
  category: {
    type: String,
    required: false, // Changed to optional
    trim: true,
    enum: {
      values: ['Regular', 'Premium', 'Bridal', 'Classic'],
      message: 'Category must be one of: Regular, Premium, Bridal, Classic'
    }
  },
  
  serviceType: {
    type: String,
    default: 'Standard',
    trim: true,
    enum: {
      values: ['Standard', 'Premium', 'Deluxe', 'Bridal', 'Classic'],
      message: 'Service type must be one of: Standard, Premium, Deluxe, Bridal, Classic'
    }
  },
  
  // Media
  image: [{
    type: String,
    required: [true, 'Service image is required'],
    trim: true
  }],
  
  // NEW: Image public IDs for deletion (corresponds to image array)
  imagePublicIds: [{
    type: String,
    trim: true
  }],
  
  // NEW: Body Content (for service card display from Figma)
  bodyContent: {
    type: String,
    default: '',
    trim: true,
    maxlength: [1000, 'Body content cannot exceed 1000 characters']
  },
  
  // NEW: CTA Content (Call-to-action button text from Figma)
  ctaContent: {
    type: String,
    enum: {
      values: ['Add', 'Enquire Now'],
      message: 'CTA must be either "Add" or "Enquire Now"'
    },
    default: 'Add'
  },
  
  // NEW: Card Type (layout type from Figma)
  cardType: {
    type: String,
    enum: {
      values: ['Vertical', 'Horizontal'],
      message: 'Card type must be either "Vertical" or "Horizontal"'
    },
    default: 'Vertical'
  },
  
  // Service Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  // Admin Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  
  popularity: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ categoryId: 1, isActive: 1 }); // NEW: Index for category reference
serviceSchema.index({ price: 1 });
serviceSchema.index({ createdAt: -1 });
serviceSchema.index({ popularity: -1 });
serviceSchema.index({ ctaContent: 1 }); // NEW: Index for filtering by CTA type
serviceSchema.index({ cardType: 1 }); // NEW: Index for filtering by card type

// Pre-save middleware to validate category and price/options
serviceSchema.pre('save', function(next) {
  if (!this.categoryId && !this.category) {
    return next(new Error('Either categoryId or category is required'));
  }
  // When no options: price is required. When options exist: derive price from first option if not set
  const hasOptions = this.options && this.options.length > 0;
  if (hasOptions) {
    if (this.price === undefined || this.price === null) {
      this.price = this.options[0].price;
    }
    if (!this.priceDisplay && this.options[0].priceDisplay) {
      this.priceDisplay = this.options[0].priceDisplay;
    }
  } else if (!hasOptions && (this.price === undefined || this.price === null)) {
    return next(new Error('Service price is required when no options are provided'));
  }
  this.updatedAt = new Date();
  next();
});

// Instance methods
serviceSchema.methods.incrementPopularity = function() {
  this.popularity += 1;
  return this.save();
};

serviceSchema.methods.toggleAvailability = function() {
  this.isAvailable = !this.isAvailable;
  return this.save();
};

// Static methods
serviceSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true, isAvailable: true });
};

// NEW: Find by category ID (using Category reference)
serviceSchema.statics.findByCategoryId = function(categoryId, options = {}) {
  const query = { 
    categoryId, 
    isActive: options.includeInactive ? undefined : true,
    isAvailable: options.includeUnavailable ? undefined : true
  };
  
  // Remove undefined values
  Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);
  
  return this.find(query)
    .populate('categoryId', 'name slug')
    .sort({ createdAt: -1 });
};

serviceSchema.statics.findPopularServices = function(limit = 10) {
  return this.find({ isActive: true, isAvailable: true })
    .sort({ popularity: -1 })
    .limit(limit);
};

// Virtual for formatted price (uses priceDisplay when set, else numeric price)
serviceSchema.virtual('formattedPrice').get(function() {
  if (this.priceDisplay) return this.priceDisplay;
  return `₹${(this.price || 0).toLocaleString('en-IN')}`;
});

// Ensure virtual fields are serialized
serviceSchema.set('toJSON', { virtuals: true });
serviceSchema.set('toObject', { virtuals: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
