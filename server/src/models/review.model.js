import mongoose from 'mongoose';

// Edit window duration in hours (48 hours)
const EDIT_WINDOW_HOURS = 48;

const reviewSchema = new mongoose.Schema(
  {
    // User reference (optional - null for guest reviews)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Booking reference (optional - if review is for a specific booking)
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },

    // Order number for reference (stored for quick lookup)
    orderNumber: {
      type: String,
      trim: true,
      default: null,
    },

    // Service reference (optional)
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      default: null,
    },

    // Customer details (for guest reviews or to store snapshot)
    customerDetails: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },

    // Service/Booking name (for display) - can be comma-separated for multiple services
    serviceName: {
      type: String,
      trim: true,
    },

    // Rating (0.5-5 stars with 0.5 increments)
    rating: {
      type: Number,
      min: [0.5, 'Rating must be at least 0.5'],
      max: [5, 'Rating cannot exceed 5'],
      default: null,
      validate: {
        validator: function(v) {
          // Allow null or values in 0.5 increments
          return v === null || (v >= 0.5 && v <= 5 && (v * 2) % 1 === 0);
        },
        message: 'Rating must be in 0.5 increments (e.g., 1, 1.5, 2, 2.5, etc.)'
      }
    },

    // Review/comment text
    comment: {
      type: String,
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
      default: '',
    },

    // Type: 'review' or 'complaint'
    type: {
      type: String,
      enum: ['review', 'complaint'],
      default: 'review',
    },

    // Complaint category (only for complaints)
    complaintCategory: {
      type: String,
      enum: ['service_quality', 'staff_behavior', 'timing', 'pricing', 'hygiene', 'other'],
      default: null,
    },

    // Status: for complaints use pending/reviewed/resolved/dismissed; for reviews also use published/hidden (visibility on site)
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed', 'published', 'hidden'],
      default: 'pending',
    },

    // Admin response (for complaints)
    adminResponse: {
      type: String,
      trim: true,
      maxlength: [1000, 'Admin response cannot exceed 1000 characters'],
      default: null,
    },

    // Admin who responded
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Response date
    respondedAt: {
      type: Date,
      default: null,
    },

    // Source of review submission
    source: {
      type: String,
      enum: ['email', 'web', 'mobile'],
      default: 'web',
    },

    // Edit tracking
    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    editWindowExpiresAt: {
      type: Date,
      default: null,
    },

    // Notification tracking
    userNotifiedOfResponse: {
      type: Boolean,
      default: false,
    },

    userNotifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create indexes for better query performance
reviewSchema.index({ userId: 1 });
reviewSchema.index({ bookingId: 1 });
reviewSchema.index({ orderNumber: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ type: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ complaintCategory: 1 });

// Virtual: Check if review can still be edited (within 48 hours)
reviewSchema.virtual('canBeEdited').get(function() {
  if (!this.editWindowExpiresAt) {
    return false;
  }
  return new Date() < this.editWindowExpiresAt;
});

// Virtual: Time remaining to edit (in milliseconds)
reviewSchema.virtual('editTimeRemaining').get(function() {
  if (!this.editWindowExpiresAt) {
    return 0;
  }
  const remaining = this.editWindowExpiresAt - new Date();
  return remaining > 0 ? remaining : 0;
});

// Pre-save middleware: Set edit window on creation
reviewSchema.pre('save', function(next) {
  // Set edit window expiry when review is first created
  if (this.isNew && !this.editWindowExpiresAt) {
    this.editWindowExpiresAt = new Date(Date.now() + EDIT_WINDOW_HOURS * 60 * 60 * 1000);
  }
  
  // Track edits
  if (!this.isNew && this.isModified('comment') || this.isModified('rating')) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  
  next();
});

// Instance method: Check if user can edit this review
reviewSchema.methods.canUserEdit = function(userId) {
  // Must be the owner of the review
  if (!this.userId || this.userId.toString() !== userId.toString()) {
    return false;
  }
  // Must be within edit window
  return this.canBeEdited;
};

// Instance method: Mark as responded by admin
reviewSchema.methods.respondToComplaint = function(adminId, response, newStatus = 'reviewed') {
  this.adminResponse = response;
  this.respondedBy = adminId;
  this.respondedAt = new Date();
  this.status = newStatus;
  return this.save();
};

// Static method: Find reviews by booking
reviewSchema.statics.findByBooking = function(bookingId) {
  return this.findOne({ bookingId }).populate('userId', 'name email');
};

// Static method: Find pending complaints
reviewSchema.statics.findPendingComplaints = function() {
  return this.find({ type: 'complaint', status: 'pending' })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .populate('bookingId', 'orderNumber services');
};

// Static method: Get review statistics
reviewSchema.statics.getReviewStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      }
    }
  ]);
  
  const complaintStats = await this.aggregate([
    { $match: { type: 'complaint' } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return { typeStats: stats, complaintStatusStats: complaintStats };
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
