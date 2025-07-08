/**
 * User Recent Watches Routes
 * GET /api/user/recent-watches - Get recent watches
 * POST /api/user/recent-watches - Add recent watch
 * DELETE /api/user/recent-watches - Clear all recent watches
 */

import { NextRequest } from 'next/server';
import { verifyToken } from '@/middleware/auth';
import { 
  getRecentWatches, 
  addRecentWatch,
  clearRecentWatches
} from '@/controllers/userController';

export async function GET(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await getRecentWatches(request);
}

export async function POST(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await addRecentWatch(request);
}

export async function DELETE(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await clearRecentWatches(request);
}
