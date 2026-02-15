import Notification from '../models/notification.model.js';

/**
 * @route   GET /api/notifications
 * @desc    Get notifications for current user
 * @access  Private
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const notifications = await Notification.getForUser(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true',
    });
    
    // Get total count for pagination
    const totalCount = await Notification.countDocuments({
      userId,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });
    
    // Format response
    const formattedNotifications = notifications.map(notif => ({
      id: notif._id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      isRead: notif.isRead,
      readAt: notif.readAt,
      priority: notif.priority,
      metadata: notif.metadata,
      bookingId: notif.bookingId?._id || null,
      orderNumber: notif.bookingId?.orderNumber || notif.metadata?.orderNumber || null,
      reviewId: notif.reviewId?._id || null,
      createdAt: notif.createdAt,
    }));
    
    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications: formattedNotifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalItems: totalCount,
          hasNextPage: parseInt(page) * parseInt(limit) < totalCount,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications',
    });
  }
};

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notification count for current user
 * @access  Private
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const unreadCount = await Notification.getUnreadCount(userId);
    
    res.status(200).json({
      success: true,
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
    });
  }
};

/**
 * @route   PATCH /api/notifications/:notificationId/read
 * @desc    Mark a notification as read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { notificationId } = req.params;
    
    const notification = await Notification.findOne({
      _id: notificationId,
      userId,
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }
    
    if (notification.isRead) {
      return res.status(200).json({
        success: true,
        message: 'Notification already marked as read',
        data: {
          notificationId: notification._id,
          isRead: notification.isRead,
          readAt: notification.readAt,
        },
      });
    }
    
    await notification.markAsRead();
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: {
        notificationId: notification._id,
        isRead: notification.isRead,
        readAt: notification.readAt,
      },
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
    });
  }
};

/**
 * @route   PATCH /api/notifications/mark-all-read
 * @desc    Mark all notifications as read for current user
 * @access  Private
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const result = await Notification.markAllAsRead(userId);
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
    });
  }
};

/**
 * @route   DELETE /api/notifications/:notificationId
 * @desc    Delete a notification
 * @access  Private
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { notificationId } = req.params;
    
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
    });
  }
};

/**
 * @route   GET /api/notifications/review-requests
 * @desc    Get review request notifications (for toast/badge display)
 * @access  Private
 */
export const getReviewRequestNotifications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const notifications = await Notification.find({
      userId,
      type: 'review_request',
      isRead: false,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('bookingId', 'orderNumber services');
    
    const formattedNotifications = notifications.map(notif => ({
      id: notif._id,
      title: notif.title,
      message: notif.message,
      orderNumber: notif.bookingId?.orderNumber || notif.metadata?.orderNumber,
      serviceName: notif.metadata?.serviceName,
      actionUrl: notif.metadata?.actionUrl,
      createdAt: notif.createdAt,
    }));
    
    res.status(200).json({
      success: true,
      data: {
        count: formattedNotifications.length,
        notifications: formattedNotifications,
      },
    });
  } catch (error) {
    console.error('Error getting review request notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get review request notifications',
    });
  }
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getReviewRequestNotifications,
};
