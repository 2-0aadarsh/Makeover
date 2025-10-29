import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookingById,
  cancelBooking,
  rescheduleBooking,
  updatePaymentStatus,
  selectCurrentBooking,
  selectBookingLoading,
  selectBookingError,
  clearErrors
} from '../features/booking/bookingSlice.js';
import BookingDetails from '../components/booking/BookingDetails.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

/**
 * BookingDetailsPage Component
 * 
 * Displays detailed view of a specific booking
 * Handles booking actions like cancel, reschedule, and payment
 */
const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const booking = useSelector(selectCurrentBooking);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);

  // Local state
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch booking details on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchBookingById(id));
    }
  }, [dispatch, id]);

  // Clear errors on component mount
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Handle cancel booking
  const handleCancelBooking = async (bookingData) => {
    setActionLoading(true);
    try {
      const result = await dispatch(cancelBooking({
        bookingId: bookingData._id,
        reason: 'User requested cancellation'
      }));
      
      if (result.payload) {
        alert('Booking cancelled successfully');
        navigate('/my-bookings');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reschedule booking
  const handleRescheduleBooking = async (bookingData) => {
    // For now, just show an alert - in a real app, this would open a reschedule modal
    alert('Reschedule functionality will be implemented soon. Please contact support for immediate rescheduling.');
  };

  // Handle complete payment
  const handleCompletePayment = async (bookingData) => {
    setActionLoading(true);
    try {
      const result = await dispatch(updatePaymentStatus({
        bookingId: bookingData._id,
        paymentStatus: 'completed'
      }));
      
      if (result.payload) {
        alert('Payment status updated successfully');
        // Refresh booking data
        dispatch(fetchBookingById(id));
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle retry
  const handleRetry = () => {
    if (id) {
      dispatch(fetchBookingById(id));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            retryText="Try Again"
          />
        </div>
      </div>
    );
  }

  // Empty state (booking not found)
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            title="Booking Not Found"
            description="The booking you're looking for doesn't exist or may have been removed."
            actionText="Back to Bookings"
            onAction={() => navigate('/my-bookings')}
          />
        </div>
      </div>
    );
  }

  // Success state - show booking details
  return (
    <BookingDetails
      booking={booking}
      onCancel={handleCancelBooking}
      onReschedule={handleRescheduleBooking}
      onCompletePayment={handleCompletePayment}
    />
  );
};

export default BookingDetailsPage;
