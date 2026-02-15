const backendurl = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetch site settings (admin view)
 */
export const fetchSiteSettingsApi = async () => {
  const response = await fetch(`${backendurl}/api/admin/site-settings`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch site settings');
  }

  return data.data;
};

/**
 * Update hero section settings
 */
export const updateHeroSettingsApi = async (heroData) => {
  const response = await fetch(`${backendurl}/api/admin/site-settings/hero`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(heroData),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to update hero settings');
  }

  return data.data;
};

/**
 * Update gallery section settings
 */
export const updateGallerySettingsApi = async (galleryData) => {
  const response = await fetch(`${backendurl}/api/admin/site-settings/gallery`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(galleryData),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to update gallery settings');
  }

  return data.data;
};

/**
 * Update branding settings
 */
export const updateBrandingSettingsApi = async (brandingData) => {
  const response = await fetch(`${backendurl}/api/admin/site-settings/branding`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(brandingData),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to update branding settings');
  }

  return data.data;
};

/**
 * Upload a site asset image
 */
export const uploadSiteAssetApi = async (file, assetType) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('assetType', assetType); // 'hero', 'gallery', 'logo'

  const response = await fetch(`${backendurl}/api/admin/site-settings/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(response.ok ? 'Invalid response from server' : `Upload failed (${response.status})`);
  }

  if (!data.success) {
    throw new Error(data.message || 'Failed to upload image');
  }

  return data.data;
};

/**
 * Delete a site asset image
 */
export const deleteSiteAssetApi = async (publicId) => {
  const encodedPublicId = encodeURIComponent(publicId);
  
  const response = await fetch(`${backendurl}/api/admin/site-settings/asset/${encodedPublicId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to delete image');
  }

  return data.data;
};

/**
 * Fetch public site settings (for frontend components)
 * Uses no-store so gallery/hero/logo updates show immediately after admin saves.
 */
export const fetchPublicSiteSettingsApi = async () => {
  const response = await fetch(`${backendurl}/api/site-settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // avoid stale gallery/hero/logo after admin updates
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch site settings');
  }

  return data.data;
};
