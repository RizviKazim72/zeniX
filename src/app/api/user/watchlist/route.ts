/**
 * User Watchlist Routes
 * GET /api/user/watchlist - Get user watchlist
 * POST /api/user/watchlist - Add to watchlist
 * DELETE /api/user/watchlist - Remove from watchlist
 */

import { NextRequest } from 'next/server';
import { verifyToken } from '@/middleware/auth';
import { 
  getUserWatchlist, 
  addToWatchlist, 
  removeFromWatchlist 
} from '@/controllers/userController';

export async function GET(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await getUserWatchlist(request);
}

export async function POST(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await addToWatchlist(request);
}

export async function DELETE(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await removeFromWatchlist(request);
}
