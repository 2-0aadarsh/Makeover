import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';
import RazorpayService from './razorpay.service.js';
import { generateReceiptId } from '../utils/payment.utils.js';

class PaymentService {
  /**
   * Create a new payment order
   * @param {Object} paymentData - Payment details
   * @param {string} userId - User ID
   * @param {Array} services - Services to book
   * @param {Object} bookingDetails - Booking information
   * @returns {Promise<Object>} Payment order response
   */
  static async createPaymentOrder(paymentData, userId, services, bookingDetails) {
    try {
      const { totalAmount, taxAmount, subtotal } = paymentData;

      // Generate unique receipt ID
      const receiptId = generateReceiptId();

      // Prepare Razorpay order data
      const razorpayOrderData = {
        amount: totalAmount,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          user_id: userId,
          booking_date: bookingDetails.date,
          booking_slot: bookingDetails.slot,
          services_count: services.length,
          subtotal: subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount
        },
        customer: {
          name: bookingDetails.address.name || 'Customer',
          email: bookingDetails.address.email || '',
          phone: bookingDetails.address.phone || ''
        }
      };

      // Create Razorpay order
      const razorpayResponse = await RazorpayService.createOrder(razorpayOrderData);

      if (!razorpayResponse.success) {
        throw new Error(razorpayResponse.error || 'Failed to create Razorpay order');
      }

      // Create payment record in database
      const payment = new Payment({
        user: userId,
        razorpayOrderId: razorpayResponse.data.id,
        amount: razorpayResponse.data.amount,
        currency: razorpayResponse.data.currency,
        status: 'created',
        orderDetails: {
          receipt: razorpayResponse.data.receipt,
          notes: razorpayOrderData.notes
        },
        bookingDetails: {
          services: services.map(service => ({
            serviceId: service.id,
            name: service.name,
            price: service.price,
            quantity: service.quantity,
            image: service.image
          })),
          totalAmount: totalAmount,
          taxAmount: taxAmount,
          bookingDate: bookingDetails.date,
          bookingSlot: bookingDetails.slot,
          address: bookingDetails.address
        },
        metadata: {
          userAgent: paymentData.userAgent || '',
          ipAddress: paymentData.ipAddress || '',
          platform: 'web',
          device: 'desktop'
        }
      });

      await payment.save();

      return {
        success: true,
        data: {
          orderId: razorpayResponse.data.id,
          amount: razorpayResponse.data.amount,
          currency: razorpayResponse.data.currency,
          receipt: razorpayResponse.data.receipt,
          key: process.env.RAZORPAY_KEY_ID,
          paymentId: payment._id
        }
      };

    } catch (error) {
      console.error('Payment order creation failed:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to create payment order'
      };
    }
  }

  /**
   * Verify and complete payment
   * @param {Object} paymentData - Payment verification data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Payment verification response
   */
  static async verifyPayment(paymentData, userId) {
    try {
      const { orderId, paymentId, signature } = paymentData;

      // Find payment record
      const payment = await Payment.findOne({
        razorpayOrderId: orderId,
        user: userId,
        status: 'created'
      });

      if (!payment) {
        throw new Error('Payment record not found or already processed');
      }

      // Verify payment signature
      const verification = RazorpayService.verifyPayment(orderId, paymentId, signature);

      if (!verification.success) {
        // Update payment status to failed
        await payment.updatePaymentStatus('failed');
        
        return {
          success: false,
          error: 'Payment verification failed',
          paymentId: payment._id
        };
      }

      // Get payment details from Razorpay
      const paymentDetails = await RazorpayService.getPaymentDetails(paymentId);

      if (!paymentDetails.success) {
        throw new Error('Failed to fetch payment details');
      }

      // Update payment status to paid
      await payment.updatePaymentStatus('paid', paymentDetails.data);

      // Create order record
      const order = await this.createOrderFromPayment(payment, paymentDetails.data);

      return {
        success: true,
        data: {
          paymentId: payment._id,
          orderId: order._id,
          orderNumber: order.orderNumber,
          amount: payment.amount,
          currency: payment.currency,
          status: 'completed',
          bookingDate: order.booking.date,
          bookingSlot: order.booking.slot
        }
      };

    } catch (error) {
      console.error('Payment verification failed:', error);
      
      return {
        success: false,
        error: error.message || 'Payment verification failed'
      };
    }
  }

  /**
   * Create order from successful payment
   * @param {Object} payment - Payment record
   * @param {Object} paymentDetails - Payment details from Razorpay
   * @returns {Promise<Object>} Created order
   */
  static async createOrderFromPayment(payment, paymentDetails) {
    try {
      // Calculate pricing breakdown
      const services = payment.bookingDetails.services;
      const subtotal = services.reduce((sum, service) => sum + (service.price * service.quantity), 0);
      const taxAmount = payment.bookingDetails.taxAmount;
      const totalAmount = payment.bookingDetails.totalAmount;

      // Create order
      const order = new Order({
        user: payment.user,
        payment: payment._id,
        services: services.map(service => ({
          serviceId: service.serviceId,
          name: service.name,
          price: service.price,
          quantity: service.quantity,
          image: service.image,
          category: 'Regular', // Default category
          duration: '60' // Default duration in minutes
        })),
        pricing: {
          subtotal: subtotal,
          taxAmount: taxAmount,
          totalAmount: totalAmount,
          currency: 'INR'
        },
        booking: {
          date: payment.bookingDetails.bookingDate,
          slot: payment.bookingDetails.bookingSlot,
          duration: this.calculateTotalDuration(services),
          address: payment.bookingDetails.address
        },
        status: 'confirmed',
        metadata: {
          source: 'web',
          userAgent: payment.metadata.userAgent,
          ipAddress: payment.metadata.ipAddress
        }
      });

      // Add initial timeline entry
      order.timeline.push({
        status: 'confirmed',
        timestamp: new Date(),
        note: 'Order confirmed after successful payment',
        updatedBy: 'system'
      });

      await order.save();

      return order;

    } catch (error) {
      console.error('Order creation from payment failed:', error);
      throw error;
    }
  }

  /**
   * Calculate total duration for services
   * @param {Array} services - Services array
   * @returns {number} Total duration in minutes
   */
  static calculateTotalDuration(services) {
    return services.reduce((total, service) => {
      const serviceDuration = parseInt(service.duration) || 60; // Default 60 minutes
      return total + (serviceDuration * service.quantity);
    }, 0);
  }

  /**
   * Get payment history for user
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Payment history
   */
  static async getPaymentHistory(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const payments = await Payment.find({ user: userId })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Payment.countDocuments({ user: userId });

      return {
        success: true,
        data: {
          payments,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
            limit
          }
        }
      };

    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to fetch payment history'
      };
    }
  }

  /**
   * Get payment details by ID
   * @param {string} paymentId - Payment ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Payment details
   */
  static async getPaymentDetails(paymentId, userId) {
    try {
      const payment = await Payment.findOne({
        _id: paymentId,
        user: userId
      }).populate('user', 'name email phone');

      if (!payment) {
        throw new Error('Payment not found');
      }

      return {
        success: true,
        data: payment
      };

    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to fetch payment details'
      };
    }
  }

  /**
   * Cancel payment order
   * @param {string} orderId - Razorpay order ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Cancellation response
   */
  static async cancelPaymentOrder(orderId, userId) {
    try {
      const payment = await Payment.findOne({
        razorpayOrderId: orderId,
        user: userId,
        status: { $in: ['created', 'attempted'] }
      });

      if (!payment) {
        throw new Error('Payment order not found or cannot be cancelled');
      }

      // Update payment status to cancelled
      await payment.updatePaymentStatus('cancelled');

      return {
        success: true,
        message: 'Payment order cancelled successfully'
      };

    } catch (error) {
      console.error('Payment cancellation failed:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to cancel payment order'
      };
    }
  }

  /**
   * Create COD (Cash on Delivery) order
   * @param {Object} paymentData - Payment details
   * @param {string} userId - User ID
   * @param {Array} services - Services to book
   * @param {Object} bookingDetails - Booking information
   * @returns {Promise<Object>} COD order response
   */
  static async createCODOrder(paymentData, userId, services, bookingDetails) {
    try {
      const { totalAmount, taxAmount, subtotal } = paymentData;

      // Create order directly without payment
      const order = new Order({
        user: userId,
        payment: null, // No payment for COD
        services: services.map(service => ({
          serviceId: service.id,
          name: service.name,
          description: service.description || '',
          price: service.price,
          quantity: service.quantity,
          image: service.image,
          category: service.category || 'Regular',
          duration: service.duration || '60'
        })),
        pricing: {
          subtotal: subtotal || 0,
          taxAmount: taxAmount || 0,
          totalAmount: totalAmount,
          currency: 'INR'
        },
        booking: {
          date: bookingDetails.date,
          slot: bookingDetails.slot,
          duration: this.calculateTotalDuration(services),
          address: bookingDetails.address
        },
        status: 'confirmed',
        metadata: {
          source: 'web',
          paymentMethod: 'cod'
        }
      });

      // Add initial timeline entry
      order.timeline.push({
        status: 'confirmed',
        timestamp: new Date(),
        note: 'COD order confirmed - payment pending',
        updatedBy: 'system'
      });

      await order.save();

      return {
        success: true,
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          amount: totalAmount,
          currency: 'INR',
          status: 'confirmed',
          paymentMethod: 'cod',
          bookingDate: order.booking.date,
          bookingSlot: order.booking.slot
        }
      };

    } catch (error) {
      console.error('COD order creation failed:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to create COD order'
      };
    }
  }

  /**
   * Get payment statistics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Payment statistics
   */
  static async getPaymentStats(userId) {
    try {
      const stats = await Payment.getPaymentStats(userId);

      return {
        success: true,
        data: stats
      };

    } catch (error) {
      console.error('Failed to fetch payment statistics:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to fetch payment statistics'
      };
    }
  }
}

export default PaymentService;
