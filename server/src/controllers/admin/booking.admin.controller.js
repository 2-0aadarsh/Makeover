import Booking from '../../models/booking.model.js';
import { User } from '../../models/user.model.js';
import mongoose from 'mongoose';

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all bookings with advanced filters, search, and pagination
 * @access  Admin only
 */
export const getAllBookings = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const {
      status,
      paymentStatus,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Status filter
    if (status && ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'].includes(status)) {
      query.status = status;
    }

    // Payment status filter
    if (paymentStatus && ['pending', 'processing', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
      query.paymentStatus = paymentStatus;
    }

    // Date range filter
    if (startDate || endDate) {
      query['bookingDetails.date'] = {};
      if (startDate) {
        query['bookingDetails.date'].$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query['bookingDetails.date'].$lte = end;
      }
    }

    // Search filter (customer name, email, phone, booking ID)
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
        { orderNumber: { $regex: search, $options: 'i' } },
        { userId: { $in: userIds } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const bookings = await Booking.find(query)
      .populate('userId', 'name email phoneNumber')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalBookings = await Booking.countDocuments(query);
    const totalPages = Math.ceil(totalBookings / limit);

    // Get filter counts for UI
    const filterCounts = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const filters = {
      totalBookings: await Booking.countDocuments(),
      pending: filterCounts.find(f => f._id === 'pending')?.count || 0,
      confirmed: filterCounts.find(f => f._id === 'confirmed')?.count || 0,
      in_progress: filterCounts.find(f => f._id === 'in_progress')?.count || 0,
      completed: filterCounts.find(f => f._id === 'completed')?.count || 0,
      cancelled: filterCounts.find(f => f._id === 'cancelled')?.count || 0,
      no_show: filterCounts.find(f => f._id === 'no_show')?.count || 0
    };

    // Format bookings for response
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      bookingId: booking.orderNumber,
      customerName: booking.userId?.name || 'N/A',
      phoneNumber: booking.userId?.phoneNumber || 'N/A',
      email: booking.userId?.email || 'N/A',
      bookingDate: booking.bookingDetails.date,
      bookingSlot: booking.bookingDetails.slot,
      dateTime: `${new Date(booking.bookingDetails.date).toLocaleDateString('en-IN')} - ${booking.bookingDetails.slot}`,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      totalAmount: booking.pricing.totalAmount,
      formattedAmount: `₹${booking.pricing.totalAmount.toLocaleString('en-IN')}`,
      servicesCount: booking.services.length,
      createdAt: booking.createdAt,
      canBeCancelled: booking.canBeCancelled,
      canBeRescheduled: booking.canBeRescheduled
    }));

    return res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings: formattedBookings,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalBookings: totalBookings,
          limit: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        filters: filters
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/bookings/:id
 * @desc    Get single booking details
 * @access  Admin only
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    // Fetch booking with populated user data
    const booking = await Booking.findById(id)
      .populate('userId', 'name email phoneNumber')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Format response
    const formattedBooking = {
      id: booking._id,
      orderNumber: booking.orderNumber,
      customer: {
        id: booking.userId?._id,
        name: booking.userId?.name || 'N/A',
        email: booking.userId?.email || 'N/A',
        phoneNumber: booking.userId?.phoneNumber || 'N/A'
      },
      services: booking.services.map(service => ({
        name: service.name,
        description: service.description,
        category: service.category,
        price: service.price,
        quantity: service.quantity,
        duration: service.duration,
        subtotal: service.price * service.quantity
      })),
      bookingDetails: {
        date: booking.bookingDetails.date,
        slot: booking.bookingDetails.slot,
        duration: booking.bookingDetails.duration,
        address: booking.bookingDetails.address
      },
      pricing: {
        subtotal: booking.pricing.subtotal,
        taxAmount: booking.pricing.taxAmount,
        totalAmount: booking.pricing.totalAmount,
        formattedTotal: `₹${booking.pricing.totalAmount.toLocaleString('en-IN')}`,
        currency: booking.pricing.currency
      },
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentDetails: booking.paymentDetails,
      cancellationDetails: booking.cancellationDetails,
      reschedulingDetails: booking.reschedulingDetails,
      notes: booking.notes,
      metadata: booking.metadata,
      canBeCancelled: booking.canBeCancelled,
      canBeRescheduled: booking.canBeRescheduled,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    };

    return res.status(200).json({
      success: true,
      message: 'Booking details retrieved successfully',
      data: formattedBooking
    });

  } catch (error) {
    console.error('Error fetching booking details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/admin/bookings/:id/status
 * @desc    Update booking status
 * @access  Admin only
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update status
    booking.status = status;

    // Add admin note if provided
    if (adminNote) {
      booking.notes.admin = adminNote;
    }

    // If status is completed, set completion date
    if (status === 'completed' && booking.paymentStatus === 'completed') {
      // Booking is fully completed
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        id: booking._id,
        orderNumber: booking.orderNumber,
        status: booking.status,
        updatedAt: booking.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/admin/bookings/:id/cancel
 * @desc    Cancel booking (admin action)
 * @access  Admin only
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, refundEligible } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    // Find booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Cancel booking using instance method
    booking.status = 'cancelled';
    booking.cancellationDetails = {
      cancelledAt: new Date(),
      cancelledBy: 'admin',
      cancellationReason: reason || 'Cancelled by admin',
      refundEligible: refundEligible !== undefined ? refundEligible : (booking.paymentStatus === 'completed')
    };

    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        id: booking._id,
        orderNumber: booking.orderNumber,
        status: booking.status,
        cancellationDetails: booking.cancellationDetails
      }
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/bookings/analytics
 * @desc    Get booking analytics and statistics
 * @access  Admin only
 */
export const getBookingAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.createdAt.$lte = end;
      }
    }

    // 1. Bookings by Status
    const bookingsByStatus = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 2. Revenue by Payment Status
    const revenueByPaymentStatus = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    // 3. Top Services
    const topServices = await Booking.aggregate([
      { $match: dateFilter },
      { $unwind: '$services' },
      {
        $group: {
          _id: '$services.name',
          bookingCount: { $sum: 1 },
          totalQuantity: { $sum: '$services.quantity' },
          totalRevenue: { $sum: { $multiply: ['$services.price', '$services.quantity'] } }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 10 }
    ]);

    // 4. Monthly Revenue Trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$pricing.totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 5. Average Booking Value
    const avgBookingValue = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          averageValue: { $avg: '$pricing.totalAmount' },
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    // 6. Cancellation Rate
    const totalBookings = await Booking.countDocuments(dateFilter);
    const cancelledBookings = await Booking.countDocuments({ ...dateFilter, status: 'cancelled' });
    const cancellationRate = totalBookings > 0 ? ((cancelledBookings / totalBookings) * 100).toFixed(2) : 0;

    // 7. Upcoming Bookings
    const now = new Date();
    const upcomingBookings = await Booking.countDocuments({
      'bookingDetails.date': { $gte: now },
      status: { $in: ['pending', 'confirmed'] }
    });

    return res.status(200).json({
      success: true,
      message: 'Booking analytics retrieved successfully',
      data: {
        bookingsByStatus,
        revenueByPaymentStatus,
        topServices: topServices.map(service => ({
          serviceName: service._id,
          bookingCount: service.bookingCount,
          totalQuantity: service.totalQuantity,
          totalRevenue: service.totalRevenue,
          formattedRevenue: `₹${service.totalRevenue.toLocaleString('en-IN')}`
        })),
        monthlyRevenue,
        summary: {
          totalBookings,
          cancelledBookings,
          cancellationRate: parseFloat(cancellationRate),
          upcomingBookings,
          averageBookingValue: avgBookingValue[0]?.averageValue || 0,
          totalRevenue: avgBookingValue[0]?.totalRevenue || 0,
          formattedAvgValue: `₹${(avgBookingValue[0]?.averageValue || 0).toLocaleString('en-IN')}`,
          formattedTotalRevenue: `₹${(avgBookingValue[0]?.totalRevenue || 0).toLocaleString('en-IN')}`
        }
      }
    });

  } catch (error) {
    console.error('Error fetching booking analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booking analytics',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/admin/bookings/:id/payment-status
 * @desc    Update payment status (admin action)
 * @access  Admin only
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, adminNote } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    // Validate payment status
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'];
    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update payment status
    booking.paymentStatus = paymentStatus;

    // Add admin note if provided
    if (adminNote) {
      booking.notes.admin = adminNote;
    }

    // If payment completed, update booking status to confirmed if still pending
    if (paymentStatus === 'completed' && booking.status === 'pending') {
      booking.status = 'confirmed';
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: {
        id: booking._id,
        orderNumber: booking.orderNumber,
        paymentStatus: booking.paymentStatus,
        status: booking.status,
        updatedAt: booking.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};
