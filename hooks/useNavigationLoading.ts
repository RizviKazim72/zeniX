'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseNavigationLoadingProps {
  loadingDelay?: number;
  minimumLoadingTime?: number;
}

export function useNavigationLoading({ 
  loadingDelay = 200,
  minimumLoadingTime = 800 
}: UseNavigationLoadingProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading ZeniX Experience...');
  const router = useRouter();

  const navigate = async (url: string, customText?: string) => {
    const startTime = Date.now();
    
    // Set loading state with optional delay
    setTimeout(() => {
      setIsLoading(true);
      setLoadingText(customText || getLoadingTextForRoute(url));
    }, loadingDelay);

    try {
      // Simulate minimum loading time for smooth UX
      const [, ] = await Promise.all([
        new Promise(resolve => setTimeout(resolve, minimumLoadingTime)),
        router.push(url)
      ]);

      // Ensure minimum loading time has passed
      const elapsed = Date.now() - startTime;
      if (elapsed < minimumLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minimumLoadingTime - elapsed));
      }

    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return {
    isLoading,
    loadingText,
    navigate
  };
}

export default useNavigationLoading;
