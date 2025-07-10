/**
 * 🔐 Authentication Context
 * App wide authentication state aur methods provide karta hai
 * JWT tokens, user data, login/logout sab manage karta hai
 */

"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Movie, TVShow } from '@/types/tmdb';

// 📱 User media item interface
export interface UserMediaItem {
  id: number;
  mediaId?: number; // Backward compatibility
  type: 'movie' | 'tv';
  mediaType?: 'movie' | 'tv'; // Backward compatibility  
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  progress?: number; // Viewing progress percentage
  episodeNumber?: number; // For TV shows
  seasonNumber?: number; // For TV shows
  genres?: string[];
  addedAt?: string;
  watchedAt?: string;
  rating?: number;
}

// 👤 User interface - complete user profile
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  country?: string;
  preferences: {
    favoriteGenres: string[];
    preferredLanguage: string;
    autoplay: boolean;
    adultContent: boolean;
  };
  subscription: {
    type: 'free' | 'premium' | 'family';
    startDate?: string;
    endDate?: string;
    isActive: boolean;
  };
  favorites?: UserMediaItem[];
  watchlist?: UserMediaItem[];
  recentWatches?: UserMediaItem[];
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  fullName: string;
}

// 🔧 Auth context methods
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
}

// 📝 Registration data interface
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage?: File | null;
}

// Auth context create karte hain
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🏗️ Auth Provider Component - wrapper for whole app
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Component mount pe auth check karte hain
  useEffect(() => {
    checkAuth();
  }, []);

  // 🔍 Authentication status check karta hai
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Cookies include karte hain
      });

      const data = await response.json();

      if (data.success && data.data.user) {
        setUser(data.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Login function - user ko authenticate karta hai
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // ✍️ Registration function - naye user ko register karta hai
  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      // FormData use karte hain file upload ke liye
      const formData = new FormData();
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      
      if (userData.profileImage) {
        formData.append('profileImage', userData.profileImage);
      }
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        body: formData, // JSON nahi, FormData send kar rahe hain
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout function - user ko safely logout karta hai
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null); // API fail ho jaye toh bhi local state clear kar dete hain
    }
  };

  // 👤 Profile update function
  const updateProfile = async (userData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, message: 'Profile update failed. Please try again.' };
    }
  };

  // Context value object - sab methods aur state export karte hain
  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
    isAuthenticated: !!user, // Simple boolean conversion
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 🪝 Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
