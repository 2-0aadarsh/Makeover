import mongoose from 'mongoose';

const bookingItemSchema = new mongoose.Schema({
  // Service Information (copied from cart for data integrity)
  serviceId: {
    type: String,
    required: true,
    trim: true
  },
  
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
  
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Quantity cannot exceed 10']
  },
  
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  
  category: {
    type: String,
    required: true,
    trim: true,
    enum: {
      values: ['Regular', 'Premium', 'Bridal', 'Classic', 'default'],
      message: 'Category must be one of: Regular, Premium, Bridal, Classic, default'
    }
  },
  
  serviceType: {
    type: String,
    default: 'Standard',
    trim: true,
    enum: {
      values: ['Standard', 'Premium', 'Deluxe'],
      message: 'Service type must be one of: Standard, Premium, Deluxe'
    }
  }
}, {
  _id: false // Disable _id for subdocuments
});

const bookingSchema = new mongoose.Schema({
  // User association
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Booking Status
  bookingStatus: {
    type: String,
    required: true,
    enum: {
      values: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
      message: 'Booking status must be one of: pending, confirmed, completed, cancelled, rescheduled'
    },
    default: 'pending'
  },
  
  // Booking Date and Time
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required'],
    validate: {
      validator: function(date) {
        return date >= new Date();
      },
      message: 'Booking date cannot be in the past'
    }
  },
  
  timeSlot: {
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    dailySlotsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailySlots',
      required: true
    }
  },
  
  // Services (copied from cart for data integrity)
  services: [bookingItemSchema],
  
  // Service Summary
  serviceSummary: {
    totalServices: {
      type: Number,
      default: 0,
      min: [0, 'Total services cannot be negative']
    },
    
    totalItems: {
      type: Number,
      default: 0,
      min: [0, 'Total items cannot be negative']
    },
    
    subtotal: {
      type: Number,
      default: 0,
      min: [0, 'Subtotal cannot be negative']
    },
    
    taxAmount: {
      type: Number,
      default: 0,
      min: [0, 'Tax amount cannot be negative']
    },
    
    total: {
      type: Number,
      default: 0,
      min: [0, 'Total cannot be negative']
    }
  },
  
  // Address Information (copied for data integrity)
  deliveryAddress: {
    houseFlatNumber: String,
    streetAreaName: String,
    completeAddress: String,
    landmark: String,
    pincode: String,
    city: String,
    state: String,
    country: String,
    addressType: String
  },
  
  isDefaultAddress: {
    type: Boolean,
    default: false
  },
  
  // Payment Information
  paymentMethod: {
    type: String,
    required: true,
    enum: {
      values: ['cod'],
      message: 'Payment method must be cod'
    },
    default: 'cod'
  },
  
  paymentStatus: {
    type: String,
    required: true,
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded'],
      message: 'Payment status must be one of: pending, paid, failed, refunded'
    },
    default: 'pending'
  },
  
  paymentReference: {
    type: String,
    trim: true
  },
  
  // Booking Metadata
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  
  // Status Timestamps
  confirmedAt: {
    type: Date,
    default: null
  },
  
  completedAt: {
    type: Date,
    default: null
  },
  
  cancelledAt: {
    type: Date,
    default: null
  },
  
  // Booking expiration (for pending bookings)
  expiresAt: {
    type: Date,
    default: function() {
      // Pending bookings expire after 15 minutes
      return new Date(Date.now() + 15 * 60 * 1000);
    },
    index: { expireAfterSeconds: 0 }
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
bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ bookingDate: 1, 'timeSlot.slotId': 1 });
bookingSchema.index({ expiresAt: 1 });
bookingSchema.index({ paymentStatus: 1 });

// Pre-save middleware to update timestamps
bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set payment status based on payment method
  if (this.paymentMethod === 'cod') {
    this.paymentStatus = 'paid';
  }
  
  // Set confirmedAt when booking is confirmed
  if (this.isModified('bookingStatus') && this.bookingStatus === 'confirmed') {
    this.confirmedAt = new Date();
  }
  
  // Set completedAt when booking is completed
  if (this.isModified('bookingStatus') && this.bookingStatus === 'completed') {
    this.completedAt = new Date();
  }
  
  // Set cancelledAt when booking is cancelled
  if (this.isModified('bookingStatus') && this.bookingStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }
  
  next();
});

// Instance methods
bookingSchema.methods.toSafeObject = function() {
  const bookingObj = this.toObject();
  delete bookingObj.__v;
  return bookingObj;
};

bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const bookingDate = new Date(this.bookingDate);
  const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);
  
  // Can cancel if booking is pending/confirmed and more than 2 hours before booking
  return (
    ['pending', 'confirmed'].includes(this.bookingStatus) &&
    hoursUntilBooking > 2
  );
};

bookingSchema.methods.canBeRescheduled = function() {
  const now = new Date();
  const bookingDate = new Date(this.bookingDate);
  const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);
  
  // Can reschedule if booking is pending/confirmed and more than 4 hours before booking
  return (
    ['pending', 'confirmed'].includes(this.bookingStatus) &&
    hoursUntilBooking > 4
  );
};

// Static methods
bookingSchema.statics.findByUser = function(userId, options = {}) {
  const { status, limit = 10, skip = 0 } = options;
  
  let query = { user: userId };
  if (status) {
    query.bookingStatus = status;
  }
  
  return this.find(query)
    .sort({ bookingDate: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('timeSlot.slotId', 'startTime endTime maxBookings currentBookings');
};

bookingSchema.statics.findByDate = function(date, slotId) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    bookingDate: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    'timeSlot.slotId': slotId,
    bookingStatus: { $in: ['pending', 'confirmed'] }
  });
};

bookingSchema.statics.getBookingStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        pendingBookings: {
          $sum: { $cond: [{ $eq: ['$bookingStatus', 'pending'] }, 1, 0] }
        },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ['$bookingStatus', 'confirmed'] }, 1, 0] }
        },
        completedBookings: {
          $sum: { $cond: [{ $eq: ['$bookingStatus', 'completed'] }, 1, 0] }
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ['$bookingStatus', 'cancelled'] }, 1, 0] }
        },
        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ['$paymentStatus', 'paid'] },
              '$totalAmount',
              0
            ]
          }
        }
      }
    }
  ]);
};

// Virtual for booking status
bookingSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt && this.bookingStatus === 'pending';
});

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;



