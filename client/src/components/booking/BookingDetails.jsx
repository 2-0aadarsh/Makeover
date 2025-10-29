import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * BookingDetails Component
 * 
 * Displays detailed booking information with booking ID, payment method,
 * services breakdown, and action buttons
 * Based on the static UI design from the images
 */
const BookingDetails = ({ booking, onCancel, onReschedule, onCompletePayment }) => {
  const navigate = useNavigate();

  // Format currency to INR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format time to readable format
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString; // Already formatted as "03:30 PM"
  };

  // Get payment method display text
  const getPaymentMethodDisplay = (paymentMethod) => {
    if (paymentMethod === 'cod' || paymentMethod === 'cash') {
      return 'Pay After Service';
    }
    return 'Online Payment';
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'Confirmed', className: 'bg-green-100 text-green-800' },
      in_progress: { text: 'In Progress', className: 'bg-blue-100 text-blue-800' },
      completed: { text: 'Completed', className: 'bg-gray-100 text-gray-800' },
      cancelled: { text: 'Cancelled', className: 'bg-red-100 text-red-800' },
      no_show: { text: 'No Show', className: 'bg-orange-100 text-orange-800' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  // Get payment status badge
  const getPaymentBadge = (paymentStatus) => {
    const paymentConfig = {
      pending: { text: 'Payment Pending', className: 'bg-yellow-100 text-yellow-800' },
      processing: { text: 'Processing', className: 'bg-blue-100 text-blue-800' },
      completed: { text: 'Paid', className: 'bg-green-100 text-green-800' },
      failed: { text: 'Payment Failed', className: 'bg-red-100 text-red-800' },
      refunded: { text: 'Refunded', className: 'bg-gray-100 text-gray-800' }
    };

    const config = paymentConfig[paymentStatus] || paymentConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/my-bookings');
  };

  // Handle cancel booking
  const handleCancel = () => {
    if (onCancel) {
      onCancel(booking);
    }
  };

  // Handle reschedule booking
  const handleReschedule = () => {
    if (onReschedule) {
      onReschedule(booking);
    }
  };

  // Handle complete payment
  const handleCompletePayment = () => {
    if (onCompletePayment) {
      onCompletePayment(booking);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Bookings
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="mt-2 text-gray-600">
            View and manage your booking details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Services Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
              
              {/* Services Table */}
              <div className="space-y-6">
                {booking.services?.map((service, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    {/* Service Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Qty: {service.quantity}</span>
                            <span className="text-sm text-gray-500">Price: {formatCurrency(service.price)}</span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(service.price * service.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(booking.totalAmount || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Booking Confirmation Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Thanks For Booking With Makeover 👋
                </h3>
              </div>

              {/* Booking ID and Payment Method */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Booking ID:</span>
                  <span className="text-sm font-bold text-red-600">{booking.orderNumber || booking._id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                  <span className="text-sm font-bold text-red-600">
                    {getPaymentMethodDisplay(booking.paymentMethod)}
                  </span>
                </div>
              </div>

              {/* Booking Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  {getStatusBadge(booking.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Payment Status:</span>
                  {getPaymentBadge(booking.paymentStatus)}
                </div>
              </div>

              {/* Booking Information */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    Your booking is successful placed for selected services on{' '}
                    <span className="font-semibold">
                      {formatDate(booking.bookingDetails?.date)}
                    </span>
                    {booking.bookingDetails?.slot && (
                      <>
                        , <span className="font-semibold">
                          {formatTime(booking.bookingDetails.slot)}
                        </span>
                      </>
                    )}
                    . You can pay{' '}
                    <span className="font-semibold">
                      {formatCurrency(booking.totalAmount || 0)}
                    </span>{' '}
                    now or after the service is complete.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCancel}
                  className="w-full py-2 px-4 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  Cancel Booking
                </button>
                
                <button
                  onClick={handleReschedule}
                  className="w-full py-2 px-4 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  Reschedule Booking
                </button>
                
                {(booking.paymentStatus === 'pending' || booking.paymentMethod === 'cod') && (
                  <button
                    onClick={handleCompletePayment}
                    className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Complete Payment
                  </button>
                )}
              </div>

              {/* Help Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Need help with your booking? Write us at{' '}
                  <a href="mailto:hello@wemakeover.co.in" className="text-blue-600 hover:underline">
                    hello@wemakeover.co.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BookingDetails.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string,
    orderNumber: PropTypes.string,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        image: PropTypes.string
      })
    ),
    totalAmount: PropTypes.number,
    status: PropTypes.string,
    paymentStatus: PropTypes.string,
    paymentMethod: PropTypes.string,
    bookingDetails: PropTypes.shape({
      date: PropTypes.string,
      slot: PropTypes.string,
      address: PropTypes.object
    })
  }).isRequired,
  onCancel: PropTypes.func,
  onReschedule: PropTypes.func,
  onCompletePayment: PropTypes.func
};

export default BookingDetails;
