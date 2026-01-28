import mongoose from 'mongoose';

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

    // Service/Booking name (for display)
    serviceName: {
      type: String,
      trim: true,
    },

    // Rating (1-5 stars)
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: null,
    },

    // Review/comment text
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },

    // Type: 'review' or 'complaint'
    type: {
      type: String,
      enum: ['review', 'complaint'],
      default: 'review',
    },

    // Status for complaints
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },

    // Admin response (for complaints)
    adminResponse: {
      type: String,
      trim: true,
      maxlength: 1000,
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
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
reviewSchema.index({ userId: 1 });
reviewSchema.index({ bookingId: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ type: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ rating: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
