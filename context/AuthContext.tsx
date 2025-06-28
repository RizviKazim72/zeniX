/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types
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
  favorites?: any[];
  watchlist?: any[];
  recentWatches?: any[];
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  fullName: string;
}

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

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage?: File | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
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

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  // Register function
  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      // Create FormData to handle file upload
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
        body: formData, // Send FormData instead of JSON
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

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user state even if API call fails
      setUser(null);
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
