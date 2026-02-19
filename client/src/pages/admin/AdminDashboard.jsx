<<<<<<< HEAD
import { useEffect, useState, useRef } from "react";
=======
import { useEffect } from "react";
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
import { useDispatch, useSelector } from "react-redux";
import { HiMiniUsers } from "react-icons/hi2";
import { RiBox3Fill } from "react-icons/ri";
import { BsGraphUp } from "react-icons/bs";
import { RxCountdownTimer } from "react-icons/rx";
<<<<<<< HEAD
import { ChevronDown } from "lucide-react";
=======
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
import MetricCard from "../../components/admin/dashboard/MetricCard";
import TodaysBookingTable from "../../components/admin/dashboard/TodaysBookingTable";
import Loader from "../../components/common/Loader/loader.jsx";
import {
  fetchDashboardMetrics,
  fetchTodayBookings,
} from "../../features/admin/dashboard/adminDashboardThunks";
<<<<<<< HEAD
import { setBookingsPage, setBookingsPeriod } from "../../features/admin/dashboard/adminDashboardSlice";
=======
import { setBookingsPage } from "../../features/admin/dashboard/adminDashboardSlice";
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8

/**
 * AdminDashboard - Main dashboard page for admin
 * Displays:
 * - KPI cards (Total User, Total Order, Total Sales, Upcoming Order)
 * - Today's Booking table
 * 
 * Fetches real data from backend API
 */
<<<<<<< HEAD
const PERIOD_OPTIONS = [
  { value: 'today', label: "Today's Booking" },
  { value: 'tomorrow', label: "Tomorrow's Booking" },
  { value: 'week', label: "This Week's Bookings" },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const periodDropdownRef = useRef(null);
=======
const AdminDashboard = () => {
  const dispatch = useDispatch();
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
  const {
    metrics,
    metricsLoading,
    metricsError,
<<<<<<< HEAD
    bookingsPeriod,
    bookingsCache,
=======
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
    todayBookings,
    bookingsPagination,
    bookingsLoading,
    bookingsError,
  } = useSelector((state) => state.adminDashboard);

<<<<<<< HEAD
  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === bookingsPeriod)?.label ?? "Today's Booking";

  // Close period dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(e.target)) {
        setPeriodDropdownOpen(false);
      }
    };
    if (periodDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [periodDropdownOpen]);

=======
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
  // Fetch dashboard metrics on component mount
  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);

<<<<<<< HEAD
  // Fetch bookings when period/page changes; skip if we already have cache for this period+page
  useEffect(() => {
    const cached = bookingsCache[bookingsPeriod];
    const cacheMatches =
      cached &&
      cached.pagination &&
      cached.pagination.currentPage === bookingsPagination.currentPage;
    if (cacheMatches) return;
    dispatch(
      fetchTodayBookings({
        period: bookingsPeriod,
        page: bookingsPagination.currentPage,
        limit: 8,
      })
    );
  }, [dispatch, bookingsPeriod, bookingsPagination.currentPage, bookingsCache]);
=======
  // Fetch today's bookings on component mount and when page changes
  useEffect(() => {
    dispatch(
      fetchTodayBookings({
        page: bookingsPagination.currentPage,
        limit: 8, // Show 8 bookings per page
      })
    );
  }, [dispatch, bookingsPagination.currentPage]);
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8

  const handlePageChange = (page) => {
    dispatch(setBookingsPage(page));
  };

<<<<<<< HEAD
  const handlePeriodSelect = (value) => {
    dispatch(setBookingsPeriod(value));
    setPeriodDropdownOpen(false);
  };

=======
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
  // Format metrics for MetricCard component
  const formatMetrics = () => {
    if (!metrics || Object.keys(metrics).length === 0) {
      return {
        totalUsers: {
          title: "Total User",
          value: "0",
          icon: <HiMiniUsers style={{ width: '24px', height: '24px' }} />,
          growth: 0,
          trend: "up",
          label: "No data",
          iconColor: "bg-purple-100",
          iconBgColor: "#8280FF",
          iconBgOpacity: 0.21,
          iconTextColor: "#8280FF",
        },
        totalOrders: {
          title: "Total Order",
          value: "0",
          icon: <RiBox3Fill style={{ width: '24px', height: '24px' }} />,
          growth: 0,
          trend: "up",
          label: "No data",
          iconColor: "bg-yellow-100",
          iconBgColor: "#FEC53D",
          iconBgOpacity: 0.21,
          iconTextColor: "#FEC53D",
        },
        totalSales: {
          title: "Total Sales",
          value: "₹0",
          icon: <BsGraphUp style={{ width: '24px', height: '24px' }} />,
          growth: 0,
          trend: "up",
          label: "No data",
          iconColor: "bg-green-100",
          iconBgColor: "#4AD991",
          iconBgOpacity: 0.21,
          iconTextColor: "#4AD991",
        },
        upcomingOrders: {
          title: "Upcoming Order",
          value: "0",
          icon: <RxCountdownTimer style={{ width: '24px', height: '24px' }} />,
          growth: 0,
          trend: "up",
          label: "No data",
          iconColor: "bg-orange-100",
          iconBgColor: "#FF9066",
          iconBgOpacity: 0.21,
          iconTextColor: "#FF9066",
        },
      };
    }

    return {
      totalUsers: {
        title: "Total User",
        value: metrics.totalUsers?.count?.toLocaleString() || "0",
        icon: <HiMiniUsers style={{ width: '24px', height: '24px' }} />,
        growth: Math.abs(metrics.totalUsers?.growth || 0),
        trend: metrics.totalUsers?.trend || "up",
        label: metrics.totalUsers?.label || "No change",
        iconColor: "bg-purple-100",
        iconBgColor: "#8280FF",
        iconBgOpacity: 0.21,
        iconTextColor: "#8280FF",
      },
      totalOrders: {
        title: "Total Order",
        value: metrics.totalBookings?.count?.toLocaleString() || "0",
        icon: <RiBox3Fill style={{ width: '24px', height: '24px' }} />,
        growth: Math.abs(metrics.totalBookings?.growth || 0),
        trend: metrics.totalBookings?.trend || "up",
        label: metrics.totalBookings?.label || "No change",
        iconColor: "bg-yellow-100",
        iconBgColor: "#FEC53D",
        iconBgOpacity: 0.21,
        iconTextColor: "#FEC53D",
      },
      totalSales: {
        title: "Total Sales",
        value: metrics.totalRevenue?.formattedAmount || "₹0",
        icon: <BsGraphUp style={{ width: '24px', height: '24px' }} />,
        growth: Math.abs(metrics.totalRevenue?.growth || 0),
        trend: metrics.totalRevenue?.trend || "up",
        label: metrics.totalRevenue?.label || "No change",
        iconColor: "bg-green-100",
        iconBgColor: "#4AD991",
        iconBgOpacity: 0.21,
        iconTextColor: "#4AD991",
      },
      upcomingOrders: {
        title: "Upcoming Order",
        value: metrics.upcomingBookings?.count?.toLocaleString() || "0",
        icon: <RxCountdownTimer style={{ width: '24px', height: '24px' }} />,
        growth: Math.abs(metrics.upcomingBookings?.growth || 0),
        trend: metrics.upcomingBookings?.trend || "up",
        label: metrics.upcomingBookings?.label || "No change",
        iconColor: "bg-orange-100",
        iconBgColor: "#FF9066",
        iconBgOpacity: 0.21,
        iconTextColor: "#FF9066",
      },
    };
  };

  const formattedMetrics = formatMetrics();

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12 lg:px-[80px]">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-[#202224] mb-8 font-sans" style={{ fontSize: "32px" }}>Dashboard</h1>

      {/* KPI Cards Grid */}
      {metricsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : metricsError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800 font-sans" style={{ fontSize: "15px" }}>
            Error loading metrics: {metricsError}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard {...formattedMetrics.totalUsers} />
          <MetricCard {...formattedMetrics.totalOrders} />
          <MetricCard {...formattedMetrics.totalSales} />
          <MetricCard {...formattedMetrics.upcomingOrders} />
        </div>
      )}

<<<<<<< HEAD
      {/* Bookings by period: heading as dropdown trigger */}
      <div className="mb-6 relative" ref={periodDropdownRef}>
        <button
          type="button"
          onClick={() => setPeriodDropdownOpen((o) => !o)}
          className="text-xl font-bold text-[#CC2B52] mb-2 border-b-2 border-[#CC2B52] pb-2 inline-flex items-center gap-1 font-sans cursor-pointer hover:opacity-90"
          style={{ fontSize: "22px" }}
          aria-expanded={periodDropdownOpen}
          aria-haspopup="listbox"
        >
          {periodLabel}
          <ChevronDown
            className={`w-5 h-5 transition-transform ${periodDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {periodDropdownOpen && (
          <div
            role="listbox"
            className="absolute top-full left-0 z-50 mt-1 min-w-[220px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={bookingsPeriod === opt.value}
                onClick={() => handlePeriodSelect(opt.value)}
                className={`w-full px-4 py-3 text-left font-sans text-[15px] transition-colors ${
                  bookingsPeriod === opt.value
                    ? "bg-[#FFF5F7] text-[#CC2B52] font-medium border-l-3 border-[#CC2B52]"
                    : "text-[#292D32] hover:bg-gray-50 hover:text-[#CC2B52]"
                }`}
                style={{ borderLeftWidth: bookingsPeriod === opt.value ? "3px" : "0px" }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bookings Table */}
      {bookingsLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
          <Loader size="medium" useCustomGif text={`Loading ${periodLabel.toLowerCase()}...`} />
=======
      {/* Today's Booking Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#CC2B52] mb-2 border-b-2 border-[#CC2B52] pb-2 inline-block font-sans" style={{ fontSize: "22px" }}>
          Today's Booking
        </h2>
      </div>

      {/* Today's Booking Table */}
      {bookingsLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
          <Loader size="medium" useCustomGif text="Loading today's bookings..." />
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
        </div>
      ) : bookingsError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-sans" style={{ fontSize: "15px" }}>
            Error loading bookings: {bookingsError}
          </p>
        </div>
      ) : (
        <TodaysBookingTable
          bookings={todayBookings}
          onPageChange={handlePageChange}
          pagination={bookingsPagination}
<<<<<<< HEAD
          period={bookingsPeriod}
=======
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
        />
      )}
    </div>
  );
};

export default AdminDashboard;
