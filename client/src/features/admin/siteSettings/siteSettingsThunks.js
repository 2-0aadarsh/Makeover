import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchSiteSettingsApi,
  updateHeroSettingsApi,
  updateGallerySettingsApi,
  updateBrandingSettingsApi,
  uploadSiteAssetApi,
  deleteSiteAssetApi,
  fetchPublicSiteSettingsApi,
} from './siteSettingsApi';

/**
 * Fetch site settings (admin)
 */
export const fetchSiteSettings = createAsyncThunk(
  'siteSettings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchSiteSettingsApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Update hero section settings
 */
export const updateHeroSettings = createAsyncThunk(
  'siteSettings/updateHero',
  async (heroData, { rejectWithValue }) => {
    try {
      const data = await updateHeroSettingsApi(heroData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Update gallery section settings
 */
export const updateGallerySettings = createAsyncThunk(
  'siteSettings/updateGallery',
  async (galleryData, { rejectWithValue }) => {
    try {
      const data = await updateGallerySettingsApi(galleryData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Update branding settings
 */
export const updateBrandingSettings = createAsyncThunk(
  'siteSettings/updateBranding',
  async (brandingData, { rejectWithValue }) => {
    try {
      const data = await updateBrandingSettingsApi(brandingData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Upload a site asset
 */
export const uploadSiteAsset = createAsyncThunk(
  'siteSettings/uploadAsset',
  async ({ file, assetType }, { rejectWithValue }) => {
    try {
      const data = await uploadSiteAssetApi(file, assetType);
      return { ...data, assetType };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Delete a site asset
 */
export const deleteSiteAsset = createAsyncThunk(
  'siteSettings/deleteAsset',
  async (publicId, { rejectWithValue }) => {
    try {
      const data = await deleteSiteAssetApi(publicId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch public site settings (for frontend)
 */
export const fetchPublicSiteSettings = createAsyncThunk(
  'siteSettings/fetchPublicSettings',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchPublicSiteSettingsApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
