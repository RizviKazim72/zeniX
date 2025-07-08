import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/connectDB';
import User from '@/app/api/models/User';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email format using zod
    const emailSchema = z.string().email();
    const validatedEmail = emailSchema.safeParse(email);
    
    if (!validatedEmail.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { 
          success: true, 
          message: 'If an account with this email exists, you will receive a password reset link.' 
        },
        { status: 200 }
      );
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // In a real app, you would send an email here
    // For now, we'll return the token (in production, remove this)
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset URL: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`);

    return NextResponse.json(
      { 
        success: true, 
        message: 'If an account with this email exists, you will receive a password reset link.',
        // Remove this in production - only for development
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
