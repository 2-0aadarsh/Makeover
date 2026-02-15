import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getReviewRequestNotifications,
} from '../controllers/notification.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const notificationRouter = express.Router();

// All routes require authentication
notificationRouter.use(checkAuth);

/**
 * @route   GET /api/notifications
 * @desc    Get notifications for current user (paginated)
 * @access  Private
 */
notificationRouter.get('/', getNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notification count for current user
 * @access  Private
 */
notificationRouter.get('/unread-count', getUnreadCount);

/**
 * @route   GET /api/notifications/review-requests
 * @desc    Get pending review request notifications
 * @access  Private
 */
notificationRouter.get('/review-requests', getReviewRequestNotifications);

/**
 * @route   PATCH /api/notifications/mark-all-read
 * @desc    Mark all notifications as read for current user
 * @access  Private
 */
notificationRouter.patch('/mark-all-read', markAllAsRead);

/**
 * @route   PATCH /api/notifications/:notificationId/read
 * @desc    Mark a notification as read
 * @access  Private
 */
notificationRouter.patch('/:notificationId/read', markAsRead);

/**
 * @route   DELETE /api/notifications/:notificationId
 * @desc    Delete a notification
 * @access  Private
 */
notificationRouter.delete('/:notificationId', deleteNotification);

export default notificationRouter;
