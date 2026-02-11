import { User } from '../../models/user.model.js';
import Booking from '../../models/booking.model.js';
import Order from '../../models/order.model.js';
import Payment from '../../models/payment.model.js';
import Enquiry from '../../models/enquiry.model.js';

/**
 * @route   GET /api/admin/dashboard/metrics
 * @desc    Get dashboard metrics (Total Users, Total Bookings, Total Revenue, Upcoming Bookings)
 * @access  Admin only
 */
export const getDashboardMetrics = async (req, res) => {
  try {
    // Get current date for calculations
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // 1. Total Users Count
    const totalUsers = await User.countDocuments();
    const usersYesterday = await User.countDocuments({
      createdAt: { $lt: yesterday }
    });
    const userGrowth = usersYesterday > 0 
      ? (((totalUsers - usersYesterday) / usersYesterday) * 100).toFixed(1)
      : 0;

    // 2. Total Bookings Count (using Booking model)
    const totalBookings = await Booking.countDocuments();
    const bookingsLastWeek = await Booking.countDocuments({
      createdAt: { $lt: lastWeek }
    });
    const bookingGrowth = bookingsLastWeek > 0
      ? (((totalBookings - bookingsLastWeek) / bookingsLastWeek) * 100).toFixed(1)
      : 0;

    // 3. Total Revenue (from completed bookings)
    const revenueData = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Revenue from yesterday for comparison
    const revenueYesterday = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          'paymentDetails.paidAt': { $lt: yesterday }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    const revenueYesterdayAmount = revenueYesterday.length > 0 ? revenueYesterday[0].totalRevenue : 0;
    const revenueGrowth = revenueYesterdayAmount > 0
      ? (((totalRevenue - revenueYesterdayAmount) / revenueYesterdayAmount) * 100).toFixed(1)
      : 0;

    // 4. Upcoming Bookings (future bookings with pending/confirmed status)
    const upcomingBookings = await Booking.countDocuments({
      'bookingDetails.date': { $gte: now },
      status: { $in: ['pending', 'confirmed'] }
    });

    const upcomingLastWeek = await Booking.countDocuments({
      'bookingDetails.date': { $gte: now },
      status: { $in: ['pending', 'confirmed'] },
      createdAt: { $lt: lastWeek }
    });

    const upcomingGrowth = upcomingLastWeek > 0
      ? (((upcomingBookings - upcomingLastWeek) / upcomingLastWeek) * 100).toFixed(1)
      : 0;

    // Return metrics
    return res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved successfully',
      data: {
        totalUsers: {
          count: totalUsers,
          growth: parseFloat(userGrowth),
          trend: userGrowth >= 0 ? 'up' : 'down',
          label: 'Down from yesterday'
        },
        totalBookings: {
          count: totalBookings,
          growth: parseFloat(bookingGrowth),
          trend: bookingGrowth >= 0 ? 'up' : 'down',
          label: 'Up from past week'
        },
        totalRevenue: {
          amount: totalRevenue,
          formattedAmount: `₹${totalRevenue.toLocaleString('en-IN')}`,
          growth: parseFloat(revenueGrowth),
          trend: revenueGrowth >= 0 ? 'up' : 'down',
          label: 'Up from yesterday'
        },
        upcomingBookings: {
          count: upcomingBookings,
          growth: parseFloat(upcomingGrowth),
          trend: upcomingGrowth >= 0 ? 'up' : 'down',
          label: 'Up from yesterday'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard metrics',
      error: error.message
    });
  }
};

/**
 * Get start and end dates for dashboard booking period (server local time).
 * @param {'today'|'tomorrow'|'week'} period
 * @returns {{ start: Date, end: Date }} end is exclusive for today/tomorrow, end of day for week
 */
function getBookingPeriodRange(period) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  if (period === 'today') {
    const end = new Date(today);
    end.setDate(end.getDate() + 1);
    return { start: today, end };
  }

  if (period === 'tomorrow') {
    const start = new Date(today);
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end };
  }

  if (period === 'week') {
    // This week: Monday 00:00:00 to Sunday 23:59:59.999 (local)
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const start = new Date(today);
    start.setDate(today.getDate() - daysToMonday);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // default fallback to today
  const end = new Date(today);
  end.setDate(end.getDate() + 1);
  return { start: today, end };
}

/**
 * @route   GET /api/admin/dashboard/today-bookings
 * @desc    Get bookings for a period with pagination. Query: period=today|tomorrow|week (default: today)
 * @query   period - today | tomorrow | week (default: today)
 * @query   page, limit, status - optional pagination and status filter
 * @access  Admin only
 */
export const getTodayBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const statusFilter = req.query.status;

    const period = (req.query.period || 'today').toLowerCase();
    const validPeriods = ['today', 'tomorrow', 'week'];
    const periodKey = validPeriods.includes(period) ? period : 'today';

    const { start, end } = getBookingPeriodRange(periodKey);

    const query = {
      'bookingDetails.date': periodKey === 'week'
        ? { $gte: start, $lte: end }
        : { $gte: start, $lt: end }
    };

    if (statusFilter && ['pending', 'confirmed', 'completed', 'cancelled'].includes(statusFilter)) {
      query.status = statusFilter;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalBookings = await Booking.countDocuments(query);
    const totalPages = Math.ceil(totalBookings / limit);

    const formattedBookings = bookings.map(booking => ({
      bookingId: booking.orderNumber,
      customerName: booking.userId?.name || 'N/A',
      phoneNumber: booking.userId?.phoneNumber || 'N/A',
      email: booking.userId?.email || 'N/A',
      dateTime: `${new Date(booking.bookingDetails.date).toLocaleDateString('en-IN')} - ${booking.bookingDetails.slot}`,
      status: booking.status,
      totalAmount: booking.pricing.totalAmount,
      formattedAmount: `₹${booking.pricing.totalAmount.toLocaleString('en-IN')}`,
      paymentStatus: booking.paymentStatus,
      services: booking.services.map(service => ({
        name: service.name,
        quantity: service.quantity,
        price: service.price
      })),
      createdAt: booking.createdAt
    }));

    const messages = {
      today: "Today's bookings retrieved successfully",
      tomorrow: "Tomorrow's bookings retrieved successfully",
      week: "This week's bookings retrieved successfully"
    };

    return res.status(200).json({
      success: true,
      message: messages[periodKey],
      data: {
        period: periodKey,
        bookings: formattedBookings,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalBookings: totalBookings,
          limit: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard bookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/dashboard/recent-activity
 * @desc    Get recent activity (bookings, enquiries, new users)
 * @access  Admin only
 */
export const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Get recent enquiries
    const recentEnquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Get recent users
    const recentUsers = await User.find()
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Recent activity retrieved successfully',
      data: {
        recentBookings: recentBookings.map(booking => ({
          id: booking._id,
          orderNumber: booking.orderNumber,
          customerName: booking.userId?.name || 'N/A',
          amount: booking.pricing.totalAmount,
          status: booking.status,
          createdAt: booking.createdAt
        })),
        recentEnquiries: recentEnquiries.map(enquiry => ({
          id: enquiry._id,
          enquiryNumber: enquiry.enquiryNumber,
          customerName: enquiry.userDetails.name,
          service: enquiry.serviceDetails.serviceName,
          status: enquiry.status,
          createdAt: enquiry.createdAt
        })),
        recentUsers: recentUsers.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get additional statistics (booking status breakdown, revenue trends)
 * @access  Admin only
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Booking status breakdown
    const bookingStatusBreakdown = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Payment status breakdown
    const paymentStatusBreakdown = await Booking.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          'paymentDetails.paidAt': { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDetails.paidAt' },
            month: { $month: '$paymentDetails.paidAt' }
          },
          revenue: { $sum: '$pricing.totalAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        bookingStatusBreakdown,
        paymentStatusBreakdown,
        monthlyRevenue
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};
