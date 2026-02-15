import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSiteSettings,
  updateHeroSettings,
  updateGallerySettings,
  updateBrandingSettings,
  uploadSiteAsset,
  deleteSiteAsset,
  fetchPublicSiteSettings,
} from './siteSettingsThunks';

const initialState = {
  settings: null,
  publicSettings: null,
  loading: false,
  uploadLoading: false,
  error: null,
  lastUpdated: null,
  unsavedChanges: false,
};

const siteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState,
  reducers: {
    setUnsavedChanges: (state, action) => {
      state.unsavedChanges = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSiteSettings: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch site settings (admin)
      .addCase(fetchSiteSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.unsavedChanges = false;
      })
      .addCase(fetchSiteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update hero settings
      .addCase(updateHeroSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHeroSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.unsavedChanges = false;
      })
      .addCase(updateHeroSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update gallery settings
      .addCase(updateGallerySettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGallerySettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.unsavedChanges = false;
      })
      .addCase(updateGallerySettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update branding settings
      .addCase(updateBrandingSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrandingSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.unsavedChanges = false;
      })
      .addCase(updateBrandingSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload site asset
      .addCase(uploadSiteAsset.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadSiteAsset.fulfilled, (state) => {
        state.uploadLoading = false;
        state.unsavedChanges = true;
      })
      .addCase(uploadSiteAsset.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      })

      // Delete site asset
      .addCase(deleteSiteAsset.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(deleteSiteAsset.fulfilled, (state) => {
        state.uploadLoading = false;
        state.unsavedChanges = true;
      })
      .addCase(deleteSiteAsset.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      })

      // Fetch public site settings
      .addCase(fetchPublicSiteSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicSiteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.publicSettings = action.payload;
      })
      .addCase(fetchPublicSiteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUnsavedChanges, clearError, resetSiteSettings } = siteSettingsSlice.actions;

export default siteSettingsSlice.reducer;
