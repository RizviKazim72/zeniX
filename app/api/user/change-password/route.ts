/**
 * Change Password Route
 * POST /api/user/change-password - Change user password
 */

import { NextRequest } from 'next/server';
import { verifyToken } from '../../middleware/auth';
import { changePassword } from '../../controllers/userController';

export async function POST(request: NextRequest) {
  // Verify authentication
  const authResult = await verifyToken(request);
  if (authResult) return authResult;
  
  return await changePassword(request);
}
