'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UseNavigationLoadingProps {
  loadingDelay?: number;
  minimumLoadingTime?: number;
}

export function useNavigationLoading({ 
  loadingDelay = 0, // No delay for immediate feedback
  minimumLoadingTime = 2000 // Longer time to ensure it shows during actual page load
}: UseNavigationLoadingProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading ZeniX Experience...');
  const router = useRouter();

  const getLoadingTextForRoute = (url: string): string => {
    if (url.includes('/movies')) return 'Loading Cinema Experience...';
    if (url.includes('/tv-shows')) return 'Loading TV Universe...';
    if (url.includes('/myspace')) return 'Loading Your Personal Space...';
    if (url.includes('/search')) return 'Preparing Search Results...';
    if (url.includes('/profile')) return 'Loading Profile Settings...';
    if (url.includes('/trending')) return 'Loading Trending Content...';
    if (url.includes('/genres')) return 'Loading Genre Collections...';
    if (url.includes('/login')) return 'Accessing ZeniX Portal...';
    if (url.includes('/register')) return 'Creating Your ZeniX Account...';
    return 'Loading ZeniX Experience...';
  };

  const navigate = async (url: string, customText?: string) => {
    try {
      // Immediately show loading state
      setIsLoading(true);
      setLoadingText(customText || getLoadingTextForRoute(url));
      
      // Start the navigation
      router.push(url);
      
      // Keep loader visible for minimum time to handle actual page load
      await new Promise(resolve => setTimeout(resolve, minimumLoadingTime));

    } catch (error) {
      console.error('Navigation error:', error);
      // Keep minimum loading time even on error
      await new Promise(resolve => setTimeout(resolve, minimumLoadingTime));
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-hide loader when component unmounts (page actually loads)
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  return {
    isLoading,
    loadingText,
    navigate
  };
}

export default useNavigationLoading;
