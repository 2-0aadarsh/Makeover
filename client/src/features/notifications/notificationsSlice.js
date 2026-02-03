import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationsApi } from "./notificationsApi";

/**
 * Async Thunks
 */

// Fetch notifications (paginated)
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getNotifications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

// Get unread count
export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getUnreadCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

// Get review request notifications
export const fetchReviewRequests = createAsyncThunk(
  "notifications/fetchReviewRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getReviewRequests();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch review requests"
      );
    }
  }
);

// Mark single notification as read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.markAsRead(notificationId);
      return { notificationId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.markAllAsRead();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read"
      );
    }
  }
);

// Delete a notification
export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationsApi.deleteNotification(notificationId);
      return { notificationId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

/**
 * Initial State
 */
const initialState = {
  // Main notifications list
  notifications: [],
  
  // Unread count for badge
  unreadCount: 0,
  
  // Review request notifications (for toast)
  reviewRequests: {
    notifications: [],
    count: 0,
  },
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  
  // Loading states
  loading: false,
  countLoading: false,
  reviewRequestsLoading: false,
  
  // Error state
  error: null,
  
  // Dropdown visibility (UI state)
  isDropdownOpen: false,
  
  // Toast visibility (UI state)
  showReviewToast: false,
  toastDismissed: false,
};

/**
 * Notifications Slice
 */
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Toggle notification dropdown
    toggleDropdown: (state) => {
      state.isDropdownOpen = !state.isDropdownOpen;
    },
    
    // Close dropdown
    closeDropdown: (state) => {
      state.isDropdownOpen = false;
    },
    
    // Open dropdown
    openDropdown: (state) => {
      state.isDropdownOpen = true;
    },
    
    // Show review toast
    showReviewToast: (state) => {
      if (!state.toastDismissed && state.reviewRequests.count > 0) {
        state.showReviewToast = true;
      }
    },
    
    // Hide review toast
    hideReviewToast: (state) => {
      state.showReviewToast = false;
    },
    
    // Dismiss toast permanently (for this session)
    dismissToast: (state) => {
      state.showReviewToast = false;
      state.toastDismissed = true;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state (on logout)
    resetNotifications: () => initialState,
    
    // Optimistically decrement unread count
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data?.notifications || [];
        state.pagination = action.payload.data?.pagination || initialState.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Unread Count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.countLoading = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.countLoading = false;
        state.unreadCount = action.payload.data?.unreadCount || 0;
      })
      .addCase(fetchUnreadCount.rejected, (state) => {
        state.countLoading = false;
      })
      
      // Fetch Review Requests
      .addCase(fetchReviewRequests.pending, (state) => {
        state.reviewRequestsLoading = true;
      })
      .addCase(fetchReviewRequests.fulfilled, (state, action) => {
        state.reviewRequestsLoading = false;
        state.reviewRequests.notifications = action.payload.data?.notifications || [];
        state.reviewRequests.count = action.payload.data?.count || 0;
        // Show toast if there are pending reviews and not dismissed
        if (action.payload.data?.count > 0 && !state.toastDismissed) {
          state.showReviewToast = true;
        }
      })
      .addCase(fetchReviewRequests.rejected, (state) => {
        state.reviewRequestsLoading = false;
      })
      
      // Mark As Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        const notification = state.notifications.find((n) => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date().toISOString();
          if (state.unreadCount > 0) {
            state.unreadCount -= 1;
          }
        }
      })
      
      // Mark All As Read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: n.readAt || new Date().toISOString(),
        }));
        state.unreadCount = 0;
      })
      
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        const notification = state.notifications.find((n) => n.id === notificationId);
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter((n) => n.id !== notificationId);
      });
  },
});

// Export actions
export const {
  toggleDropdown,
  closeDropdown,
  openDropdown,
  showReviewToast,
  hideReviewToast,
  dismissToast,
  clearError,
  resetNotifications,
  decrementUnreadCount,
} = notificationsSlice.actions;

// Export selectors
export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectReviewRequests = (state) => state.notifications.reviewRequests;
export const selectPagination = (state) => state.notifications.pagination;
export const selectLoading = (state) => state.notifications.loading;
export const selectIsDropdownOpen = (state) => state.notifications.isDropdownOpen;
export const selectShowReviewToast = (state) => state.notifications.showReviewToast;

export default notificationsSlice.reducer;
