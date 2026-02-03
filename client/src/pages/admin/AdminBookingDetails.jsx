import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchBookingById, updateBookingStatus } from "../../features/admin/bookings/adminBookingsThunks";
import Loader from "../../components/common/Loader/loader.jsx";
import Select from "../../components/ui/Select.jsx";

/**
 * AdminBookingDetails - Admin page for viewing detailed booking information
 * Matches Figma design with customer info, services list, and total amount
 */
const AdminBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    bookingDetails,
    detailsLoading,
    detailsError,
    statusUpdateLoading,
    statusUpdateError,
  } = useSelector((state) => state.adminBookings);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");

  // Sync selected status when booking details load
  useEffect(() => {
    if (bookingDetails?.status) {
      setSelectedStatus(bookingDetails.status);
    }
  }, [bookingDetails?.status]);

  // Fetch booking details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchBookingById(id));
    }
  }, [dispatch, id]);

  // Format date and time (matching backend format: "2025 Sep 12 - 01:00-01:30 PM")
  const formatDateTime = (date, slot) => {
    if (!date) return "N/A";
    try {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[dateObj.getMonth()];
      const day = dateObj.getDate();
      return slot ? `${year} ${month} ${day} - ${slot}` : `${year} ${month} ${day}`;
    } catch (error) {
      return "N/A";
    }
  };

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return "N/A";
    return phone.startsWith("+91") ? phone : `(+91) ${phone}`;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        text: "Completed",
        className: "bg-green-500 text-white",
      },
      pending: {
        text: "Pending",
        className: "bg-yellow-500 text-white",
      },
      confirmed: {
        text: "Confirmed",
        className: "bg-blue-500 text-white",
      },
      in_progress: {
        text: "In Progress",
        className: "bg-blue-400 text-white",
      },
      cancelled: {
        text: "Cancelled",
        className: "bg-red-500 text-white",
      },
      no_show: {
        text: "No Show",
        className: "bg-orange-500 text-white",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  // Get service image based on category/name
  const getServiceImage = (serviceName, category) => {
    if (!serviceName && !category) {
      return null;
    }

    const name = (serviceName || category || "").toLowerCase();
    
    // Try to find service image - for now use a placeholder
    // You can enhance this by importing actual images or using a service image mapping
    // For now, return null to show a placeholder div
    return null;
  };

  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 lg:p-12 lg:px-[80px] flex items-center justify-center">
        <Loader size="large" useCustomGif text="Loading booking details..." />
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 lg:p-12 lg:px-[80px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-sans" style={{ fontSize: "15px" }}>Error: {detailsError}</p>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="mt-4 px-4 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 font-sans"
            style={{ fontSize: "15px" }}
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 lg:p-12 lg:px-[80px]">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 font-sans" style={{ fontSize: "16px" }}>Booking not found</p>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="mt-4 px-4 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 font-sans"
            style={{ fontSize: "15px" }}
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const { customer, services, bookingDetails: bookingInfo, pricing, status, orderNumber } = bookingDetails;

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12 lg:px-[80px]">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/bookings")}
        className="mb-6 text-[#CC2B52] hover:text-[#CC2B52]/80 font-semibold flex items-center gap-2 font-sans"
        style={{ fontSize: "16px" }}
      >
        ← Back to Bookings
      </button>

      {/* Customer Info Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h2
              className="text-2xl font-bold font-sans"
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#292D32",
              }}
            >
              {customer?.name || "N/A"}
            </h2>
            <span
              className="text-blue-600 font-semibold font-sans"
              style={{
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {orderNumber || "N/A"}
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#292D32",
              }}
            >
              {formatPhone(customer?.phoneNumber)}
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#292D32",
              }}
            >
              {customer?.email || "N/A"}
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#292D32",
              }}
            >
              {formatDateTime(bookingInfo?.date, bookingInfo?.slot)}
            </span>
          </div>
          <div>{getStatusBadge(status)}</div>
        </div>
      </div>

      {/* Update Status Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3
          className="text-xl font-bold mb-4 font-sans"
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#292D32",
          }}
        >
          Update Booking Status
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-wrap">
          <div className="flex flex-col gap-1 min-w-[200px] flex-1 sm:flex-initial">
            <label className="text-sm font-medium text-gray-700 shrink-0">Status</label>
            <Select
              showLabel={false}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "in_progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "no_show", label: "No Show" },
              ]}
              placeholder="Select status"
              labelClassName="text-sm font-medium text-gray-700"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[200px] max-w-md">
            <label className="text-sm font-medium text-gray-700 shrink-0">
              Admin note (optional)
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add a note for this status change..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] resize-y min-h-[44px]"
            />
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <span className="block text-sm font-medium text-gray-700 h-5 shrink-0 invisible select-none" aria-hidden="true">
              Update
            </span>
            <button
              type="button"
              onClick={() => {
                if (!selectedStatus) {
                  toast.error("Please select a status");
                  return;
                }
                dispatch(
                  updateBookingStatus({
                    bookingId: bookingDetails.id || id,
                    status: selectedStatus,
                    adminNote: adminNote.trim() || undefined,
                  })
                ).then((result) => {
                  if (result.meta?.requestStatus === "fulfilled") {
                    toast.success("Booking status updated successfully");
                    setAdminNote("");
                  } else if (result.meta?.requestStatus === "rejected") {
                    toast.error(result.payload || "Failed to update status");
                  }
                });
              }}
              disabled={statusUpdateLoading || !selectedStatus || selectedStatus === status}
              className="px-6 py-2.5 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors whitespace-nowrap h-[44px] flex items-center justify-center"
            >
              {statusUpdateLoading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
        {statusUpdateError && (
          <p className="mt-3 text-sm text-red-600">{statusUpdateError}</p>
        )}
      </div>

      {/* Booking Details Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3
          className="text-xl font-bold mb-6 font-sans"
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#292D32",
          }}
        >
          Booking Details
        </h3>

        {/* Table Headers */}
        <div className="grid grid-cols-12 gap-4 mb-4 pb-3 border-b border-gray-200">
          <div className="col-span-5">
            <span
              className="font-semibold font-sans"
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Service
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span
              className="font-semibold font-sans"
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Quantity
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span
              className="font-semibold font-sans"
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Price
            </span>
          </div>
          <div className="col-span-3 text-right">
            <span
              className="font-semibold font-sans"
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Subtotal
            </span>
          </div>
        </div>

        {/* Service Items */}
        {services && services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-lg"
              >
                {/* Service Image and Name */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    {getServiceImage(service.name, service.category) ? (
                      <img
                        src={getServiceImage(service.name, service.category)}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#CC2B52] to-pink-400">
                        <span className="text-white text-xs font-bold">
                          {(service.name || service.category || "S")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4
                      className="font-semibold mb-1 font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#CC2B52",
                      }}
                    >
                      {service.name || service.category || "Service"}
                    </h4>
                    <p
                      className="text-sm font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#292D32",
                      }}
                    >
                      {service.description || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-2 text-center">
                  <div
                    className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 rounded font-sans"
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#292D32",
                    }}
                  >
                    {String(service.quantity || 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-center">
                  <span
                    className="font-sans"
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#292D32",
                    }}
                  >
                    ₹{service.price?.toLocaleString("en-IN") || "0"}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="col-span-3 text-right">
                  <span
                    className="font-sans"
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#292D32",
                    }}
                  >
                    ₹{(service.subtotal || service.price * (service.quantity || 1)).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 font-sans" style={{ fontSize: "16px" }}>No services found</p>
        )}

        {/* Total Amount */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
          <span
            className="font-bold text-lg font-sans"
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#292D32",
            }}
          >
            Total Amount:
          </span>
          <span
            className="font-bold text-lg font-sans"
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#292D32",
            }}
          >
            {pricing?.formattedTotal || `₹${(pricing?.totalAmount || 0).toLocaleString("en-IN")}.00`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetails;
