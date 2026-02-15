import SiteSettings from '../../models/siteSettings.model.js';
import UploadFactory from '../../services/upload/uploadFactory.js';

/**
 * @route   GET /api/admin/site-settings
 * @desc    Get current site settings
 * @access  Admin only
 */
export const getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    
    return res.status(200).json({
      success: true,
      message: 'Site settings retrieved successfully',
      data: settings,
    });
  } catch (error) {
    console.error('❌ Error fetching site settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings',
      error: error.message,
    });
  }
};

/**
 * @route   PATCH /api/admin/site-settings/hero
 * @desc    Update hero section settings
 * @access  Admin only
 * Deletes previous hero image from S3/Cloudinary when replaced to avoid storage bloat.
 */
export const updateHeroSettings = async (req, res) => {
  try {
    const { mainImage, categoryIcons } = req.body;
    const userId = req.user?.id;

    const updates = { hero: {} };

    if (mainImage) {
      const current = await SiteSettings.getSettings();
      const oldPublicId = current?.hero?.mainImage?.publicId;
      const newPublicId = mainImage.publicId;

      if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
        try {
          const uploader = UploadFactory.getProvider();
          await uploader.delete(oldPublicId);
          console.log('✅ Old hero image deleted from storage:', oldPublicId);
        } catch (deleteErr) {
          console.warn('⚠️ Could not delete old hero image (continuing with update):', deleteErr.message);
        }
      }

      updates.hero.mainImage = {
        ...mainImage,
        updatedAt: new Date(),
        updatedBy: userId,
      };
    }

    if (categoryIcons) {
      updates.hero.categoryIcons = categoryIcons;
    }

    const settings = await SiteSettings.updateSettings(updates, userId);

    return res.status(200).json({
      success: true,
      message: 'Hero settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('❌ Error updating hero settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update hero settings',
      error: error.message,
    });
  }
};

/**
 * @route   PATCH /api/admin/site-settings/gallery
 * @desc    Update gallery section settings
 * @access  Admin only
 */
export const updateGallerySettings = async (req, res) => {
  try {
    const { slides } = req.body;
    const userId = req.user?.id;

    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({
        success: false,
        message: 'Slides array is required',
      });
    }

    const MAX_SLIDES = 10;
    if (slides.length > MAX_SLIDES) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_SLIDES} gallery slides allowed`,
      });
    }

    // Delete from S3/Cloudinary any image that is no longer in the new slides list.
    // This covers: (1) removed slides, (2) replaced images (old publicId dropped when new image uploaded).
    const newPublicIds = new Set(slides.map((s) => s.publicId).filter(Boolean));
    const current = await SiteSettings.getSettings();
    const oldSlides = current?.gallery?.slides || [];
    const publicIdsToDelete = oldSlides
      .map((s) => s.publicId)
      .filter((id) => id && !newPublicIds.has(id));

    if (publicIdsToDelete.length > 0) {
      const uploader = UploadFactory.getProvider();
      for (const publicId of publicIdsToDelete) {
        try {
          await uploader.delete(publicId);
          console.log('✅ Old gallery image deleted from storage:', publicId);
        } catch (deleteErr) {
          console.warn('⚠️ Could not delete old gallery image (continuing):', deleteErr.message);
        }
      }
    }

    const updates = {
      gallery: {
        slides: slides.map((slide, index) => ({
          title: slide.title,
          description: slide.description || '',
          imageUrl: slide.imageUrl || '',
          publicId: slide.publicId || '',
          active: slide.active !== undefined ? slide.active : true,
          order: slide.order !== undefined ? slide.order : index + 1,
        })),
      },
    };

    const settings = await SiteSettings.updateSettings(updates, userId);

    return res.status(200).json({
      success: true,
      message: 'Gallery settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('❌ Error updating gallery settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update gallery settings',
      error: error.message,
    });
  }
};

/**
 * @route   PATCH /api/admin/site-settings/branding
 * @desc    Update branding settings (logos)
 * @access  Admin only
 * Deletes previous logo from S3/Cloudinary when replaced to avoid storage bloat.
 */
export const updateBrandingSettings = async (req, res) => {
  try {
    const { primaryLogo, adminLogo } = req.body;
    const userId = req.user?.id;

    const updates = { branding: {} };

    if (primaryLogo) {
      const current = await SiteSettings.getSettings();
      const oldPublicId = current?.branding?.primaryLogo?.publicId;
      const newPublicId = primaryLogo.publicId;

      if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
        try {
          const uploader = UploadFactory.getProvider();
          await uploader.delete(oldPublicId);
          console.log('✅ Old primary logo deleted from storage:', oldPublicId);
        } catch (deleteErr) {
          console.warn('⚠️ Could not delete old primary logo (continuing with update):', deleteErr.message);
        }
      }

      updates.branding.primaryLogo = {
        url: primaryLogo.url,
        publicId: primaryLogo.publicId,
        updatedAt: new Date(),
      };
    }

    if (adminLogo) {
      updates.branding.adminLogo = {
        url: adminLogo.url || '',
        publicId: adminLogo.publicId || '',
        usePrimary: adminLogo.usePrimary !== undefined ? adminLogo.usePrimary : true,
      };
    }

    const settings = await SiteSettings.updateSettings(updates, userId);

    return res.status(200).json({
      success: true,
      message: 'Branding settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('❌ Error updating branding settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update branding settings',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/admin/site-settings/upload
 * @desc    Upload an image for site settings
 * @access  Admin only
 */
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25MB, must match server.js fileUpload limits

export const uploadSiteAsset = async (req, res) => {
  try {
    const { assetType } = req.body; // hero, gallery, logo

    // If client sent a large body, express-fileupload may not populate req.files (limit exceeded)
    const contentLength = parseInt(req.headers['content-length'], 10);
    if (!Number.isNaN(contentLength) && contentLength > MAX_UPLOAD_BYTES) {
      return res.status(413).json({
        success: false,
        message: 'File too large. Maximum size is 25MB.',
      });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Ensure the file is under 25MB and try again.',
      });
    }

    const file = req.files.image;
    const uploader = UploadFactory.getProvider();

    // Determine folder based on asset type
    let folder = 'site-settings';
    if (assetType === 'hero') folder = 'site-settings/hero';
    else if (assetType === 'gallery') folder = 'site-settings/gallery';
    else if (assetType === 'logo') folder = 'site-settings/branding';

    const uploadResult = await uploader.upload(file, folder);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        provider: uploadResult.provider,
      },
    });
  } catch (error) {
    console.error('❌ Error uploading site asset:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/admin/site-settings/asset/:publicId
 * @desc    Delete an image from site settings
 * @access  Admin only
 */
export const deleteSiteAsset = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    const decodedPublicId = decodeURIComponent(publicId);
    const uploader = UploadFactory.getProvider();

    await uploader.delete(decodedPublicId);

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        publicId: decodedPublicId,
      },
    });
  } catch (error) {
    console.error('❌ Error deleting site asset:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
};
