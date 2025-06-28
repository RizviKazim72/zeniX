/**
 * Validation Middleware
 * Request validation utilities and schemas
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
export const RegisterSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

export const LoginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  
  password: z.string()
    .min(1, 'Password is required'),
});

export const UpdateProfileSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
    .optional(),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces')
    .optional(),
  
  bio: z.string()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  
  dateOfBirth: z.string()
    .optional()
    .or(z.literal(''))
    .refine((date) => !date || !isNaN(Date.parse(date)), 'Invalid date format'),
  
  country: z.string()
    .max(100, 'Country name cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  
  preferences: z.object({
    favoriteGenres: z.array(z.string()).optional(),
    preferredLanguage: z.string().optional(),
    autoplay: z.boolean().optional(),
    adultContent: z.boolean().optional(),
  }).optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  
  newPassword: z.string()
    .min(6, 'New password must be at least 6 characters')
    .max(128, 'New password cannot exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'New password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

export const MediaActionSchema = z.object({
  mediaId: z.number().positive('Media ID must be a positive number'),
  mediaType: z.enum(['movie', 'tv'], { 
    errorMap: () => ({ message: 'Media type must be either "movie" or "tv"' })
  }),
  title: z.string().min(1, 'Title is required'),
  posterPath: z.string().optional(),
});

export const RatingSchema = z.object({
  mediaId: z.number().positive('Media ID must be a positive number'),
  mediaType: z.enum(['movie', 'tv']),
  rating: z.number().min(1, 'Rating must be at least 1').max(10, 'Rating cannot exceed 10'),
});

export const WatchProgressSchema = z.object({
  mediaId: z.number().positive('Media ID must be a positive number'),
  mediaType: z.enum(['movie', 'tv']),
  title: z.string().min(1, 'Title is required'),
  posterPath: z.string().optional(),
  progress: z.number().min(0, 'Progress cannot be negative').max(100, 'Progress cannot exceed 100').optional(),
  season: z.number().positive('Season must be a positive number').optional(),
  episode: z.number().positive('Episode must be a positive number').optional(),
});

/**
 * Generic validation middleware
 */
export function validate(schema: z.ZodSchema) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      return validatedData;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        return NextResponse.json({
          success: false,
          message: 'Validation failed',
          errors,
        }, { status: 400 });
      }
      
      return NextResponse.json({
        success: false,
        message: 'Invalid request data',
      }, { status: 400 });
    }
  };
}

/**
 * Validate request body against schema
 */
export async function validateRequest(request: NextRequest, schema: z.ZodSchema) {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      throw new ValidationError('Validation failed', errors);
    }
    
    throw new Error('Invalid request data');
  }
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  public errors: Array<{ field: string; message: string }>;
  
  constructor(message: string, errors: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Rate limiting validation
 */
export const rateLimitMap = new Map();

export function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }
  
  const requests = rateLimitMap.get(identifier);
  
  // Remove old requests outside the window
  const validRequests = requests.filter((timestamp: number) => timestamp > windowStart);
  
  if (validRequests.length >= maxRequests) {
    return NextResponse.json({
      success: false,
      message: 'Too many requests. Please try again later.',
    }, { status: 429 });
  }
  
  // Add current request
  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
  
  return null; // Success
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove < and > characters
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}
