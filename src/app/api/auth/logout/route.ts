/**
 * Logout Route
 * POST /api/auth/logout - Logout user
 */

import { logoutUser } from '@/controllers/authController';

export async function POST() {
  return await logoutUser();
}
