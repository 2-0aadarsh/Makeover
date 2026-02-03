import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // User who receives the notification
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // Notification type
    type: {
      type: String,
      enum: [
        'review_request',      // Prompt to review a completed booking
        'complaint_response',  // Admin responded to complaint
        'review_reminder',     // Reminder to submit review
        'booking_completed',   // Booking marked as completed
        'system'               // System notifications
      ],
      required: [true, 'Notification type is required'],
    },

    // Title for the notification
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    // Message content
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },

    // Related booking (optional)
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },

    // Related review (optional - for complaint responses)
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      default: null,
    },

    // Additional metadata
    metadata: {
      orderNumber: {
        type: String,
        default: null,
      },
      serviceName: {
        type: String,
        default: null,
      },
      complaintStatus: {
        type: String,
        default: null,
      },
      actionUrl: {
        type: String,
        default: null,
      },
    },

    // Read status
    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // Expiry (optional - for time-sensitive notifications)
    expiresAt: {
      type: Date,
      default: null,
    },

    // Priority level
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

// Instance method: Mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method: Get unread count for user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ 
    userId, 
    isRead: false,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Static method: Get notifications for user with pagination
notificationSchema.statics.getForUser = function(userId, options = {}) {
  const { page = 1, limit = 20, unreadOnly = false } = options;
  
  const query = { 
    userId,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  };
  
  if (unreadOnly) {
    query.isRead = false;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('bookingId', 'orderNumber services status')
    .populate('reviewId', 'type status adminResponse');
};

// Static method: Mark all as read for user
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

// Static method: Create review request notification
notificationSchema.statics.createReviewRequest = function(userId, booking) {
  const serviceNames = booking.services.map(s => s.name).join(', ');
  
  return this.create({
    userId,
    type: 'review_request',
    title: 'How was your experience?',
    message: `Your booking for ${serviceNames} has been completed. We'd love to hear your feedback!`,
    bookingId: booking._id,
    metadata: {
      orderNumber: booking.orderNumber,
      serviceName: serviceNames,
      actionUrl: `/reviews/submit?booking=${booking._id}`,
    },
    priority: 'normal',
  });
};

// Static method: Create complaint response notification
notificationSchema.statics.createComplaintResponse = function(userId, review, newStatus) {
  const statusMessages = {
    reviewed: 'Your complaint is being reviewed by our team.',
    resolved: 'Your complaint has been resolved.',
    dismissed: 'Your complaint has been reviewed and closed.',
  };
  
  const adminResponse = review.adminResponse || '';
  const hasAdminReply = adminResponse && adminResponse.trim().length > 0;
  // Show admin reply in message when present (truncate for list view); otherwise status message
  const message = hasAdminReply
    ? (adminResponse.length > 200 ? adminResponse.slice(0, 200) + '…' : adminResponse)
    : (statusMessages[newStatus] || 'There is an update on your complaint.');
  
  const metadata = {
    orderNumber: review.orderNumber,
    complaintStatus: newStatus,
    actionUrl: `/my-reviews`,
    adminResponse: hasAdminReply ? adminResponse : undefined,
    serviceName: review.serviceName,
  };
  
  return this.create({
    userId,
    type: 'complaint_response',
    title: hasAdminReply ? 'Reply to your complaint' : 'Update on your complaint',
    message,
    reviewId: review._id,
    bookingId: review.bookingId,
    metadata,
    priority: 'high',
  });
};

// Static method: Delete old read notifications (cleanup job)
notificationSchema.statics.cleanupOldNotifications = function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    isRead: true,
    createdAt: { $lt: cutoffDate }
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
