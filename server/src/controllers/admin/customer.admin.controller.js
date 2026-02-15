import { User } from '../../models/user.model.js';
import Booking from '../../models/booking.model.js';
import Enquiry from '../../models/enquiry.model.js';
import mongoose from 'mongoose';

/**
 * @route   GET /api/admin/customers
 * @desc    Get all customers with pagination and search
 * @access  Admin only
 */
export const getAllCustomers = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search filter
    const { search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build query
    const query = { role: 'user' }; // Only get regular users, not admins

    // Search filter (name, email, phone)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const customers = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalCustomers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCustomers / limit);

    // Format customers with additional info
    const formattedCustomers = await Promise.all(
      customers.map(async (customer) => {
        // Get booking count for each customer
        const bookingCount = await Booking.countDocuments({ userId: customer._id });
        
        // Get total spent
        const totalSpent = await Booking.aggregate([
          {
            $match: {
              userId: customer._id,
              paymentStatus: 'completed'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$pricing.totalAmount' }
            }
          }
        ]);

        return {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          city: 'N/A', // Will be populated from address if available
          isVerified: customer.isVerfied,
          bookingCount: bookingCount,
          totalSpent: totalSpent[0]?.total || 0,
          formattedTotalSpent: `₹${(totalSpent[0]?.total || 0).toLocaleString('en-IN')}`,
          createdAt: customer.createdAt,
          lastActive: customer.updatedAt
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: {
        customers: formattedCustomers,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalCustomers: totalCustomers,
          limit: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/customers/:id
 * @desc    Get single customer details with booking history
 * @access  Admin only
 */
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID'
      });
    }

    // Fetch customer
    const customer = await User.findById(id).select('-password').lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get booking history
    const bookings = await Booking.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total spent
    const totalSpent = await Booking.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    // Get enquiries
    const enquiries = await Enquiry.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Format response
    const formattedCustomer = {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      role: customer.role,
      isVerified: customer.isVerfied,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      bookingHistory: bookings.map(booking => ({
        id: booking._id,
        orderNumber: booking.orderNumber,
        date: booking.bookingDetails.date,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalAmount: booking.pricing.totalAmount,
        servicesCount: booking.services.length
      })),
      statistics: {
        totalBookings: bookings.length,
        bookingsByStatus: bookingStats,
        totalSpent: totalSpent[0]?.total || 0,
        formattedTotalSpent: `₹${(totalSpent[0]?.total || 0).toLocaleString('en-IN')}`,
        totalEnquiries: enquiries.length
      },
      recentEnquiries: enquiries.map(enquiry => ({
        id: enquiry._id,
        enquiryNumber: enquiry.enquiryNumber,
        service: enquiry.serviceDetails.serviceName,
        status: enquiry.status,
        createdAt: enquiry.createdAt
      }))
    };

    return res.status(200).json({
      success: true,
      message: 'Customer details retrieved successfully',
      data: formattedCustomer
    });

  } catch (error) {
    console.error('Error fetching customer details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer details',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/customers/stats
 * @desc    Get customer statistics
 * @access  Admin only
 */
export const getCustomerStats = async (req, res) => {
  try {
    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // New customers this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newCustomersThisMonth = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfMonth }
    });

    // Customers with bookings
    const customersWithBookings = await Booking.distinct('userId');

    // Top customers by spending
    const topCustomers = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$pricing.totalAmount' },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    // Populate customer details
    const topCustomersWithDetails = await Promise.all(
      topCustomers.map(async (customer) => {
        const user = await User.findById(customer._id).select('name email phoneNumber');
        return {
          id: customer._id,
          name: user?.name || 'N/A',
          email: user?.email || 'N/A',
          phoneNumber: user?.phoneNumber || 'N/A',
          totalSpent: customer.totalSpent,
          formattedTotalSpent: `₹${customer.totalSpent.toLocaleString('en-IN')}`,
          bookingCount: customer.bookingCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Customer statistics retrieved successfully',
      data: {
        totalCustomers,
        newCustomersThisMonth,
        customersWithBookings: customersWithBookings.length,
        customersWithoutBookings: totalCustomers - customersWithBookings.length,
        topCustomers: topCustomersWithDetails
      }
    });

  } catch (error) {
    console.error('Error fetching customer stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer statistics',
      error: error.message
    });
  }
};
