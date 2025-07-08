/**
 * User Profile Routes
 * GET /api/user/profile - Get user profile
 * PUT /api/user/profile - Update user profile
 */

import { NextRequest } from 'next/server';
import { verifyToken } from '@/middleware/auth';
import { getUserProfile, updateUserProfile } from '@/controllers/userController';

export async function GET(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await getUserProfile(request);
}

export async function PUT(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await updateUserProfile(request);
}
