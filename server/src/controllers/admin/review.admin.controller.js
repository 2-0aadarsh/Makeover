import Review from '../../models/review.model.js';
import { User } from '../../models/user.model.js';
import Booking from '../../models/booking.model.js';
import Notification from '../../models/notification.model.js';
import { sendComplaintResponseEmail } from '../../services/email.service.js';
import mongoose from 'mongoose';

/**
 * @route   GET /api/admin/reviews
 * @desc    Get all reviews/complaints with filters, search, and pagination
 * @access  Admin only
 */
export const getAllReviews = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const {
      rating,
      status,
      type,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Rating filter
    if (rating) {
      const ratingNum = parseInt(rating);
      if (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) {
        query.rating = ratingNum;
      }
    }

    // Status filter (reviews: also published/hidden; complaints: pending/reviewed/resolved/dismissed)
    if (status && ['pending', 'reviewed', 'resolved', 'dismissed', 'published', 'hidden'].includes(status)) {
      query.status = status;
    }

    // Type filter
    if (type && ['review', 'complaint'].includes(type)) {
      query.type = type;
    }

    // Search filter (customer name, email, phone, service name, comment)
    if (search) {
      // First, find users matching the search term
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map(user => user._id);

      query.$or = [
        { 'customerDetails.name': { $regex: search, $options: 'i' } },
        { 'customerDetails.email': { $regex: search, $options: 'i' } },
        { 'customerDetails.phone': { $regex: search, $options: 'i' } },
        { serviceName: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } },
        { userId: { $in: userIds } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const reviews = await Review.find(query)
      .populate('userId', 'name email phoneNumber')
      .populate('bookingId', 'orderNumber')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);

    // Format reviews for response
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      _id: review._id,
      customerName: review.customerDetails?.name || review.userId?.name || 'N/A',
      customerEmail: review.customerDetails?.email || review.userId?.email || '',
      customer: review.userId ? {
        name: review.userId.name,
        email: review.userId.email,
        phoneNumber: review.userId.phoneNumber,
      } : null,
      serviceName: review.serviceName || 'N/A',
      orderNumber: review.orderNumber || review.bookingId?.orderNumber || 'N/A',
      rating: review.rating,
      comment: review.comment || 'No comment',
      feedback: review.comment,
      type: review.type || 'review',
      status: review.status || 'pending',
      complaintCategory: review.complaintCategory,
      adminResponse: review.adminResponse,
      respondedAt: review.respondedAt,
      isEdited: review.isEdited,
      editedAt: review.editedAt,
      createdAt: review.createdAt,
      submittedAt: review.createdAt,
      booking: review.bookingId ? {
        orderNumber: review.bookingId.orderNumber,
      } : null,
    }));

    // Calculate filter stats (counts across all reviews/complaints, not filtered)
    const positiveCount = await Review.countDocuments({ type: 'review', rating: { $gte: 4 } });
    // Negative: reviews with 1–2 stars OR complaints (complaints have no rating but are negative feedback)
    const negativeCount = await Review.countDocuments({
      $or: [
        { type: 'review', rating: { $gte: 1, $lte: 2 } },
        { type: 'complaint' },
      ],
    });
    const pendingCount = await Review.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: {
        reviews: formattedReviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalReviews,
          totalItems: totalReviews,
          limit,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          totalReviews,
          positive: positiveCount,
          negative: negativeCount,
          pending: pendingCount,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching reviews',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/admin/reviews/:id
 * @desc    Get review details by ID
 * @access  Admin only
 */
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID',
      });
    }

    const review = await Review.findById(id)
      .populate('userId', 'name email phoneNumber')
      .populate('bookingId')
      .populate('serviceId')
      .lean();

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review retrieved successfully',
      data: review,
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching review',
      error: error.message,
    });
  }
};

/**
 * @route   PATCH /api/admin/reviews/:id/status
 * @desc    Update review/complaint status and optionally respond
 * @access  Admin only
 */
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID',
      });
    }

    // Get the review first to check if it's a complaint
    const existingReview = await Review.findById(id);
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const updateData = {};
    const complaintStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
    const reviewStatuses = [...complaintStatuses, 'published', 'hidden'];
    const allowedStatuses = existingReview.type === 'complaint' ? complaintStatuses : reviewStatuses;
    if (status && allowedStatuses.includes(status)) {
      updateData.status = status;
    }
    if (adminResponse !== undefined) {
      updateData.adminResponse = adminResponse;
    }
    if (status || adminResponse) {
      updateData.respondedBy = req.user.id;
      updateData.respondedAt = new Date();
    }

    const review = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email phoneNumber')
      .lean();

    // Create notification for user if this is a complaint and status changed
    if (existingReview.type === 'complaint' && existingReview.userId && status) {
      try {
        await Notification.createComplaintResponse(
          existingReview.userId,
          { ...existingReview.toObject(), ...updateData },
          status
        );
        
        // Update review to mark user as notified
        await Review.findByIdAndUpdate(id, {
          userNotifiedOfResponse: true,
          userNotifiedAt: new Date(),
        });
        
        console.log(`🔔 Complaint response notification created for user`);
      } catch (notifError) {
        console.error('Failed to create complaint response notification:', notifError);
        // Don't fail the request if notification fails
      }
    }

    // Send complaint response email to user when admin has added a reply
    if (existingReview.type === 'complaint' && review.adminResponse && review.userId) {
      const customerEmail = review.userId.email || review.userId?.email;
      if (customerEmail) {
        setImmediate(async () => {
          try {
            await sendComplaintResponseEmail({
              customerEmail,
              customerName: review.userId.name || review.userId?.name,
              orderNumber: review.orderNumber,
              serviceName: review.serviceName,
              complaintCategory: review.complaintCategory,
              userComment: review.comment,
              adminResponse: review.adminResponse,
              status: review.status,
            });
            console.log(`📧 Complaint response email sent to ${customerEmail}`);
          } catch (emailErr) {
            console.error('Failed to send complaint response email:', emailErr);
          }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Review status updated successfully',
      data: review,
    });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating review status',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/admin/reviews/stats
 * @desc    Get review and complaint statistics
 * @access  Admin only
 */
export const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.getReviewStats();
    
    // Calculate additional metrics
    const totalReviews = await Review.countDocuments({ type: 'review' });
    const totalComplaints = await Review.countDocuments({ type: 'complaint' });
    const pendingComplaints = await Review.countDocuments({ type: 'complaint', status: 'pending' });
    const avgRating = await Review.aggregate([
      { $match: { rating: { $ne: null } } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Review statistics retrieved successfully',
      data: {
        totalReviews,
        totalComplaints,
        pendingComplaints,
        averageRating: avgRating[0]?.avg?.toFixed(1) || 0,
        typeStats: stats.typeStats,
        complaintStatusStats: stats.complaintStatusStats,
      },
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching review statistics',
      error: error.message,
    });
  }
};
