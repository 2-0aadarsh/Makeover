import mongoose from 'mongoose';
import Booking from '../models/booking.model.js';
import DailySlots from '../models/dailySlots.model.js';
import Cart from '../models/cart.model.js';

// Create new booking (without transactions for standalone MongoDB)
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = req.validatedCart; // Database cart (source of truth)
    const address = req.selectedAddress;
    const timeSlot = req.lockedSlot; // Use locked slot
    const dailySlots = req.dailySlots;
    const { date, paymentMethod } = req.body;
      
    console.log('🎯 Booking - Creating booking:', {
      userId,
      cartItemsCount: cart.items.length,
      totalAmount: cart.summary.total,
      addressId: address._id,
      slotId: timeSlot._id,
      paymentMethod,
      date
    });
    
    // Create booking with data from DATABASE CART (security)
    const booking = new Booking({
      user: userId,
      bookingStatus: 'pending',
      bookingDate: new Date(date),
      timeSlot: {
        slotId: timeSlot._id,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        dailySlotsId: dailySlots._id
      },
      services: cart.items.map(item => ({
        serviceId: item.serviceId,
        name: item.cardHeader,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        category: item.category,
        serviceType: item.serviceType
      })),
      serviceSummary: {
        totalServices: cart.summary.totalServices,
        totalItems: cart.summary.totalItems,
        subtotal: cart.summary.subtotal,
        taxAmount: cart.summary.taxAmount,
        total: cart.summary.total
      },
      deliveryAddress: {
        houseFlatNumber: address.houseFlatNumber,
        streetAreaName: address.streetAreaName,
        completeAddress: address.completeAddress,
        landmark: address.landmark,
        pincode: address.pincode,
        city: address.city,
        state: address.state,
        country: address.country,
        addressType: address.addressType
      },
      isDefaultAddress: address.isDefault,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'paid' : 'pending',
      totalAmount: cart.summary.total
    });
    
    // Save booking
    await booking.save();
    
    console.log('✅ Booking - Booking created:', {
      bookingId: booking._id,
      status: booking.bookingStatus,
      totalAmount: booking.totalAmount
    });
    
    // Slot capacity is already locked by middleware, no need to update again
    console.log('✅ TimeSlot - Slot capacity already locked by middleware:', {
      slotId: timeSlot._id,
      currentBookings: timeSlot.currentBookings,
      maxBookings: timeSlot.maxBookings
    });
    
    // Clear cart after successful booking
    await Cart.findByIdAndUpdate(
      cart._id,
      { 
        items: [], 
        summary: { 
          totalServices: 0, 
          totalItems: 0, 
          subtotal: 0, 
          taxAmount: 0, 
          total: 0 
        },
        lastUpdated: new Date()
      }
    );
    
    console.log('✅ Cart - Cart cleared after booking');
    
    // For COD, payment is pending until completion
    let paymentData = null;
    if (paymentMethod === 'cod') {
      paymentData = {
        paymentMethod: 'cod',
        status: 'pending',
        amount: cart.summary.total,
        message: 'Payment will be collected on service delivery'
      };
      
      // Update booking with payment status
      booking.paymentStatus = 'pending';
      await booking.save();
    }
      
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: booking.toSafeObject(),
        paymentData,
        cartCleared: true
      }
    });
  } catch (error) {
    // Note: withTransaction automatically aborts on error, don't call abortTransaction manually
    console.error('❌ Booking - Error creating booking:', error);
    
    if (error.message === 'Time slot capacity exceeded during booking') {
      return res.status(409).json({
        success: false,
        message: 'Time slot is no longer available. Please select another slot.',
        code: 'SLOT_CAPACITY_EXCEEDED'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get user's bookings with pagination
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id; // Support userId parameter
    const { status, page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('📋 Booking - Fetching user bookings:', {
      userId,
      status,
      page: parseInt(page),
      limit: parseInt(limit),
      skip
    });
    
    const bookings = await Booking.findByUser(userId, {
      status,
      limit: parseInt(limit),
      skip
    });
    
    const totalBookings = await Booking.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalBookings / parseInt(limit));
    
    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings: bookings.map(booking => booking.toSafeObject()),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBookings,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('❌ Booking - Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving bookings',
      error: error.message
    });
  }
};

// Get specific booking details
export const getBookingDetails = async (req, res) => {
  try {
    const booking = req.booking; // From validateBookingOwnership middleware
    
    console.log('📋 Booking - Fetching booking details:', {
      bookingId: booking._id,
      userId: booking.user,
      status: booking.bookingStatus
    });
    
    res.status(200).json({
      success: true,
      message: 'Booking details retrieved successfully',
      data: {
        booking: booking.toSafeObject()
      }
    });
  } catch (error) {
    console.error('❌ Booking - Error fetching booking details:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving booking details',
      error: error.message
    });
  }
};

// Cancel booking with transaction support
export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const booking = req.booking;
      const timeSlotId = booking.timeSlot.slotId;
      
      console.log('❌ Booking - Cancelling booking:', {
        bookingId: booking._id,
        currentStatus: booking.bookingStatus,
        timeSlotId
      });
      
      // Update booking status
      booking.bookingStatus = 'cancelled';
      booking.cancelledAt = new Date();
      await booking.save({ session });
      
      // Decrement time slot capacity using DailySlots
      const dailySlots = await DailySlots.findOne({ 'slots._id': timeSlotId });
      if (dailySlots) {
        const slot = dailySlots.slots.id(timeSlotId);
        if (slot && slot.currentBookings > 0) {
          slot.currentBookings -= 1;
          await dailySlots.save({ session });
        }
      }
      
      console.log('✅ Booking - Booking cancelled and slot capacity updated');
      
      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
          booking: booking.toSafeObject()
        }
      });
    });
  } catch (error) {
    // Note: withTransaction automatically aborts on error, don't call abortTransaction manually
    console.error('❌ Booking - Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// Reschedule booking with transaction support
export const rescheduleBooking = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const booking = req.booking;
      const { newSlotId, newDate } = req.body;
      
      console.log('📅 Booking - Rescheduling booking:', {
        bookingId: booking._id,
        oldSlotId: booking.timeSlot.slotId,
        newSlotId,
        oldDate: booking.bookingDate,
        newDate
      });
      
      // Validate new time slot using DailySlots
      const newDailySlots = await DailySlots.findByDate(newDate);
      if (!newDailySlots) {
        return res.status(404).json({
          success: false,
          message: 'No slots available for the new date.',
          code: 'NEW_DATE_NO_SLOTS'
        });
      }
      
      const newTimeSlot = newDailySlots.slots.id(newSlotId);
      if (!newTimeSlot) {
        return res.status(404).json({
          success: false,
          message: 'New time slot is not available.',
          code: 'NEW_SLOT_NOT_AVAILABLE'
        });
      }
      
      if (!newTimeSlot.isAvailable || newTimeSlot.currentBookings >= newTimeSlot.maxBookings) {
        return res.status(400).json({
          success: false,
          message: 'New time slot is not available or fully booked.',
          code: 'NEW_SLOT_FULL'
        });
      }
      
      // Update booking
      const oldSlotId = booking.timeSlot.slotId;
      booking.bookingDate = new Date(newDate);
      booking.timeSlot = {
        slotId: newTimeSlot._id,
        startTime: newTimeSlot.startTime,
        endTime: newTimeSlot.endTime,
        dailySlotsId: newDailySlots._id
      };
      booking.bookingStatus = 'rescheduled';
      
      await booking.save({ session });
      
      // Update slot capacities using DailySlots
      // Decrement old slot capacity
      const oldDailySlots = await DailySlots.findOne({ 'slots._id': oldSlotId });
      if (oldDailySlots) {
        const oldSlot = oldDailySlots.slots.id(oldSlotId);
        if (oldSlot && oldSlot.currentBookings > 0) {
          oldSlot.currentBookings -= 1;
          await oldDailySlots.save({ session });
        }
      }
      
      // Increment new slot capacity
      newTimeSlot.currentBookings += 1;
      await newDailySlots.save({ session });
      
      console.log('✅ Booking - Booking rescheduled and slot capacities updated');
      
      res.status(200).json({
        success: true,
        message: 'Booking rescheduled successfully',
        data: {
          booking: booking.toSafeObject()
        }
      });
    });
  } catch (error) {
    // Note: withTransaction automatically aborts on error, don't call abortTransaction manually
    console.error('❌ Booking - Error rescheduling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error rescheduling booking',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// Admin: Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('👑 Admin - Fetching all bookings:', {
      status,
      date,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    let query = {};
    
    if (status) {
      query.bookingStatus = status;
    }
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.bookingDate = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }
    
    const bookings = await Booking.find(query)
      .sort({ bookingDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email phoneNumber')
      .populate('timeSlot.dailySlotsId', 'date slots');
    
    const totalBookings = await Booking.countDocuments(query);
    const totalPages = Math.ceil(totalBookings / parseInt(limit));
    
    res.status(200).json({
      success: true,
      message: 'All bookings retrieved successfully',
      data: {
        bookings: bookings.map(booking => booking.toSafeObject()),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBookings,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('❌ Admin - Error fetching all bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving all bookings',
      error: error.message
    });
  }
};

// Admin: Update booking status
export const updateBookingStatus = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { bookingId } = req.params;
      const { status, notes } = req.body;
      
      console.log('👑 Admin - Updating booking status:', {
        bookingId,
        newStatus: status,
        hasNotes: !!notes
      });
      
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found.'
        });
      }
      
      const oldStatus = booking.bookingStatus;
      booking.bookingStatus = status;
      
      // Set appropriate timestamp
      if (status === 'confirmed' && !booking.confirmedAt) {
        booking.confirmedAt = new Date();
      } else if (status === 'completed' && !booking.completedAt) {
        booking.completedAt = new Date();
      }
      
      await booking.save({ session });
      
      console.log('✅ Admin - Booking status updated:', {
        bookingId,
        oldStatus,
        newStatus: status
      });
      
      res.status(200).json({
        success: true,
        message: 'Booking status updated successfully',
        data: {
          booking: booking.toSafeObject()
        }
      });
    });
  } catch (error) {
    // Note: withTransaction automatically aborts on error, don't call abortTransaction manually
    console.error('❌ Admin - Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// Get booking statistics
export const getBookingStatistics = async (req, res) => {
  try {
    console.log('📊 Booking - Fetching booking statistics');
    
    const stats = await Booking.getBookingStats();
    const result = stats[0] || {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0
    };
    
    // Get today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayBookings = await Booking.countDocuments({
      bookingDate: {
        $gte: today,
        $lt: tomorrow
      },
      bookingStatus: { $in: ['pending', 'confirmed'] }
    });
    
    // Get this week's revenue
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: weekStart },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Booking statistics retrieved successfully',
      data: {
        overall: result,
        todayBookings,
        weekRevenue: weekRevenue[0]?.revenue || 0
      }
    });
  } catch (error) {
    console.error('❌ Booking - Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving booking statistics',
      error: error.message
    });
  }
};



