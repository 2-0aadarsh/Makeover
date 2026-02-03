import Booking from '../models/booking.model.js';
import Review from '../models/review.model.js';
import Notification from '../models/notification.model.js';
import { generateReviewToken, generateTokenExpiry, isTokenExpired } from '../utils/reviewToken.utils.js';
import { sendReviewRequestEmail } from './email.service.js';

/**
 * Trigger review request for a booking
 * - Generates secure token
 * - Updates booking with review details
 * - Sends email notification
 * - Creates in-app notification
 * 
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Updated booking
 */
export const triggerReviewRequest = async (bookingId) => {
  try {
    // Find the booking and populate user details
    const booking = await Booking.findById(bookingId)
      .populate('userId', 'name email phone');
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Check if review was already requested
    if (booking.reviewDetails?.reviewRequestedAt) {
      console.log(`📝 Review already requested for booking: ${booking.orderNumber}`);
      return booking;
    }
    
    // Check if booking is in a reviewable state
    if (!['completed', 'cancelled', 'no_show'].includes(booking.status)) {
      throw new Error('Booking is not in a reviewable state');
    }
    
    // Generate review token
    const reviewToken = generateReviewToken();
    const reviewTokenExpiry = generateTokenExpiry(90); // 90 days
    
    // Update booking with review details
    booking.reviewDetails = {
      reviewRequestedAt: new Date(),
      reviewToken: reviewToken,
      reviewTokenExpiry: reviewTokenExpiry,
      reviewSubmittedAt: null,
      reviewId: null,
    };
    
    await booking.save();
    
    console.log(`✅ Review token generated for booking: ${booking.orderNumber}`);
    
    // Send email notification (non-blocking)
    setImmediate(async () => {
      try {
        await sendReviewRequestEmail({
          customerName: booking.userId?.name || 'Valued Customer',
          customerEmail: booking.userId?.email,
          orderNumber: booking.orderNumber,
          services: booking.services,
          bookingDate: booking.bookingDetails?.date,
          reviewToken: reviewToken,
          bookingStatus: booking.status,
        });
        console.log(`📧 Review request email sent for booking: ${booking.orderNumber}`);
      } catch (emailError) {
        console.error(`❌ Failed to send review request email:`, emailError);
        // Don't throw - email failure shouldn't break the flow
      }
    });
    
    // Create in-app notification (non-blocking)
    setImmediate(async () => {
      try {
        await Notification.createReviewRequest(booking.userId._id, booking);
        console.log(`🔔 Review notification created for booking: ${booking.orderNumber}`);
      } catch (notifError) {
        console.error(`❌ Failed to create review notification:`, notifError);
        // Don't throw - notification failure shouldn't break the flow
      }
    });
    
    return booking;
  } catch (error) {
    console.error('Error triggering review request:', error);
    throw error;
  }
};

/**
 * Verify review token and get booking details
 * @param {string} token - Review token
 * @returns {Promise<Object>} Booking details if valid
 */
export const verifyReviewToken = async (token) => {
  try {
    const booking = await Booking.findByReviewToken(token);
    
    if (!booking) {
      throw new Error('Invalid or expired review token');
    }
    
    // Check if already reviewed
    if (booking.reviewDetails?.reviewSubmittedAt) {
      throw new Error('Review has already been submitted for this booking');
    }
    
    // Return booking info for the review form
    return {
      bookingId: booking._id,
      orderNumber: booking.orderNumber,
      services: booking.services,
      bookingDate: booking.bookingDetails?.date,
      bookingSlot: booking.bookingDetails?.slot,
      status: booking.status,
      customerName: booking.userId?.name,
      customerEmail: booking.userId?.email,
    };
  } catch (error) {
    console.error('Error verifying review token:', error);
    throw error;
  }
};

/**
 * Submit a review or complaint
 * @param {Object} reviewData - Review data
 * @param {string} reviewData.bookingId - Booking ID
 * @param {string} reviewData.token - Review token (optional - for email submissions)
 * @param {string} reviewData.type - 'review' or 'complaint'
 * @param {number} reviewData.rating - Rating (0.5-5 in 0.5 increments)
 * @param {string} reviewData.comment - Review/complaint text
 * @param {string} reviewData.complaintCategory - Category for complaints
 * @param {string} reviewData.source - 'email', 'web', or 'mobile'
 * @param {string} reviewData.userId - User ID (optional - for logged in users)
 * @returns {Promise<Object>} Created review
 */
export const submitReview = async (reviewData) => {
  try {
    const {
      bookingId,
      token,
      type = 'review',
      rating,
      comment,
      complaintCategory,
      source = 'web',
      userId,
    } = reviewData;
    
    // Find the booking
    let booking;
    
    if (token) {
      // Token-based submission (from email)
      booking = await Booking.findByReviewToken(token);
      if (!booking) {
        throw new Error('Invalid or expired review token');
      }
    } else if (bookingId) {
      // Direct submission (logged in user)
      booking = await Booking.findById(bookingId).populate('userId', 'name email phone');
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Verify user owns this booking (if userId provided)
      if (userId && booking.userId._id.toString() !== userId.toString()) {
        throw new Error('You are not authorized to review this booking');
      }
    } else {
      throw new Error('Either bookingId or token is required');
    }
    
    // Check if already reviewed
    if (booking.reviewDetails?.reviewSubmittedAt) {
      throw new Error('Review has already been submitted for this booking');
    }
    
    // Validate based on type
    if (type === 'review' && !rating) {
      throw new Error('Rating is required for reviews');
    }
    
    if (type === 'complaint' && !comment) {
      throw new Error('Comment is required for complaints');
    }
    
    // Build service name string
    const serviceName = booking.services.map(s => s.name).join(', ');
    
    // Create the review
    const review = new Review({
      userId: booking.userId._id,
      bookingId: booking._id,
      orderNumber: booking.orderNumber,
      customerDetails: {
        name: booking.userId?.name || 'Unknown',
        email: booking.userId?.email,
        phone: booking.userId?.phone || booking.bookingDetails?.address?.phone,
      },
      serviceName,
      rating: rating || null,
      comment: comment || '',
      type,
      complaintCategory: type === 'complaint' ? complaintCategory : null,
      status: type === 'complaint' ? 'pending' : 'reviewed',
      source,
    });
    
    await review.save();
    
    // Update booking with review submission info
    booking.reviewDetails.reviewSubmittedAt = new Date();
    booking.reviewDetails.reviewId = review._id;
    await booking.save();
    
    console.log(`✅ ${type === 'review' ? 'Review' : 'Complaint'} submitted for booking: ${booking.orderNumber}`);
    
    // Mark the review_request notification as read (non-blocking)
    setImmediate(async () => {
      try {
        // Find and mark as read all review_request notifications for this booking
        await Notification.updateMany(
          {
            userId: booking.userId._id,
            bookingId: booking._id,
            type: 'review_request',
            isRead: false,
          },
          {
            $set: {
              isRead: true,
              readAt: new Date(),
            },
          }
        );
        console.log(`🔔 Review request notification marked as read for booking: ${booking.orderNumber}`);
      } catch (notifError) {
        console.error(`❌ Failed to mark review notification as read:`, notifError);
      }
    });
    
    return review;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

/**
 * Edit an existing review (within edit window)
 * @param {string} reviewId - Review ID
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated review
 */
export const editReview = async (reviewId, userId, updates) => {
  try {
    const review = await Review.findById(reviewId);
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    // Check ownership and edit window
    if (!review.canUserEdit(userId)) {
      throw new Error('You cannot edit this review. Either you are not the owner or the edit window has expired.');
    }
    
    // Only allow updating rating and comment
    if (updates.rating !== undefined) {
      review.rating = updates.rating;
    }
    
    if (updates.comment !== undefined) {
      review.comment = updates.comment;
    }
    
    await review.save();
    
    console.log(`✏️ Review edited: ${reviewId}`);
    
    return review;
  } catch (error) {
    console.error('Error editing review:', error);
    throw error;
  }
};

/**
 * Get pending reviews for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Bookings pending review
 */
export const getPendingReviews = async (userId) => {
  try {
    const bookings = await Booking.findPendingReviewBookings(userId);
    return bookings;
  } catch (error) {
    console.error('Error getting pending reviews:', error);
    throw error;
  }
};

/**
 * Get user's submitted reviews
 * @param {string} userId - User ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Array>} User's reviews
 */
export const getUserReviews = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 10 } = options;
    
    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('bookingId', 'orderNumber services bookingDetails');
    
    const total = await Review.countDocuments({ userId });
    
    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error getting user reviews:', error);
    throw error;
  }
};

/**
 * Respond to a complaint (admin only)
 * @param {string} reviewId - Review/Complaint ID
 * @param {string} adminId - Admin user ID
 * @param {string} response - Admin response text
 * @param {string} newStatus - New status
 * @returns {Promise<Object>} Updated review
 */
export const respondToComplaint = async (reviewId, adminId, response, newStatus = 'reviewed') => {
  try {
    const review = await Review.findById(reviewId);
    
    if (!review) {
      throw new Error('Complaint not found');
    }
    
    if (review.type !== 'complaint') {
      throw new Error('This is not a complaint');
    }
    
    // Update the complaint
    await review.respondToComplaint(adminId, response, newStatus);
    
    // Create notification for user
    if (review.userId) {
      try {
        await Notification.createComplaintResponse(review.userId, review, newStatus);
        
        // Mark review as user notified
        review.userNotifiedOfResponse = true;
        review.userNotifiedAt = new Date();
        await review.save();
        
        console.log(`🔔 Complaint response notification created for user`);
      } catch (notifError) {
        console.error('Failed to create complaint response notification:', notifError);
      }
    }
    
    console.log(`✅ Complaint ${reviewId} responded to with status: ${newStatus}`);
    
    return review;
  } catch (error) {
    console.error('Error responding to complaint:', error);
    throw error;
  }
};

export default {
  triggerReviewRequest,
  verifyReviewToken,
  submitReview,
  editReview,
  getPendingReviews,
  getUserReviews,
  respondToComplaint,
};
