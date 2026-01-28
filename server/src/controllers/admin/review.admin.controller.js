import Review from '../../models/review.model.js';
import { User } from '../../models/user.model.js';
import Booking from '../../models/booking.model.js';
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

    // Status filter (for complaints)
    if (status && ['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
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
      customerName: review.customerDetails?.name || review.userId?.name || 'N/A',
      customer: review.userId ? {
        name: review.userId.name,
        email: review.userId.email,
        phoneNumber: review.userId.phoneNumber,
      } : null,
      serviceName: review.serviceName || 'N/A',
      rating: review.rating,
      comment: review.comment || 'No comment',
      feedback: review.comment,
      type: review.type,
      status: review.status,
      createdAt: review.createdAt,
      submittedAt: review.createdAt,
      booking: review.bookingId ? {
        orderNumber: review.bookingId.orderNumber,
      } : null,
    }));

    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: formattedReviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalReviews,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
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
 * @desc    Update review/complaint status
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

    const updateData = {};
    if (status && ['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
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

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
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
