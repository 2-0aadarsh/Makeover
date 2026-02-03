import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    // Version for tracking changes and potential rollback
    version: {
      type: Number,
      default: 1,
    },

    // Hero Section Settings
    hero: {
      mainImage: {
        url: {
          type: String,
          default: '',
        },
        publicId: {
          type: String,
          default: '',
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
      categoryIcons: [
        {
          categoryName: {
            type: String,
            required: true,
          },
          iconUrl: {
            type: String,
            default: '',
          },
          publicId: {
            type: String,
            default: '',
          },
          order: {
            type: Number,
            required: true,
          },
        },
      ],
    },

    // Gallery Section Settings
    gallery: {
      slides: [
        {
          title: {
            type: String,
            required: true,
            trim: true,
          },
          description: {
            type: String,
            default: '',
            trim: true,
          },
          imageUrl: {
            type: String,
            default: '',
          },
          publicId: {
            type: String,
            default: '',
          },
          active: {
            type: Boolean,
            default: true,
          },
          order: {
            type: Number,
            required: true,
          },
        },
      ],
    },

    // Branding Settings
    branding: {
      primaryLogo: {
        url: {
          type: String,
          default: '',
        },
        publicId: {
          type: String,
          default: '',
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
      adminLogo: {
        url: {
          type: String,
          default: '',
        },
        publicId: {
          type: String,
          default: '',
        },
        usePrimary: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Metadata
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists (singleton pattern)
siteSettingsSchema.index({ _id: 1 }, { unique: true });

// Static method to get or create settings
siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create default settings with hardcoded values as fallback
    settings = await this.create({
      hero: {
        mainImage: {
          url: '',
          publicId: '',
        },
        categoryIcons: [
          { categoryName: 'Professional Makeup', iconUrl: '', publicId: '', order: 1 },
          { categoryName: 'Cleanup & Facial', iconUrl: '', publicId: '', order: 2 },
          { categoryName: 'Professional Mehendi', iconUrl: '', publicId: '', order: 3 },
          { categoryName: 'Waxing', iconUrl: '', publicId: '', order: 4 },
          { categoryName: 'Mani/Pedi & Massage', iconUrl: '', publicId: '', order: 5 },
          { categoryName: 'Detan & Bleach', iconUrl: '', publicId: '', order: 6 },
        ],
      },
      gallery: {
        slides: [
          {
            title: 'Quick Grooming',
            description: 'Quick grooming to enhance your look in minutes.',
            imageUrl: '',
            publicId: '',
            active: true,
            order: 1,
          },
          {
            title: 'Bridal Makeup',
            description: 'Elegant bridal makeup for your special day.',
            imageUrl: '',
            publicId: '',
            active: true,
            order: 2,
          },
          {
            title: 'Mehendi Stories',
            description: 'Beautiful mehendi designs to complete your look.',
            imageUrl: '',
            publicId: '',
            active: true,
            order: 3,
          },
        ],
      },
      branding: {
        primaryLogo: {
          url: '',
          publicId: '',
        },
        adminLogo: {
          url: '',
          publicId: '',
          usePrimary: true,
        },
      },
    });
  }
  
  return settings;
};

// Static method to update settings
siteSettingsSchema.statics.updateSettings = async function (updates, userId) {
  const settings = await this.getSettings();

  // Merge updates into existing subdocuments so Mongoose persists correctly (avoid plain-object replace)
  if (updates.hero) {
    Object.assign(settings.hero, updates.hero);
    settings.markModified('hero');
  }
  if (updates.gallery) {
    Object.assign(settings.gallery, updates.gallery);
    settings.markModified('gallery');
  }
  if (updates.branding) {
    if (updates.branding.primaryLogo) {
      Object.assign(settings.branding.primaryLogo, updates.branding.primaryLogo);
    }
    if (updates.branding.adminLogo) {
      Object.assign(settings.branding.adminLogo, updates.branding.adminLogo);
    }
    settings.markModified('branding');
  }

  if (userId != null) {
    settings.lastUpdatedBy = userId;
  }
  settings.version += 1;

  await settings.save();
  return settings;
};

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
