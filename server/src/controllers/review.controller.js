import {
  verifyReviewToken,
  submitReview,
  editReview,
  getPendingReviews,
  getUserReviews,
} from '../services/review.service.js';
import Review from '../models/review.model.js';

/**
 * @route   GET /api/reviews/testimonials
 * @desc    Get published reviews for public testimonials (no auth)
 * @access  Public
 */
export const getTestimonials = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

    const reviews = await Review.find({
      type: 'review',
      status: 'published',
      comment: { $exists: true, $nin: [null, ''] },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('comment rating customerDetails serviceName orderNumber createdAt')
      .lean();

    const testimonials = reviews.map((r) => ({
      _id: r._id,
      comment: r.comment,
      rating: r.rating,
      customerName: r.customerDetails?.name || 'Customer',
      serviceName: r.serviceName,
      orderNumber: r.orderNumber,
      createdAt: r.createdAt,
    }));

    res.status(200).json({
      success: true,
      message: 'Testimonials retrieved successfully',
      data: {
        testimonials,
        count: testimonials.length,
      },
    });
  } catch (error) {
    console.error('Error getting testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get testimonials',
    });
  }
};

/**
 * @route   GET /api/reviews/testimonials/stats
 * @desc    Get testimonial statistics for homepage (no auth)
 * @access  Public
 */
export const getTestimonialStats = async (req, res) => {
  try {
    // Import models dynamically to avoid circular dependencies
    const Service = (await import('../models/service.model.js')).default;
    const ServiceableCity = (await import('../models/serviceableCity.model.js')).default;

    // Get total distinct services across all categories
    const totalServices = await Service.countDocuments({ isActive: true });

    // Get total published reviews
    const totalReviews = await Review.countDocuments({ 
      type: 'review',
      status: 'published'
    });

    // Calculate average rating from published reviews
    const ratingStats = await Review.aggregate([
      { 
        $match: { 
          type: 'review',
          status: 'published',
          rating: { $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    const avgRating = ratingStats.length > 0 ? ratingStats[0].avgRating : 0;
    const satisfactionRate = avgRating > 0 ? Math.round((avgRating / 5) * 100) : 0;

    // Get active serviceable cities
    const activeCities = await ServiceableCity.find({ isActive: true })
      .sort({ priority: -1, city: 1 })
      .select('city state displayName')
      .limit(20)
      .lean();

    const citiesCount = activeCities.length;
    const citiesList = activeCities.map(c => c.displayName || `${c.city}, ${c.state}`);

    res.status(200).json({
      success: true,
      message: 'Testimonial statistics retrieved successfully',
      data: {
        totalServices,
        totalReviews,
        avgRating: parseFloat(avgRating.toFixed(1)),
        satisfactionRate,
        citiesCount,
        citiesList,
      },
    });
  } catch (error) {
    console.error('Error getting testimonial stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get testimonial statistics',
    });
  }
};

/**
 * @route   GET /api/reviews/verify-token/:token
 * @desc    Verify review token and get booking details
 * @access  Public (token-based)
 */
export const verifyToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Review token is required',
      });
    }
    
    const bookingDetails = await verifyReviewToken(token);
    
    res.status(200).json({
      success: true,
      message: 'Token verified successfully',
      data: bookingDetails,
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Invalid or expired token',
    });
  }
};

/**
 * @route   POST /api/reviews
 * @desc    Submit a review or complaint
 * @access  Public (token-based) or Private (logged in user)
 */
export const createReview = async (req, res) => {
  try {
    const {
      token,
      bookingId,
      type,
      rating,
      comment,
      complaintCategory,
      source,
    } = req.body;
    
    // Get user ID from auth if available
    const userId = req.user?._id || null;
    
    // Validate required fields
    if (!token && !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Either token or bookingId is required',
      });
    }
    
    if (!type || !['review', 'complaint'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "review" or "complaint"',
      });
    }
    
    // Validate based on type
    if (type === 'review' && !rating) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required for reviews',
      });
    }
    
    if (type === 'complaint' && !comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required for complaints',
      });
    }
    
    // Validate rating format
    if (rating && (rating < 0.5 || rating > 5 || (rating * 2) % 1 !== 0)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0.5 and 5 in 0.5 increments',
      });
    }
    
    const review = await submitReview({
      token,
      bookingId,
      type,
      rating,
      comment,
      complaintCategory,
      source: source || (token ? 'email' : 'web'),
      userId,
    });
    
    res.status(201).json({
      success: true,
      message: type === 'review' 
        ? 'Thank you for your review!' 
        : 'Your complaint has been submitted and will be reviewed shortly.',
      data: {
        reviewId: review._id,
        type: review.type,
        rating: review.rating,
        status: review.status,
        editWindowExpiresAt: review.editWindowExpiresAt,
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit review',
    });
  }
};

/**
 * @route   PATCH /api/reviews/:reviewId
 * @desc    Edit an existing review (within 48hr window)
 * @access  Private (authenticated user who owns the review)
 */
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id || req.user.id;
    
    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: 'Review ID is required',
      });
    }
    
    // Validate at least one field to update
    if (rating === undefined && comment === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least rating or comment is required to update',
      });
    }
    
    // Validate rating format if provided
    if (rating !== undefined && (rating < 0.5 || rating > 5 || (rating * 2) % 1 !== 0)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0.5 and 5 in 0.5 increments',
      });
    }
    
    const updatedReview = await editReview(reviewId, userId, { rating, comment });
    
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: {
        reviewId: updatedReview._id,
        rating: updatedReview.rating,
        comment: updatedReview.comment,
        isEdited: updatedReview.isEdited,
        editedAt: updatedReview.editedAt,
        editWindowExpiresAt: updatedReview.editWindowExpiresAt,
        canBeEdited: updatedReview.canBeEdited,
      },
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update review',
    });
  }
};

/**
 * @route   GET /api/reviews/pending
 * @desc    Get bookings pending review for current user
 * @access  Private
 */
export const getPendingReviewsForUser = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const pendingBookings = await getPendingReviews(userId);
    
    // Format response
    const formattedBookings = pendingBookings.map(booking => ({
      bookingId: booking._id,
      orderNumber: booking.orderNumber,
      services: booking.services.map(s => ({
        name: s.name,
        price: s.price,
        quantity: s.quantity,
      })),
      bookingDate: booking.bookingDetails?.date,
      bookingSlot: booking.bookingDetails?.slot,
      status: booking.status,
      completedAt: booking.updatedAt,
    }));
    
    res.status(200).json({
      success: true,
      message: 'Pending reviews retrieved successfully',
      data: {
        count: formattedBookings.length,
        bookings: formattedBookings,
      },
    });
  } catch (error) {
    console.error('Error getting pending reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending reviews',
    });
  }
};

/**
 * @route   GET /api/reviews/my-reviews
 * @desc    Get user's submitted reviews
 * @access  Private
 */
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const result = await getUserReviews(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
    });
    
    // Format response
    const formattedReviews = result.reviews.map(review => ({
      _id: review._id,
      orderNumber: review.orderNumber,
      serviceName: review.serviceName,
      type: review.type,
      rating: review.rating,
      comment: review.comment,
      complaintCategory: review.complaintCategory,
      status: review.status,
      adminResponse: review.adminResponse,
      respondedAt: review.respondedAt,
      respondedBy: review.respondedBy,
      isEdited: review.isEdited,
      editedAt: review.editedAt,
      editWindowExpiresAt: review.editWindowExpiresAt,
      canBeEdited: review.canBeEdited,
      editTimeRemaining: review.editTimeRemaining,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));
    
    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: {
        reviews: formattedReviews,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    console.error('Error getting user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews',
    });
  }
};

/**
 * @route   GET /api/reviews/:reviewId
 * @desc    Get a specific review by ID
 * @access  Private (owner or admin)
 */
export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id || req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    const review = await Review.findById(reviewId)
      .populate('bookingId', 'orderNumber services bookingDetails status')
      .populate('respondedBy', 'name');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }
    
    // Check access: owner or admin
    if (!isAdmin && review.userId?.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this review',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Review retrieved successfully',
      data: {
        reviewId: review._id,
        orderNumber: review.orderNumber,
        serviceName: review.serviceName,
        type: review.type,
        rating: review.rating,
        comment: review.comment,
        complaintCategory: review.complaintCategory,
        status: review.status,
        adminResponse: review.adminResponse,
        respondedBy: review.respondedBy?.name || null,
        respondedAt: review.respondedAt,
        isEdited: review.isEdited,
        editedAt: review.editedAt,
        canBeEdited: review.canBeEdited,
        editTimeRemaining: review.editTimeRemaining,
        source: review.source,
        booking: review.bookingId ? {
          orderNumber: review.bookingId.orderNumber,
          services: review.bookingId.services,
          bookingDate: review.bookingId.bookingDetails?.date,
          bookingSlot: review.bookingId.bookingDetails?.slot,
          status: review.bookingId.status,
        } : null,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error getting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get review',
    });
  }
};

export default {
  verifyToken,
  createReview,
  updateReview,
  getPendingReviewsForUser,
  getMyReviews,
  getReviewById,
  getTestimonials,
};
