/**
 * TypeScript Configuration for Production Build
 * Common type definitions to fix any types
 */

import { NextRequest, NextResponse } from 'next/server';

// API Handler Types
export type ApiHandler = (
  request: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>;

export type ErrorResponse = {
  error: string;
  message?: string;
  details?: unknown;
};

export type SuccessResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
};

// Database Types
export interface UserDocument {
  _id: string;
  email: string;
  fullName: string;
  password: string;
  country?: string;
  bio?: string;
  profileImage?: string;
  favorites: Array<{
    mediaId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath?: string;
    addedAt: Date;
  }>;
  watchlist: Array<{
    mediaId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath?: string;
    addedAt: Date;
  }>;
  recentWatches: Array<{
    mediaId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath?: string;
    watchedAt: Date;
    progress?: number;
    seasonNumber?: number;
    episodeNumber?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Media Types
export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  country?: string;
  bio?: string;
  profileImage?: string;
  createdAt: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
