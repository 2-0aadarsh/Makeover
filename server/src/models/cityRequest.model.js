import mongoose from 'mongoose';

const cityRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    requestedCity: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
      index: true,
    },

    requestedState: {
      type: String,
      trim: true,
      default: null,
    },

    userDetails: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    status: {
      type: String,
      enum: ['pending', 'reviewed', 'planned', 'added', 'dismissed'],
      default: 'pending',
      index: true,
    },

    source: {
      type: String,
      enum: ['footer_modal', 'contact_page'],
      default: 'footer_modal',
    },

    adminNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    metadata: {
      ipAddress: { type: String, default: null },
      userAgent: { type: String, default: null },
    },
  },
  { timestamps: true }
);

cityRequestSchema.index({ createdAt: -1 });
cityRequestSchema.index({ requestedCity: 1 });

cityRequestSchema.pre('validate', async function (next) {
  if (this.isNew && !this.requestNumber) {
    try {
      const Model = this.constructor;
      const last = await Model.findOne({}, { requestNumber: 1 }).sort({ createdAt: -1 }).lean();
      let num = 1;
      if (last?.requestNumber) {
        const n = parseInt(last.requestNumber.replace('CReq', ''), 10);
        if (!isNaN(n) && n > 0) num = n + 1;
      }
      this.requestNumber = `CReq${String(num).padStart(6, '0')}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const CityRequest = mongoose.model('CityRequest', cityRequestSchema);
export default CityRequest;
