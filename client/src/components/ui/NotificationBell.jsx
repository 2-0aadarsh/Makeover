/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Star,
  MessageSquare,
  Calendar,
  CheckCheck,
  Loader2,
} from "lucide-react";

import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  toggleDropdown,
  closeDropdown,
  selectNotifications,
  selectUnreadCount,
  selectLoading,
  selectIsDropdownOpen,
} from "../../features/notifications/notificationsSlice";

/**
 * NotificationBell Component
 * 
 * A bell icon with unread count badge that opens a dropdown
 * showing recent notifications.
 * 
 * Features:
 * - Unread count badge
 * - Dropdown with scrollable notifications
 * - Click outside to close
 * - Mark as read functionality
 * - Empty state design
 * - Accessible (ARIA-friendly)
 */
const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Redux state
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const loading = useSelector(selectLoading);
  const isOpen = useSelector(selectIsDropdownOpen);
  
  // Fetch unread count on mount
  useEffect(() => {
    dispatch(fetchUnreadCount());
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  // Fetch notifications when dropdown opens (show latest 20; list scrolls if needed)
  const NOTIFICATIONS_LIMIT = 3;
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications({ limit: NOTIFICATIONS_LIMIT }));
    }
  }, [isOpen, dispatch]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        dispatch(closeDropdown());
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, dispatch]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        dispatch(closeDropdown());
        buttonRef.current?.focus();
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, dispatch]);
  
  // Handle notification click
  const handleNotificationClick = useCallback((notification) => {
    // Mark as read
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id));
    }
    
    // Navigate based on notification type
    if (notification.type === "review_request") {
      // Always navigate to My Bookings where user can write review from the booking card
      navigate("/my-bookings");
    } else if (notification.type === "complaint_response") {
      navigate("/my-reviews");
    } else if (notification.type === "booking_completed") {
      navigate("/my-bookings");
    } else {
      // Default: go to bookings
      navigate("/my-bookings");
    }
    
    dispatch(closeDropdown());
  }, [dispatch, navigate]);
  
  // Handle mark all as read
  const handleMarkAllRead = useCallback(() => {
    dispatch(markAllNotificationsAsRead());
  }, [dispatch]);
  
  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "review_request":
        return <Star className="w-4 h-4 text-yellow-500" />;
      case "complaint_response":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "booking_completed":
        return <Calendar className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };
  
  return (
    <div className="relative">
      <style>{`
        @media (max-width: 640px) {
          .notification-panel-list {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .notification-panel-list::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => dispatch(toggleDropdown())}
        className="relative p-2 text-gray-600 hover:text-[#CC2B52] hover:bg-pink-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#CC2B52]/20"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
        
        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#CC2B52] text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      
      {/* Backdrop on mobile for overlay feel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/20 z-40 sm:hidden"
            aria-hidden="true"
            onClick={() => dispatch(closeDropdown())}
          />
        )}
      </AnimatePresence>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed left-2 right-2 top-[4.25rem] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96 min-w-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50
                       max-h-[70vh] sm:max-h-[28rem] flex flex-col"
            role="menu"
            aria-orientation="vertical"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#CC2B52] hover:text-[#B02547] font-medium flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => dispatch(closeDropdown())}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Notifications List - scrollbar hidden on mobile for cleaner UI */}
            <div
              className="notification-panel-list flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain pb-3"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#CC2B52] animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                /* Empty State */
                <div className="py-12 px-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-300" />
                  </div>
                  <h4 className="font-medium text-gray-700 mb-1">No notifications yet</h4>
                  <p className="text-sm text-gray-400">
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 border-b border-gray-50 last:border-0 ${
                          !notification.isRead ? "bg-pink-50/50" : ""
                        }`}
                        role="menuitem"
                      >
                        {/* Icon */}
                        <div className={`mt-0.5 p-2 rounded-full ${!notification.isRead ? "bg-white" : "bg-gray-100"}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.isRead ? "font-semibold text-gray-800" : "text-gray-700"}`}>
                            {notification.title}
                          </p>
                          {/* For complaint responses, show admin reply from metadata if present */}
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-3">
                            {notification.type === "complaint_response" && notification.metadata?.adminResponse
                              ? notification.metadata.adminResponse
                              : notification.message}
                          </p>
                          {notification.type === "complaint_response" && notification.metadata?.adminResponse && (
                            <p className="text-xs text-[#CC2B52] mt-1 font-medium">
                              View in My Reviews →
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        
                        {/* Unread indicator */}
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-[#CC2B52] rounded-full mt-2 flex-shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 p-3 shrink-0">
                <button
                  onClick={() => {
                    navigate("/my-bookings");
                    dispatch(closeDropdown());
                  }}
                  className="w-full py-2 text-sm text-[#CC2B52] hover:text-[#B02547] font-medium hover:bg-pink-50 rounded-lg transition-colors"
                >
                  View all in My Bookings
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
