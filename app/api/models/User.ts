/**
 * User Model
 * Comprehensive user schema with authentication and profile features
 */

import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: Date;
  country?: string;
  preferences: {
    favoriteGenres: string[];
    preferredLanguage: string;
    autoplay: boolean;
    adultContent: boolean;
  };
  watchlist: Array<{
    mediaId: number;
    mediaType: 'movie' | 'tv';
    addedAt: Date;
    title: string;
    posterPath?: string;
  }>;
  favorites: Array<{
    mediaId: number;
    mediaType: 'movie' | 'tv';
    addedAt: Date;
    title: string;
    posterPath?: string;
  }>;
  recentWatches: Array<{
    mediaId: number;
    mediaType: 'movie' | 'tv';
    watchedAt: Date;
    title: string;
    posterPath?: string;
    progress?: number; // Percentage watched (0-100)
    season?: number;   // For TV shows
    episode?: number;  // For TV shows
  }>;
  ratings: Array<{
    mediaId: number;
    mediaType: 'movie' | 'tv';
    rating: number; // 1-10
    ratedAt: Date;
  }>;
  subscription: {
    type: 'free' | 'premium' | 'family';
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
  };
  emailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    dateOfBirth: {
      type: Date,
    },
    country: {
      type: String,
      maxlength: [100, 'Country name cannot exceed 100 characters'],
    },
    preferences: {
      favoriteGenres: {
        type: [String],
        default: [],
      },
      preferredLanguage: {
        type: String,
        default: 'en',
      },
      autoplay: {
        type: Boolean,
        default: true,
      },
      adultContent: {
        type: Boolean,
        default: false,
      },
    },
    watchlist: [
      {
        mediaId: { type: Number, required: true },
        mediaType: { type: String, enum: ['movie', 'tv'], required: true },
        addedAt: { type: Date, default: Date.now },
        title: { type: String, required: true },
        posterPath: { type: String },
      },
    ],
    favorites: [
      {
        mediaId: { type: Number, required: true },
        mediaType: { type: String, enum: ['movie', 'tv'], required: true },
        addedAt: { type: Date, default: Date.now },
        title: { type: String, required: true },
        posterPath: { type: String },
      },
    ],
    recentWatches: [
      {
        mediaId: { type: Number, required: true },
        mediaType: { type: String, enum: ['movie', 'tv'], required: true },
        watchedAt: { type: Date, default: Date.now },
        title: { type: String, required: true },
        posterPath: { type: String },
        progress: { type: Number, min: 0, max: 100, default: 0 },
        season: { type: Number },
        episode: { type: Number },
      },
    ],
    ratings: [
      {
        mediaId: { type: Number, required: true },
        mediaType: { type: String, enum: ['movie', 'tv'], required: true },
        rating: { type: Number, min: 1, max: 10, required: true },
        ratedAt: { type: Date, default: Date.now },
      },
    ],
    subscription: {
      type: {
        type: String,
        enum: ['free', 'premium', 'family'],
        default: 'free',
      },
      startDate: { type: Date },
      endDate: { type: Date },
      isActive: { type: Boolean, default: true },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ 'watchlist.mediaId': 1 });
UserSchema.index({ 'favorites.mediaId': 1 });
UserSchema.index({ 'recentWatches.watchedAt': -1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user's full name
UserSchema.methods.getFullName = function (): string {
  return `${this.firstName} ${this.lastName}`;
};

// Instance method to get public profile
UserSchema.methods.getPublicProfile = function () {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    avatar: this.avatar,
    bio: this.bio,
    country: this.country,
    preferences: this.preferences,
    subscription: this.subscription,
    emailVerified: this.emailVerified,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

// Static method to find user by email
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.emailVerificationToken;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpire;
    return ret;
  },
});

// Export the model
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
