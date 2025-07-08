/**
 * User Controller - Profile and media management endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import User from '../models/User';
import { getUserFromToken } from '../middleware/auth';
import { 
  validateRequest, 
  UpdateProfileSchema, 
  ChangePasswordSchema,
  MediaActionSchema,
  WatchProgressSchema,
  sanitizeInput,
  ValidationError 
} from '../middleware/validation';

interface MediaItem {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  addedAt: Date;
  watchedAt?: Date;
  progress?: number;
  season?: number;
  episode?: number;
}

export async function getUserProfile(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: user.getPublicProfile(),
      },
    });

  } catch (error: unknown) {
    console.error('Get user profile error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get user profile',
    }, { status: 500 });
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    // Validate request data
    const validatedData = await validateRequest(request, UpdateProfileSchema);
    const sanitizedData = sanitizeInput(validatedData);
    
    console.log('Raw validated data:', validatedData);
    console.log('Sanitized data:', sanitizedData);

    // Convert dateOfBirth string to Date object if provided
    if (sanitizedData.dateOfBirth && typeof sanitizedData.dateOfBirth === 'string') {
      try {
        sanitizedData.dateOfBirth = new Date(sanitizedData.dateOfBirth);
        console.log('Converted dateOfBirth:', sanitizedData.dateOfBirth);
      } catch (error) {
        console.error('Date conversion error:', error);
        delete sanitizedData.dateOfBirth; // Remove invalid date
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: sanitizedData },
      { new: true, runValidators: true }
    );
    
    console.log('Updated user dateOfBirth:', updatedUser?.dateOfBirth);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.getPublicProfile(),
      },
    });

  } catch (error: unknown) {
    console.error('Update profile error:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update profile',
    }, { status: 500 });
  }
}

/**
 * Change password
 */
export async function changePassword(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    // Validate request data
    const validatedData = await validateRequest(request, ChangePasswordSchema);
    const { currentPassword, newPassword } = sanitizeInput(validatedData);

    // Get user with password
    const userWithPassword = await User.findById(user._id).select('+password');
    
    // Verify current password
    const isCurrentPasswordValid = await userWithPassword.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Current password is incorrect',
      }, { status: 400 });
    }

    // Update password
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });

  } catch (error: unknown) {
    console.error('Change password error:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to change password',
    }, { status: 500 });
  }
}

/**
 * Add to watchlist
 */
export async function addToWatchlist(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    // Validate request data
    const validatedData = await validateRequest(request, MediaActionSchema);
    const { mediaId, mediaType, title, posterPath } = sanitizeInput(validatedData);

    // Check if already in watchlist
    const isAlreadyInWatchlist = user.watchlist.some(
      (item: MediaItem) => item.mediaId === mediaId && item.mediaType === mediaType
    );

    if (isAlreadyInWatchlist) {
      return NextResponse.json({
        success: false,
        message: 'Item already in watchlist',
      }, { status: 400 });
    }

    // Add to watchlist
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          watchlist: {
            mediaId,
            mediaType,
            title,
            posterPath,
            addedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Added to watchlist successfully',
      data: {
        watchlist: updatedUser.watchlist,
      },
    });

  } catch (error: unknown) {
    console.error('Add to watchlist error:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to add to watchlist',
    }, { status: 500 });
  }
}

/**
 * Remove from watchlist
 */
export async function removeFromWatchlist(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    // Get mediaId and mediaType from URL or body
    const { searchParams } = new URL(request.url);
    const mediaId = parseInt(searchParams.get('mediaId') || '0');
    const mediaType = searchParams.get('mediaType');

    if (!mediaId || !mediaType) {
      return NextResponse.json({
        success: false,
        message: 'Media ID and media type are required',
      }, { status: 400 });
    }

    // Remove from watchlist
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $pull: {
          watchlist: { mediaId, mediaType },
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Removed from watchlist successfully',
      data: {
        watchlist: updatedUser.watchlist,
      },
    });

  } catch (error: unknown) {
    console.error('Remove from watchlist error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to remove from watchlist',
    }, { status: 500 });
  }
}

/**
 * Get user watchlist
 */
export async function getUserWatchlist(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get user with watchlist
    const userWithWatchlist = await User.findById(user._id);
    const watchlist = userWithWatchlist.watchlist
      .sort((a: MediaItem, b: MediaItem) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: {
        watchlist,
        totalItems: userWithWatchlist.watchlist.length,
        currentPage: page,
        totalPages: Math.ceil(userWithWatchlist.watchlist.length / limit),
      },
    });

  } catch (error: unknown) {
    console.error('Get watchlist error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get watchlist',
    }, { status: 500 });
  }
}

/**
 * Add to favorites
 */
export async function addToFavorites(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    // Validate request data
    const validatedData = await validateRequest(request, MediaActionSchema);
    const { mediaId, mediaType, title, posterPath } = sanitizeInput(validatedData);

    // Check if already in favorites
    const isAlreadyInFavorites = user.favorites.some(
      (item: MediaItem) => item.mediaId === mediaId && item.mediaType === mediaType
    );

    if (isAlreadyInFavorites) {
      return NextResponse.json({
        success: false,
        message: 'Item already in favorites',
      }, { status: 400 });
    }

    // Add to favorites
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          favorites: {
            mediaId,
            mediaType,
            title,
            posterPath,
            addedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Added to favorites successfully',
      data: {
        favorites: updatedUser.favorites,
      },
    });

  } catch (error: unknown) {
    console.error('Add to favorites error:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to add to favorites',
    }, { status: 500 });
  }
}

/**
 * Remove from favorites
 */
export async function removeFromFavorites(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    // Get mediaId and mediaType from URL
    const { searchParams } = new URL(request.url);
    const mediaId = parseInt(searchParams.get('mediaId') || '0');
    const mediaType = searchParams.get('mediaType');

    if (!mediaId || !mediaType) {
      return NextResponse.json({
        success: false,
        message: 'Media ID and media type are required',
      }, { status: 400 });
    }

    // Remove from favorites
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $pull: {
          favorites: { mediaId, mediaType },
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites successfully',
      data: {
        favorites: updatedUser.favorites,
      },
    });

  } catch (error: unknown) {
    console.error('Remove from favorites error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to remove from favorites',
    }, { status: 500 });
  }
}

/**
 * Get user favorites
 */
export async function getUserFavorites(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get user with favorites
    const userWithFavorites = await User.findById(user._id);
    const favorites = userWithFavorites.favorites
      .sort((a: MediaItem, b: MediaItem) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: {
        favorites,
        totalItems: userWithFavorites.favorites.length,
        currentPage: page,
        totalPages: Math.ceil(userWithFavorites.favorites.length / limit),
      },
    });

  } catch (error: unknown) {
    console.error('Get favorites error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get favorites',
    }, { status: 500 });
  }
}

/**
 * Add recent watch
 */
export async function addRecentWatch(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    // Validate request data
    const validatedData = await validateRequest(request, WatchProgressSchema);
    const { mediaId, mediaType, title, posterPath, progress, season, episode } = sanitizeInput(validatedData);

    // Remove existing entry for same media
    await User.findByIdAndUpdate(user._id, {
      $pull: {
        recentWatches: { mediaId, mediaType },
      },
    });

    // Add to recent watches (at the beginning)
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          recentWatches: {
            $each: [{
              mediaId,
              mediaType,
              title,
              posterPath,
              progress: progress || 0,
              season,
              episode,
              watchedAt: new Date(),
            }],
            $position: 0,
            $slice: 50, // Keep only last 50 recent watches
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Recent watch updated successfully',
      data: {
        recentWatches: updatedUser.recentWatches,
      },
    });

  } catch (error: unknown) {
    console.error('Add recent watch error:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update recent watch',
    }, { status: 500 });
  }
}

/**
 * Get recent watches
 */
export async function getRecentWatches(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get user with recent watches
    const userWithRecentWatches = await User.findById(user._id);
    const recentWatches = userWithRecentWatches.recentWatches
      .sort((a: MediaItem, b: MediaItem) => {
        const aTime = a.watchedAt ? new Date(a.watchedAt).getTime() : 0;
        const bTime = b.watchedAt ? new Date(b.watchedAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        recentWatches,
        totalItems: userWithRecentWatches.recentWatches.length,
      },
    });

  } catch (error: unknown) {
    console.error('Get recent watches error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get recent watches',
    }, { status: 500 });
  }
}

/**
 * Clear all recent watches
 */
export async function clearRecentWatches(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    // Clear all recent watches
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          recentWatches: [],
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Recent watches cleared successfully',
      data: {
        recentWatches: updatedUser.recentWatches,
      },
    });

  } catch (error: unknown) {
    console.error('Clear recent watches error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to clear recent watches',
    }, { status: 500 });
  }
}
