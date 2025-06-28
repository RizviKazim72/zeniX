/**
 * Authentication Routes
 * POST /api/auth/logout - Logout user
 * GET /api/auth/me - Get current user
 * POST /api/auth/refresh - Refresh token
 */

import { NextRequest } from 'next/server';
import { 
  logoutUser, 
  getCurrentUser, 
  refreshToken 
} from '../../controllers/authController';

export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);
  
  if (pathname.endsWith('/logout')) {
    return await logoutUser(request);
  }
  
  if (pathname.endsWith('/refresh')) {
    return await refreshToken(request);
  }
  
  return new Response('Method not allowed', { status: 405 });
}

export async function GET(request: NextRequest) {
  return await getCurrentUser(request);
}
