/**
 * Authentication Routes
 * POST /api/auth/login - Login user
 */

import { NextRequest } from 'next/server';
import { loginUser } from '../../controllers/authController';

export async function POST(request: NextRequest) {
  return await loginUser(request);
}
