import { useState } from 'react';
import PropTypes from 'prop-types';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';

/**
 * CancelBookingModal Component
 * 
 * Modal for confirming booking cancellation with reason input
 * Shows refund information if applicable
 */
const CancelBookingModal = ({
  isOpen,
  onClose,
  onConfirm,
  booking,
  isLoading = false,
  errorMessage = null,
}) => {
  const [cancellationReason, setCancellationReason] = useState('');
  useBodyScrollLock(isOpen);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Check if refund eligible (payment completed)
  const isRefundEligible = booking?.paymentStatus === 'completed';
  const totalAmount = booking?.pricing?.totalAmount || booking?.totalAmount || 0;

  // Handle confirm cancellation
  const handleConfirm = () => {
    onConfirm(cancellationReason || 'No reason provided');
    setCancellationReason(''); // Reset form
  };

  // Handle close
  const handleClose = () => {
    setCancellationReason(''); // Reset form
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-hidden overscroll-contain">
<<<<<<< HEAD
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" data-modal-scroll>
=======
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Cancel Booking</h2>
              <p className="text-red-100 mt-1 text-sm">Are you sure you want to cancel?</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-white hover:text-red-100 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Booking Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold text-gray-900">{booking?.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold text-gray-900">{formatDate(booking?.bookingDetails?.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold text-gray-900">{booking?.bookingDetails?.slot}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-gray-900 text-lg">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Services to be cancelled:</h3>
            <div className="space-y-2">
              {booking?.services?.map((service, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">Qty: {service.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(service.price * service.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Refund Information */}
          {isRefundEligible ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-green-900 mb-1">Refund Eligible</h4>
                  <p className="text-sm text-green-700 mb-2">
                    You will receive a full refund of <strong>{formatCurrency(totalAmount)}</strong>
                  </p>
                  <p className="text-xs text-green-600">
                    Refund will be processed within 5-7 business days to your original payment method.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">No Payment Made</h4>
                  <p className="text-sm text-blue-700">
                    Since payment was not completed, no refund is necessary.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L12.71 3.86a1 1 0 00-1.72 0zM12 9v4m0 4h.01"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Reason */}
          <div className="mb-6">
            <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Reason <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="cancellationReason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Please let us know why you're cancelling..."
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">{cancellationReason.length}/500 characters</p>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800 font-medium">This action cannot be undone</p>
                <p className="text-sm text-red-700 mt-1">
                  Once cancelled, you'll need to create a new booking to reschedule.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Keep Booking
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cancelling...
                </>
              ) : (
                'Cancel Booking'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CancelBookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  booking: PropTypes.shape({
    _id: PropTypes.string,
    orderNumber: PropTypes.string,
    services: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      price: PropTypes.number,
      quantity: PropTypes.number
    })),
    bookingDetails: PropTypes.shape({
      date: PropTypes.string,
      slot: PropTypes.string
    }),
    pricing: PropTypes.shape({
      totalAmount: PropTypes.number
    }),
    totalAmount: PropTypes.number,
    paymentStatus: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  errorMessage: PropTypes.string
};

export default CancelBookingModal;

