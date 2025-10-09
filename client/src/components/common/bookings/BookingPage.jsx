import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * BookingPage Component
 *
 * Main component for managing user bookings with cards, details, and actions
 * Includes booking management, payment handling, and status updates
 */
const BookingPage = () => {
  const navigate = useNavigate();

  // State management
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [newBookingDate, setNewBookingDate] = useState("");
  const [newBookingTime, setNewBookingTime] = useState("");

  // Sample bookings data
  useEffect(() => {
    const sampleBookings = [
      {
        id: 1,
        bookingId: "MAK001234",
        services: [
          { name: "Hand & Leg Waxing", category: "Waxing", quantity: 1, price: 1499 },
          { name: "De-Tan Facial", category: "Cleanup & Facial", quantity: 2, price: 999 },
          { name: "Manicure", category: "Manicure & Pedicure", quantity: 1, price: 499 }
        ],
        date: "04 Jul 2025",
        time: "01:00 PM - 01:45 PM",
        status: "confirmed",
        paymentStatus: "pending",
        totalAmount: 3996,
        address: "202 C Wing, Mahatma Gandhi Apartment, Nawagadhi, Gaya (823001)"
      },
      {
        id: 2,
        bookingId: "MAK001235",
        services: [
          { name: "Hand & Leg Waxing", category: "Waxing", quantity: 1, price: 1499 },
          { name: "De-Tan Facial", category: "Cleanup & Facial", quantity: 2, price: 999 },
          { name: "Manicure", category: "Manicure & Pedicure", quantity: 1, price: 499 }
        ],
        date: "05 Jul 2025",
        time: "02:00 PM - 02:45 PM",
        status: "confirmed",
        paymentStatus: "completed",
        totalAmount: 3996,
        address: "202 C Wing, Mahatma Gandhi Apartment, Nawagadhi, Gaya (823001)"
      },
      {
        id: 3,
        bookingId: "MAK001236",
        services: [
          { name: "Hand & Leg Waxing", category: "Waxing", quantity: 1, price: 1499 },
          { name: "De-Tan Facial", category: "Cleanup & Facial", quantity: 2, price: 999 },
          { name: "Manicure", category: "Manicure & Pedicure", quantity: 1, price: 499 }
        ],
        date: "06 Jul 2025",
        time: "03:00 PM - 03:45 PM",
        status: "cancelled",
        paymentStatus: "pending",
        totalAmount: 3996,
        address: "202 C Wing, Mahatma Gandhi Apartment, Nawagadhi, Gaya (823001)"
      },
      {
        id: 4,
        bookingId: "MAK001237",
        services: [
          { name: "Hand & Leg Waxing", category: "Waxing", quantity: 1, price: 1499 },
          { name: "De-Tan Facial", category: "Cleanup & Facial", quantity: 2, price: 999 },
          { name: "Manicure", category: "Manicure & Pedicure", quantity: 1, price: 499 }
        ],
        date: "07 Jul 2025",
        time: "04:00 PM - 04:45 PM",
        status: "confirmed",
        paymentStatus: "completed",
        totalAmount: 3996,
        address: "202 C Wing, Mahatma Gandhi Apartment, Nawagadhi, Gaya (823001)"
      },
      {
        id: 5,
        bookingId: "MAK001238",
        services: [
          { name: "Hand & Leg Waxing", category: "Waxing", quantity: 1, price: 1499 },
          { name: "De-Tan Facial", category: "Cleanup & Facial", quantity: 2, price: 999 },
          { name: "Manicure", category: "Manicure & Pedicure", quantity: 1, price: 499 }
        ],
        date: "08 Jul 2025",
        time: "05:00 PM - 05:45 PM",
        status: "confirmed",
        paymentStatus: "pending",
        totalAmount: 3996,
        address: "202 C Wing, Mahatma Gandhi Apartment, Nawagadhi, Gaya (823001)"
      }
    ];
    setBookings(sampleBookings);
  }, []);

  // Time slots for rescheduling
  const timeSlots = [
    "09:00 AM - 09:45 AM",
    "10:00 AM - 10:45 AM",
    "11:00 AM - 11:45 AM",
    "12:00 PM - 12:45 PM",
    "01:00 PM - 01:45 PM",
    "02:00 PM - 02:45 PM",
    "03:00 PM - 03:45 PM",
    "04:00 PM - 04:45 PM",
    "05:00 PM - 05:45 PM",
    "06:00 PM - 06:45 PM"
  ];

  // Generate next 30 days
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Handle view booking details
  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  // Handle cancel booking
  const handleCancelBooking = () => {
    if (selectedBooking) {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      setShowCancelModal(false);
      setShowBookingDetails(false);
    }
  };

  // Handle reschedule booking
  const handleRescheduleBooking = () => {
    if (selectedBooking && newBookingDate && newBookingTime) {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === selectedBooking.id 
            ? { 
                ...booking, 
                date: new Date(newBookingDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }),
                time: newBookingTime
              }
            : booking
        )
      );
      setShowRescheduleModal(false);
      setShowBookingDetails(false);
      setNewBookingDate("");
      setNewBookingTime("");
    }
  };

  // Handle complete payment
  const handleCompletePayment = () => {
    if (selectedBooking) {
      // Update payment status
      setBookings(prev => 
        prev.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, paymentStatus: 'completed' }
            : booking
        )
      );
      setShowBookingDetails(false);
      // In a real app, redirect to payment gateway
      alert("Redirecting to payment gateway...");
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Booking Cancelled</span>;
      case 'confirmed':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Confirmed</span>;
      default:
        return null;
    }
  };

  // Get payment status badge
  const getPaymentBadge = (paymentStatus) => {
    if (paymentStatus === 'completed') {
      return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Payment Completed</span>;
    }
    return null;
  };

  // If showing booking details
  if (showBookingDetails && selectedBooking) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Details (2/3 width) */}
            <div className="lg:col-span-2 bg-white p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>
              
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-300 mb-4">
                <div className="font-semibold text-gray-800">Service</div>
                <div className="font-semibold text-gray-800">Quantity</div>
                <div className="font-semibold text-gray-800">Price</div>
                <div className="font-semibold text-gray-800">Subtotal</div>
              </div>
              
              {/* Services Table */}
              <div className="space-y-4">
                {selectedBooking.services.map((service, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💅</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#CC2B52]">{service.category}</p>
                        <p className="font-semibold text-gray-900">{service.name}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-semibold">{service.quantity}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-semibold">{formatPrice(service.price)}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-bold">{formatPrice(service.price * service.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="mt-6 pt-4 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-gray-800">{formatPrice(selectedBooking.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Actions (1/3 width) */}
            <div className="bg-[#F7EBEE] rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Thanks For Booking With Makeover 👋
                </h3>
                <p className="text-gray-600 text-sm">
                  Your booking is successfully placed for selected services on {selectedBooking.date}, {selectedBooking.time}. 
                  You can pay {formatPrice(selectedBooking.totalAmount)} now or after the service is complete.
                </p>
              </div>

              {/* All Action Buttons in Same Box */}
              <div className="space-y-3">
                {selectedBooking.status !== 'cancelled' && (
                  <>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-3 px-4 border-2 border-[#CC2B52] text-[#CC2B52] rounded-lg font-medium hover:bg-[#CC2B52] hover:text-white transition-colors"
                    >
                      Cancel Booking
                    </button>
                    
                    <button
                      onClick={() => setShowRescheduleModal(true)}
                      className="w-full py-3 px-4 border-2 border-[#CC2B52] text-[#CC2B52] rounded-lg font-medium hover:bg-[#CC2B52] hover:text-white transition-colors"
                    >
                      Reschedule Booking
                    </button>
                  </>
                )}

                {selectedBooking.paymentStatus === 'pending' && (
                  <button
                    onClick={handleCompletePayment}
                    className="w-full py-3 px-4 bg-[#CC2B52] text-white rounded-lg font-medium hover:bg-[#CC2B52]/90 transition-colors"
                  >
                    Complete Payment
                  </button>
                )}

                {selectedBooking.paymentStatus === 'completed' && (
                  <div className="w-full py-3 px-4 bg-green-100 text-green-800 rounded-lg font-medium text-center">
                    Payment Completed
                  </div>
                )}
              </div>

              {/* Help Contact */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Need help with your booking? Write us at{" "}
                  <a href="mailto:hello@wemakeover.co.in" className="text-[#CC2B52] underline">
                    hello@wemakeover.co.in
                  </a>
                </p>
              </div>

              {/* Back Button */}
              <button
                onClick={() => setShowBookingDetails(false)}
                className="w-full mt-4 py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to My Bookings
              </button>
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Cancel Booking</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Reschedule Booking</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <select
                    value={newBookingDate}
                    onChange={(e) => setNewBookingDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  >
                    <option value="">Choose a date</option>
                    {generateAvailableDates().map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <select
                    value={newBookingTime}
                    onChange={(e) => setNewBookingTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  >
                    <option value="">Choose a time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleBooking}
                  disabled={!newBookingDate || !newBookingTime}
                  className="flex-1 py-2 px-4 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main bookings page
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-gray-600">
            Need help with your booking? Write us at{" "}
            <a href="mailto:hello@wemakeover.co.in" className="text-[#CC2B52] underline">
              hello@wemakeover.co.in
            </a>
          </p>
        </div>

        {/* Bookings Grid - Parallel Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex">
              {/* Left Side - Branding (30% width) */}
              <div className="w-1/3 bg-gradient-to-b from-pink-100 to-pink-200 p-4 flex flex-col justify-center items-center">
                <h3 className="text-lg font-bold text-[#CC2B52]">макеover</h3>
                <p className="text-sm text-[#CC2B52] font-medium">BOOKING</p>
              </div>

              {/* Right Side - Booking Details (70% width) */}
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 text-sm">
                    {booking.services.map(s => s.name).join(", ")}
                  </h4>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex items-center">
                      <span className="mr-1">📅</span>
                      {booking.date}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">🕐</span>
                      {booking.time}
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {getStatusBadge(booking.status)}
                    {getPaymentBadge(booking.paymentStatus)}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewBookingDetails(booking)}
                  className="w-full bg-white border-2 border-[#CC2B52] text-[#CC2B52] py-2 px-3 rounded-lg font-medium hover:bg-[#CC2B52] hover:text-white transition-colors text-sm"
                >
                  View Booking Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#CC2B52] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#CC2B52]/90 transition-colors"
            >
              Book Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
