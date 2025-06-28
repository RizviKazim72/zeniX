/**
 * User Favorites Routes
 * GET /api/user/favorites - Get user favorites
 * POST /api/user/favorites - Add to favorites
 * DELETE /api/user/favorites - Remove from favorites
 */

import { NextRequest } from 'next/server';
import { verifyToken } from '../../middleware/auth';
import { 
  getUserFavorites, 
  addToFavorites, 
  removeFromFavorites 
} from '../../controllers/userController';

export async function GET(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await getUserFavorites(request);
}

export async function POST(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await addToFavorites(request);
}

export async function DELETE(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await removeFromFavorites(request);
}
