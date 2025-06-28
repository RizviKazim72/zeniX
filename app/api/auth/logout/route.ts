/**
 * Logout Route
 * POST /api/auth/logout - Logout user
 */

import { NextRequest } from 'next/server';
import { logoutUser } from '../../controllers/authController';

export async function POST(request: NextRequest) {
  return await logoutUser(request);
}
