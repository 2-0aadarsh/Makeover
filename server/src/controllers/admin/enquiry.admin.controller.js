import Enquiry from '../../models/enquiry.model.js';
import { User } from '../../models/user.model.js';
import Address from '../../models/address.model.js';
import mongoose from 'mongoose';

/**
 * @route   GET /api/admin/enquiries
 * @desc    Get all enquiries with filters, search, and pagination
 * @access  Admin only
 */
export const getAllEnquiries = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const {
      status,
      priority,
      source,
      assignedTo,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query using the model's static method or manual query
    const query = {};

    // Status filter
    if (status && ['pending', 'contacted', 'quoted', 'converted', 'cancelled'].includes(status)) {
      query.status = status;
    }

    // Priority filter
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    // Source filter (service type)
    if (source && [
      'professional-makeup',
      'professional-mehendi',
      'bleach-detan',
      'facial',
      'hair-care',
      'waxing',
      'pedicure-manicure',
      'other'
    ].includes(source)) {
      query.source = source;
    }

    // Assigned to filter
    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
      query.assignedTo = new mongoose.Types.ObjectId(assignedTo);
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Search filter (customer name, email, phone, enquiry number, service name)
    if (search) {
      // First, find users matching the search term (if userId exists)
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map(user => user._id);

      query.$or = [
        { enquiryNumber: { $regex: search, $options: 'i' } },
        { 'userDetails.name': { $regex: search, $options: 'i' } },
        { 'userDetails.email': { $regex: search, $options: 'i' } },
        { 'userDetails.phone': { $regex: search, $options: 'i' } },
        { 'serviceDetails.serviceName': { $regex: search, $options: 'i' } },
        { userId: { $in: userIds } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const enquiries = await Enquiry.find(query)
      .populate('userId', 'name email phoneNumber')
      .populate('assignedTo', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalEnquiries = await Enquiry.countDocuments(query);
    const totalPages = Math.ceil(totalEnquiries / limit);

    // Get filter counts for UI
    const filterCounts = await Enquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const filters = {
      totalEnquiries: await Enquiry.countDocuments(),
      pending: filterCounts.find(f => f._id === 'pending')?.count || 0,
      contacted: filterCounts.find(f => f._id === 'contacted')?.count || 0,
      quoted: filterCounts.find(f => f._id === 'quoted')?.count || 0,
      converted: filterCounts.find(f => f._id === 'converted')?.count || 0,
      cancelled: filterCounts.find(f => f._id === 'cancelled')?.count || 0
    };

    // Get unique userIds from enquiries (only for registered users)
    const userIds = [];
    const userIdsSet = new Set();
    
    // Collect emails and phones from guest enquiries for matching
    const guestEmails = [];
    const guestPhones = [];
    
    enquiries.forEach(enquiry => {
      if (enquiry.userId) {
        // Handle populated userId (object with _id) or direct ObjectId
        const userId = enquiry.userId._id || enquiry.userId;
        const userIdStr = userId.toString();
        if (!userIdsSet.has(userIdStr)) {
          userIdsSet.add(userIdStr);
          userIds.push(userId);
        }
      } else {
        // Collect guest user details for matching
        if (enquiry.userDetails?.email) {
          guestEmails.push(enquiry.userDetails.email.toLowerCase());
        }
        if (enquiry.userDetails?.phone) {
          guestPhones.push(enquiry.userDetails.phone);
        }
      }
    });

    // For guest enquiries, find matching registered users by email or phone
    const emailToUserIdMap = {};
    const phoneToUserIdMap = {};
    
    if (guestEmails.length > 0 || guestPhones.length > 0) {
      const userMatchQuery = {
        $or: []
      };
      
      if (guestEmails.length > 0) {
        userMatchQuery.$or.push({ email: { $in: guestEmails } });
      }
      if (guestPhones.length > 0) {
        userMatchQuery.$or.push({ phoneNumber: { $in: guestPhones } });
      }
      
      const matchedUsers = await User.find(userMatchQuery).select('_id email phoneNumber').lean();
      
      matchedUsers.forEach(user => {
        if (user.email) {
          emailToUserIdMap[user.email.toLowerCase()] = user._id.toString();
        }
        if (user.phoneNumber) {
          phoneToUserIdMap[user.phoneNumber] = user._id.toString();
        }
        
        // Add matched user IDs to userIds array if not already present
        const userIdStr = user._id.toString();
        if (!userIdsSet.has(userIdStr)) {
          userIdsSet.add(userIdStr);
          userIds.push(user._id);
        }
      });
    }

    // Fetch addresses for all users to get cities
    const userCitiesMap = {};
    if (userIds.length > 0) {
      // First, try to get default addresses (preferred)
      const defaultAddresses = await Address.find({
        user: { $in: userIds },
        isActive: true,
        isDefault: true
      }).select('user city').lean();

      // Create map of userId -> city from default addresses
      defaultAddresses.forEach(address => {
        const userIdStr = address.user.toString();
        if (address.city && address.city.trim() !== '') {
          userCitiesMap[userIdStr] = address.city.trim();
        }
      });

      // For users without default addresses, get any active address
      const usersWithoutCity = userIds.filter(userId => {
        const userIdStr = userId.toString();
        return !userCitiesMap[userIdStr];
      });

      if (usersWithoutCity.length > 0) {
        const anyAddresses = await Address.find({
          user: { $in: usersWithoutCity },
          isActive: true
        })
        .select('user city')
        .sort({ createdAt: -1 }) // Get most recent address
        .lean();

        // Add to map (avoid duplicates) - get first address per user
        const userAddressMap = {};
        anyAddresses.forEach(address => {
          const userIdStr = address.user.toString();
          if (!userAddressMap[userIdStr] && address.city && address.city.trim() !== '') {
            userAddressMap[userIdStr] = address.city.trim();
          }
        });

        // Merge into userCitiesMap
        Object.assign(userCitiesMap, userAddressMap);
      }
    }

    // Format enquiries for response
    const formattedEnquiries = enquiries.map(enquiry => {
      // Get city from user's address
      let city = 'N/A';
      
      if (enquiry.userId) {
        // For registered users, use userId directly
        const userId = enquiry.userId._id || enquiry.userId;
        const userIdStr = userId.toString();
        city = userCitiesMap[userIdStr] || 'N/A';
      } else {
        // For guest users, try to match by email or phone
        let matchedUserId = null;
        if (enquiry.userDetails?.email) {
          matchedUserId = emailToUserIdMap[enquiry.userDetails.email.toLowerCase()];
        }
        if (!matchedUserId && enquiry.userDetails?.phone) {
          matchedUserId = phoneToUserIdMap[enquiry.userDetails.phone];
        }
        
        if (matchedUserId) {
          city = userCitiesMap[matchedUserId] || 'N/A';
        }
      }

      return {
        id: enquiry._id,
        enquiryNumber: enquiry.enquiryNumber,
        customerName: enquiry.userId?.name || enquiry.userDetails.name,
        email: enquiry.userId?.email || enquiry.userDetails.email,
        phoneNumber: enquiry.userId?.phoneNumber || enquiry.userDetails.phone,
        city: city,
        enquiryGeneratedFor: enquiry.serviceDetails.serviceName,
        serviceCategory: enquiry.serviceDetails.serviceCategory,
        source: enquiry.source,
        status: enquiry.status,
        priority: enquiry.priority,
        assignedTo: enquiry.assignedTo ? {
          id: enquiry.assignedTo._id,
          name: enquiry.assignedTo.name,
          email: enquiry.assignedTo.email
        } : null,
        message: enquiry.enquiryDetails.message,
        preferredDate: enquiry.enquiryDetails.preferredDate,
        preferredTimeSlot: enquiry.enquiryDetails.preferredTimeSlot,
        createdAt: enquiry.createdAt,
        resolvedAt: enquiry.resolvedAt
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Enquiries retrieved successfully',
      data: {
        enquiries: formattedEnquiries,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalEnquiries: totalEnquiries,
          limit: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        filters: filters
      }
    });

  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/enquiries/:id
 * @desc    Get single enquiry details
 * @access  Admin only
 */
export const getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID'
      });
    }

    // Fetch enquiry with populated user data
    const enquiry = await Enquiry.findById(id)
      .populate('userId', 'name email phoneNumber')
      .populate('assignedTo', 'name email')
      .populate('adminNotes.addedBy', 'name email')
      .lean();

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Get city from user's address if userId exists
    let city = 'N/A';
    if (enquiry.userId) {
      const userId = enquiry.userId._id || enquiry.userId;
      // Try to get default address first
      const address = await Address.findOne({
        user: userId,
        isActive: true,
        isDefault: true
      }).select('city').lean();
      
      if (address?.city) {
        city = address.city.trim();
      } else {
        // Fallback to any active address
        const anyAddress = await Address.findOne({
          user: userId,
          isActive: true
        }).select('city').sort({ createdAt: -1 }).lean();
        
        if (anyAddress?.city) {
          city = anyAddress.city.trim();
        }
      }
    }

    // Format response
    const formattedEnquiry = {
      id: enquiry._id,
      enquiryNumber: enquiry.enquiryNumber,
      customer: {
        id: enquiry.userId?._id || null,
        name: enquiry.userId?.name || enquiry.userDetails.name,
        email: enquiry.userId?.email || enquiry.userDetails.email,
        phone: enquiry.userId?.phoneNumber || enquiry.userDetails.phone,
        city: city,
        isRegistered: !!enquiry.userId
      },
      serviceDetails: {
        serviceName: enquiry.serviceDetails.serviceName,
        serviceCategory: enquiry.serviceDetails.serviceCategory,
        priceRange: enquiry.serviceDetails.priceRange,
        serviceId: enquiry.serviceDetails.serviceId,
        source: enquiry.source
      },
      enquiryDetails: {
        message: enquiry.enquiryDetails.message,
        preferredDate: enquiry.enquiryDetails.preferredDate,
        preferredTimeSlot: enquiry.enquiryDetails.preferredTimeSlot,
        additionalRequirements: enquiry.enquiryDetails.additionalRequirements
      },
      status: enquiry.status,
      priority: enquiry.priority,
      assignedTo: enquiry.assignedTo ? {
        id: enquiry.assignedTo._id,
        name: enquiry.assignedTo.name,
        email: enquiry.assignedTo.email
      } : null,
      adminNotes: enquiry.adminNotes.map(note => ({
        note: note.note,
        addedBy: {
          id: note.addedBy._id,
          name: note.addedBy.name,
          email: note.addedBy.email
        },
        addedAt: note.addedAt
      })),
      internalComments: enquiry.internalComments,
      resolvedAt: enquiry.resolvedAt,
      metadata: enquiry.metadata,
      createdAt: enquiry.createdAt,
      updatedAt: enquiry.updatedAt
    };

    return res.status(200).json({
      success: true,
      message: 'Enquiry details retrieved successfully',
      data: formattedEnquiry
    });

  } catch (error) {
    console.error('Error fetching enquiry details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiry details',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/admin/enquiries/:id/status
 * @desc    Update enquiry status
 * @access  Admin only
 */
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'contacted', 'quoted', 'converted', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find enquiry
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Validate status transition using instance method if available
    if (enquiry.canTransitionTo && !enquiry.canTransitionTo(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${enquiry.status} to ${status}`
      });
    }

    // Update status
    enquiry.status = status;

    // If status is converted or cancelled, set resolvedAt
    if (status === 'converted' || status === 'cancelled') {
      enquiry.resolvedAt = new Date();
    } else {
      enquiry.resolvedAt = null;
    }

    // Add admin note if provided
    if (adminNote) {
      enquiry.adminNotes.push({
        note: adminNote,
        addedBy: req.user.id, // Admin user ID from middleware
        addedAt: new Date()
      });
    }

    await enquiry.save();

    // Populate for response
    await enquiry.populate('assignedTo', 'name email');
    await enquiry.populate('userId', 'name email phoneNumber');

    return res.status(200).json({
      success: true,
      message: 'Enquiry status updated successfully',
      data: {
        id: enquiry._id,
        enquiryNumber: enquiry.enquiryNumber,
        status: enquiry.status,
        resolvedAt: enquiry.resolvedAt,
        updatedAt: enquiry.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating enquiry status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update enquiry status',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/admin/enquiries/:id/assign
 * @desc    Assign enquiry to admin
 * @access  Admin only
 */
export const assignEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID'
      });
    }

    // Validate assignedTo (if provided)
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid assignedTo user ID'
        });
      }

      // Verify user exists and is admin
      const user = await User.findById(assignedTo);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Assigned user not found'
        });
      }

      if (user.role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Can only assign to admin users'
        });
      }
    }

    // Find enquiry
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Update assignment
    enquiry.assignedTo = assignedTo || null;

    // Add admin note
    enquiry.adminNotes.push({
      note: assignedTo 
        ? `Enquiry assigned to admin` 
        : `Enquiry assignment removed`,
      addedBy: req.user.id,
      addedAt: new Date()
    });

    await enquiry.save();

    // Populate for response
    await enquiry.populate('assignedTo', 'name email');

    return res.status(200).json({
      success: true,
      message: assignedTo ? 'Enquiry assigned successfully' : 'Enquiry assignment removed',
      data: {
        id: enquiry._id,
        enquiryNumber: enquiry.enquiryNumber,
        assignedTo: enquiry.assignedTo ? {
          id: enquiry.assignedTo._id,
          name: enquiry.assignedTo.name,
          email: enquiry.assignedTo.email
        } : null,
        updatedAt: enquiry.updatedAt
      }
    });

  } catch (error) {
    console.error('Error assigning enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign enquiry',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/admin/enquiries/:id/notes
 * @desc    Add admin note to enquiry
 * @access  Admin only
 */
export const addEnquiryNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, internalComment } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID'
      });
    }

    // Validate note or internalComment
    if (!note && !internalComment) {
      return res.status(400).json({
        success: false,
        message: 'Note or internalComment is required'
      });
    }

    // Find enquiry
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Add admin note if provided
    if (note) {
      enquiry.adminNotes.push({
        note: note,
        addedBy: req.user.id,
        addedAt: new Date()
      });
    }

    // Update internal comments if provided
    if (internalComment) {
      enquiry.internalComments = internalComment;
    }

    await enquiry.save();

    // Populate for response
    await enquiry.populate('adminNotes.addedBy', 'name email');

    const latestNote = enquiry.adminNotes[enquiry.adminNotes.length - 1];

    return res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: {
        id: enquiry._id,
        enquiryNumber: enquiry.enquiryNumber,
        note: note ? {
          id: latestNote._id,
          note: latestNote.note,
          addedBy: {
            id: latestNote.addedBy._id,
            name: latestNote.addedBy.name,
            email: latestNote.addedBy.email
          },
          addedAt: latestNote.addedAt
        } : null,
        internalComments: enquiry.internalComments,
        updatedAt: enquiry.updatedAt
      }
    });

  } catch (error) {
    console.error('Error adding enquiry note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add enquiry note',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/enquiries/stats
 * @desc    Get enquiry statistics
 * @access  Admin only
 */
export const getEnquiryStats = async (req, res) => {
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

    // 1. Enquiries by Status
    const enquiriesByStatus = await Enquiry.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 2. Enquiries by Priority
    const enquiriesByPriority = await Enquiry.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Enquiries by Source (Service Type)
    const enquiriesBySource = await Enquiry.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 4. Conversion Rate
    const totalEnquiries = await Enquiry.countDocuments(dateFilter);
    const convertedEnquiries = await Enquiry.countDocuments({
      ...dateFilter,
      status: 'converted'
    });
    const conversionRate = totalEnquiries > 0 
      ? ((convertedEnquiries / totalEnquiries) * 100).toFixed(2) 
      : 0;

    // 5. Top Services (by enquiry count)
    const topServices = await Enquiry.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$serviceDetails.serviceName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 6. Monthly Enquiry Trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEnquiries = await Enquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          ...dateFilter
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 7. Assigned vs Unassigned
    const assignedEnquiries = await Enquiry.countDocuments({
      ...dateFilter,
      assignedTo: { $ne: null }
    });
    const unassignedEnquiries = totalEnquiries - assignedEnquiries;

    // 8. Recent Enquiries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEnquiries = await Enquiry.countDocuments({
      ...dateFilter,
      createdAt: { $gte: sevenDaysAgo }
    });

    return res.status(200).json({
      success: true,
      message: 'Enquiry statistics retrieved successfully',
      data: {
        enquiriesByStatus,
        enquiriesByPriority,
        enquiriesBySource,
        topServices: topServices.map(service => ({
          serviceName: service._id,
          count: service.count
        })),
        monthlyEnquiries,
        summary: {
          totalEnquiries,
          convertedEnquiries,
          conversionRate: parseFloat(conversionRate),
          assignedEnquiries,
          unassignedEnquiries,
          recentEnquiries,
          pendingEnquiries: enquiriesByStatus.find(s => s._id === 'pending')?.count || 0,
          contactedEnquiries: enquiriesByStatus.find(s => s._id === 'contacted')?.count || 0,
          quotedEnquiries: enquiriesByStatus.find(s => s._id === 'quoted')?.count || 0,
          cancelledEnquiries: enquiriesByStatus.find(s => s._id === 'cancelled')?.count || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching enquiry statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiry statistics',
      error: error.message
    });
  }
};
