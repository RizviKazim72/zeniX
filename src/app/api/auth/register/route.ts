/**
 * Authentication Routes
 * POST /api/auth/register - Register new user
 */

import { NextRequest } from 'next/server';
import { registerUser } from '@/controllers/authController';

export async function POST(request: NextRequest) {
  return await registerUser(request);
}
