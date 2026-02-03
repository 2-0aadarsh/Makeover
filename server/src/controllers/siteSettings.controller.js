import SiteSettings from '../models/siteSettings.model.js';

/**
 * @route   GET /api/site-settings
 * @desc    Get current site settings (public - for frontend)
 * @access  Public
 */
export const getPublicSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    // Convert to plain object so slide.active is a strict boolean (Mongoose subdocs can break === true)
    const plain = settings?.toObject ? settings.toObject() : settings;

    const heroMainUrl = plain.hero?.mainImage?.url ?? '';
    // Only include slides explicitly marked active (exclude inactive and legacy docs without the field)
    const gallerySlides = (plain.gallery?.slides || [])
      .filter((slide) => Boolean(slide.active) === true)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((slide) => ({
        title: slide.title || '',
        description: slide.description || '',
        imageUrl: slide.imageUrl || '',
        order: slide.order ?? 0,
      }));

    const publicSettings = {
      hero: {
        mainImage: heroMainUrl,
        categoryIcons: (plain.hero?.categoryIcons || []).map((icon) => ({
          categoryName: icon.categoryName,
          iconUrl: icon.iconUrl,
          order: icon.order,
        })),
      },
      gallery: {
        slides: gallerySlides,
      },
      branding: {
        primaryLogo: plain.branding?.primaryLogo?.url ?? '',
        adminLogo: plain.branding?.adminLogo?.usePrimary
          ? (plain.branding?.primaryLogo?.url ?? '')
          : (plain.branding?.adminLogo?.url ?? ''),
      },
    };

    // Avoid caching so gallery/hero/logo updates show immediately after admin saves
    res.set('Cache-Control', 'no-store, max-age=0');

    return res.status(200).json({
      success: true,
      data: publicSettings,
    });
  } catch (error) {
    console.error('❌ Error fetching public site settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings',
      error: error.message,
    });
  }
};
