/**
 * Authentication Controller
 * Handles user registration, login, logout, and authentication logic
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import User from '../models/User';
import { 
  generateToken, 
  setAuthCookie, 
  clearAuthCookie,
  getUserFromToken 
} from '../middleware/auth';
import { 
  validateRequest, 
  RegisterSchema, 
  LoginSchema, 
  checkRateLimit, 
  sanitizeInput,
  ValidationError 
} from '../middleware/validation';

/**
 * Register new user
 */
export async function registerUser(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = checkRateLimit(`register_${clientIP}`, 3, 15 * 60 * 1000);
    if (rateLimitResult) return rateLimitResult;

    // Connect to database
    await connectDB();

    // Validate request data
    const validatedData = await validateRequest(request, RegisterSchema);
    const { firstName, lastName, email, password } = sanitizeInput(validatedData);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists',
      }, { status: 400 });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password, // Will be hashed by the pre-save middleware
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        token,
      },
    }, { status: 201 });

    // Set auth cookie
    setAuthCookie(response, token);

    return response;

  } catch (error: unknown) {
    console.error('Registration error:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        errors: error.errors,
      }, { status: 400 });
    }

    // Check for MongoDB duplicate key error
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists',
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Registration failed. Please try again.',
    }, { status: 500 });
  }
}

/**
 * Login user
 */
export async function loginUser(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = checkRateLimit(`login_${clientIP}`, 5, 15 * 60 * 1000);
    if (rateLimitResult) return rateLimitResult;

    // Connect to database
    await connectDB();

    // Validate request data
    const validatedData = await validateRequest(request, LoginSchema);
    const { email, password } = sanitizeInput(validatedData);

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !user.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password',
      }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password',
      }, { status: 401 });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token,
      },
    });

    // Set auth cookie
    setAuthCookie(response, token);

    return response;

  } catch (error: unknown) {
    console.error('Login error:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Login failed. Please try again.',
    }, { status: 500 });
  }
}

/**
 * Logout user
 */
export async function logoutUser() {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    // Clear auth cookie
    clearAuthCookie(response);

    return response;

  } catch (error: unknown) {
    console.error('Logout error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Logout failed',
    }, { status: 500 });
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(request: NextRequest) {
  try {
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
    console.error('Get current user error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get user profile',
    }, { status: 500 });
  }
}

/**
 * Refresh token
 */
export async function refreshToken(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token',
      }, { status: 401 });
    }

    // Generate new token
    const token = generateToken(user._id.toString(), user.email);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: user.getPublicProfile(),
        token,
      },
    });

    // Set new auth cookie
    setAuthCookie(response, token);

    return response;

  } catch (error: unknown) {
    console.error('Refresh token error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to refresh token',
    }, { status: 500 });
  }
}

/**
 * Verify email (placeholder for future email verification)
 */
export async function verifyEmail() {
  try {
    // TODO: Implement email verification logic
    return NextResponse.json({
      success: true,
      message: 'Email verification feature coming soon',
    });

  } catch (error: unknown) {
    console.error('Email verification error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Email verification failed',
    }, { status: 500 });
  }
}

/**
 * Request password reset (placeholder for future password reset)
 */
export async function requestPasswordReset() {
  try {
    // TODO: Implement password reset logic
    return NextResponse.json({
      success: true,
      message: 'Password reset feature coming soon',
    });

  } catch (error: unknown) {
    console.error('Password reset request error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Password reset request failed',
    }, { status: 500 });
  }
}
