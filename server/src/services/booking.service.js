import Booking from '../models/booking.model.js';
import { generatePaymentReference } from '../utils/payment.utils.js';

class BookingService {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const booking = new Booking(bookingData);
      await booking.save();
      
      return {
        success: true,
        data: booking,
        message: 'Booking created successfully'
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      
      if (error.code === 11000) {
        return {
          success: false,
          message: 'Order number already exists',
          error: 'DUPLICATE_ORDER'
        };
      }
      
      return {
        success: false,
        message: 'Failed to create booking',
        error: error.message
      };
    }
  }

  // Get all bookings for a user
  async getUserBookings(userId, options = {}) {
    try {
      const { status, dateFrom, dateTo, service, page = 1, limit = 10 } = options;
      
      const query = { userId };
      
      // Apply filters
      if (status) {
        query.status = status;
      }
      
      if (dateFrom || dateTo) {
        query['bookingDetails.date'] = {};
        if (dateFrom) query['bookingDetails.date'].$gte = new Date(dateFrom);
        if (dateTo) query['bookingDetails.date'].$lte = new Date(dateTo);
      }
      
      if (service) {
        query['services.name'] = { $regex: service, $options: 'i' };
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Execute query with pagination
      const [bookings, totalCount] = await Promise.all([
        Booking.find(query)
          .sort({ createdAt: -1 })
          .populate('userId', 'name email phone')
          .skip(skip)
          .limit(limit)
          .lean(),
        Booking.countDocuments(query)
      ]);
      
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        success: true,
        data: {
          bookings,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        },
        message: 'Bookings retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return {
        success: false,
        message: 'Failed to fetch bookings',
        error: error.message
      };
    }
  }

  // Get a specific booking by ID
  async getBookingById(bookingId, userId = null) {
    try {
      const query = { _id: bookingId };
      
      // If userId is provided, ensure user owns the booking
      if (userId) {
        query.userId = userId;
      }
      
      const booking = await Booking.findOne(query)
        .populate('userId', 'name email phone')
        .lean();
      
      if (!booking) {
        return {
          success: false,
          message: 'Booking not found',
          error: 'NOT_FOUND'
        };
      }
      
      return {
        success: true,
        data: booking,
        message: 'Booking retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        message: 'Failed to fetch booking',
        error: error.message
      };
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId, status, updatedBy = 'system', notes = null) {
    try {
      const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
      
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: 'Invalid booking status',
          error: 'INVALID_STATUS'
        };
      }
      
      const updateData = { status };
      
      // Add status-specific timestamps
      if (status === 'cancelled') {
        updateData['cancellationDetails.cancelledAt'] = new Date();
        updateData['cancellationDetails.cancelledBy'] = updatedBy;
      }
      
      if (status === 'completed') {
        updateData.completedAt = new Date();
      }
      
      if (notes) {
        updateData['notes.admin'] = notes;
      }
      
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!booking) {
        return {
          success: false,
          message: 'Booking not found',
          error: 'NOT_FOUND'
        };
      }
      
      return {
        success: true,
        data: booking,
        message: `Booking status updated to ${status}`
      };
    } catch (error) {
      console.error('Error updating booking status:', error);
      return {
        success: false,
        message: 'Failed to update booking status',
        error: error.message
      };
    }
  }

  // Cancel a booking
  async cancelBooking(bookingId, cancellationReason, cancelledBy = 'customer') {
    try {
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        return {
          success: false,
          message: 'Booking not found',
          error: 'NOT_FOUND'
        };
      }
      
      if (!booking.canBeCancelled) {
        return {
          success: false,
          message: 'This booking cannot be cancelled',
          error: 'CANNOT_CANCEL'
        };
      }
      
      await booking.cancelBooking(cancellationReason, cancelledBy);
      
      return {
        success: true,
        data: booking,
        message: 'Booking cancelled successfully',
        refundEligible: booking.cancellationDetails.refundEligible
      };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        message: 'Failed to cancel booking',
        error: error.message
      };
    }
  }

  // Reschedule a booking
  async rescheduleBooking(bookingId, newDate, newSlot, rescheduledBy = 'customer') {
    try {
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        return {
          success: false,
          message: 'Booking not found',
          error: 'NOT_FOUND'
        };
      }
      
      // Check slot availability
      const conflictingBookings = await Booking.find({
        _id: { $ne: bookingId },
        'bookingDetails.date': new Date(newDate),
        'bookingDetails.slot': newSlot,
        status: { $in: ['confirmed', 'pending'] }
      });
      
      if (conflictingBookings.length > 0) {
        return {
          success: false,
          message: 'This time slot is already booked',
          error: 'SLOT_UNAVAILABLE'
        };
      }
      
      await booking.rescheduleBooking(newDate, newSlot, rescheduledBy);
      
      return {
        success: true,
        data: booking,
        message: 'Booking rescheduled successfully'
      };
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      return {
        success: false,
        message: 'Failed to reschedule booking',
        error: error.message
      };
    }
  }

  // Update payment status
  async updatePaymentStatus(bookingId, paymentDetails) {
    try {
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        return {
          success: false,
          message: 'Booking not found',
          error: 'NOT_FOUND'
        };
      }
      
      await booking.completePayment(paymentDetails);
      
      return {
        success: true,
        data: booking,
        message: 'Payment status updated successfully'
      };
    } catch (error) {
      console.error('Error updating payment status:', error);
      return {
        success: false,
        message: 'Failed to update payment status',
        error: error.message
      };
    }
  }

  // Get booking statistics for a user
  async getBookingStats(userId) {
    try {
      const stats = await Booking.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalSpent: { $sum: '$pricing.totalAmount' },
            completedBookings: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            cancelledBookings: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            },
            upcomingBookings: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$bookingDetails.date', new Date()] },
                      { $in: ['$status', ['confirmed', 'pending']] }
                    ]
              }, 1, 0]
            }
          }
        }
      }]);

      const statusCounts = await Booking.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      return {
        success: true,
        data: {
          ...stats[0],
          statusBreakdown: statusCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        message: 'Booking statistics retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      return {
        success: false,
        message: 'Failed to fetch booking statistics',
        error: error.message
      };
    }
  }

  // Get upcoming bookings for a user
  async getUpcomingBookings(userId, limit = 5) {
    try {
      const bookings = await Booking.findUpcomingBookings(userId).limit(limit);
      
      return {
        success: true,
        data: bookings,
        message: 'Upcoming bookings retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      return {
        success: false,
        message: 'Failed to fetch upcoming bookings',
        error: error.message
      };
    }
  }

  // Search bookings
  async searchBookings(userId, searchQuery, options = {}) {
    try {
      const { status, dateFrom, dateTo, page = 1, limit = 10 } = options;
      
      const query = {
        userId,
        $or: [
          { orderNumber: { $regex: searchQuery, $options: 'i' } },
          { 'services.name': { $regex: searchQuery, $options: 'i' } },
          { 'bookingDetails.address.city': { $regex: searchQuery, $options: 'i' } },
          { 'bookingDetails.address.state': { $regex: searchQuery, $options: 'i' } }
        ]
      };
      
      if (status) {
        query.status = status;
      }
      
      if (dateFrom || dateTo) {
        query['bookingDetails.date'] = {};
        if (dateFrom) query['bookingDetails.date'].$gte = new Date(dateFrom);
        if (dateTo) query['bookingDetails.date'].$lte = new Date(dateTo);
      }
      
      const skip = (page - 1) * limit;
      
      const [bookings, totalCount] = await Promise.all([
        Booking.find(query)
          .sort({ createdAt: -1 })
          .populate('userId', 'name email phone')
          .skip(skip)
          .limit(limit)
          .lean(),
        Booking.countDocuments(query)
      ]);
      
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        success: true,
        data: {
          bookings,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        },
        message: 'Search results retrieved successfully'
      };
    } catch (error) {
      console.error('Error searching bookings:', error);
      return {
        success: false,
        message: 'Failed to search bookings',
        error: error.message
      };
    }
  }

  // Get booking analytics (for admin)
  async getBookingAnalytics(filters = {}) {
    try {
      const { dateFrom, dateTo, status } = filters;
      
      const matchQuery = {};
      
      if (dateFrom || dateTo) {
        matchQuery.createdAt = {};
        if (dateFrom) matchQuery.createdAt.$gte = new Date(dateFrom);
        if (dateTo) matchQuery.createdAt.$lte = new Date(dateTo);
      }
      
      if (status) {
        matchQuery.status = status;
      }
      
      const analytics = await Booking.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.totalAmount' },
            averageBookingValue: { $avg: '$pricing.totalAmount' },
            statusBreakdown: {
              $push: '$status'
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalBookings: 1,
            totalRevenue: 1,
            averageBookingValue: { $round: ['$averageBookingValue', 2] },
            statusCounts: {
              $reduce: {
                input: '$statusBreakdown',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $let: {
                        vars: { status: '$$this' },
                        in: {
                          $arrayToObject: [
                            [{
                              k: '$$status',
                              v: { $add: [{ $ifNull: [{ $getField: { field: '$$status', input: '$$value' } }, 0] }, 1] }
                            }]
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]);
      
      return {
        success: true,
        data: analytics[0] || {
          totalBookings: 0,
          totalRevenue: 0,
          averageBookingValue: 0,
          statusCounts: {}
        },
        message: 'Booking analytics retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching booking analytics:', error);
      return {
        success: false,
        message: 'Failed to fetch booking analytics',
        error: error.message
      };
    }
  }
}

export default new BookingService();
