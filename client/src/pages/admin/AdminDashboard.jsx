import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiMiniUsers } from "react-icons/hi2";
import { RiBox3Fill } from "react-icons/ri";
import { BsGraphUp } from "react-icons/bs";
import { RxCountdownTimer } from "react-icons/rx";
import MetricCard from "../../components/admin/dashboard/MetricCard";
import TodaysBookingTable from "../../components/admin/dashboard/TodaysBookingTable";
import Loader from "../../components/common/Loader/loader.jsx";
import {
  fetchDashboardMetrics,
  fetchTodayBookings,
} from "../../features/admin/dashboard/adminDashboardThunks";
import { setBookingsPage } from "../../features/admin/dashboard/adminDashboardSlice";

/**
 * AdminDashboard - Main dashboard page for admin
 * Displays:
 * - KPI cards (Total User, Total Order, Total Sales, Upcoming Order)
 * - Today's Booking table
 * 
 * Fetches real data from backend API
 */
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    metrics,
    metricsLoading,
    metricsError,
    todayBookings,
    bookingsPagination,
    bookingsLoading,
    bookingsError,
  } = useSelector((state) => state.adminDashboard);

  // Fetch dashboard metrics on component mount
  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);

  // Fetch today's bookings on component mount and when page changes
  useEffect(() => {
    dispatch(
      fetchTodayBookings({
        page: bookingsPagination.currentPage,
        limit: 8, // Show 8 bookings per page
      })
    );
  }, [dispatch, bookingsPagination.currentPage]);

  const handlePageChange = (page) => {
    dispatch(setBookingsPage(page));
  };

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
        />
      )}
    </div>
  );
};

export default AdminDashboard;
