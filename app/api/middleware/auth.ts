/**
 * Authentication Middleware
 * JWT token verification and user authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/connectDB';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends NextRequest {
  user?: any;
}

/**
 * Middleware to verify JWT token from cookies or Authorization header
 */
export async function verifyToken(request: NextRequest) {
  try {
    // Get token from cookies or Authorization header
    let token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Access denied. No token provided.' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Connect to database
    await connectDB();
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Invalid token or user not found.' },
        { status: 401 }
      );
    }

    // Add user to request object
    (request as any).user = user;
    
    return null; // Success, continue
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { success: false, message: 'Invalid token.' },
        { status: 401 }
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { success: false, message: 'Token expired.' },
        { status: 401 }
      );
    }

    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed.' },
      { status: 500 }
    );
  }
}

/**
 * Get user from token without throwing errors
 */
export async function getUserFromToken(request: NextRequest) {
  try {
    let token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    await connectDB();
    
    const user = await User.findById(decoded.id).select('-password');
    return user?.isActive ? user : null;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user has premium subscription
 */
export function requirePremium(user: any) {
  if (!user.subscription.isActive || user.subscription.type === 'free') {
    return NextResponse.json(
      { success: false, message: 'Premium subscription required.' },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Generate JWT token
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { id: userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Set auth cookie
 */
export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(response: NextResponse) {
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
