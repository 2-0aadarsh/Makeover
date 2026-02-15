import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: function() {
        // Phone number is required for all users
        // But we allow temporary null during Google OAuth signup
        // It will be collected before completing login
        return !this.googleId; // Required for regular signup, optional during Google OAuth creation
      },
      unique: true,
      sparse: true, // Allows multiple null/undefined values
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },
    
    password: {
      type: String,
      required: function() {
        // Password is required only for regular signup, not for Google OAuth
        return !this.googleId;
      },
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Prevent password from being returned by default
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null/undefined values
    },
    passwordChangedAt: {
      type: Date,
    },


    role: {
      type: String,
      enum: ["user", "admin"], // only allow these values
      default: "user", // every new user defaults to "user"
    },

    isVerfied: {
      type: Boolean,
      default: function() {
        // Google OAuth users are automatically verified
        return !!this.googleId;
      },
    },
    // Admin management fields
    isActive: {
      type: Boolean,
      default: true, // Default to active for all users
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Only set when admin creates another admin
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    // Admin onboarding token fields
    onboardingToken: {
      type: String,
      default: null,
      select: false, // Don't return token by default
    },
    onboardingTokenExpiresAt: {
      type: Date,
      default: null,
    },
    onboardingTokenUsed: {
      type: Boolean,
      default: false,
    },
    onboardingTokenInvalidated: {
      type: Boolean,
      default: false,
    },
    onboardingTokenCreatedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  // Skip password hashing if password is undefined/null (Google OAuth users)
  if (!this.isModified("password") || !this.password) return next();
  
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  
  // IMPORTANT: mark when password was changed
  this.passwordChangedAt = Date.now();
  
  next();
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Model export (after all schema definitions)
export const User = mongoose.model("User", userSchema);
