'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UseNavigationLoadingProps {
  loadingDelay?: number;
  minimumLoadingTime?: number;
}

export function useNavigationLoading({ 
  loadingDelay = 0,
  minimumLoadingTime = 2000
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
    return 'Loading ZeniX Experience...';
  };

  const navigate = (url: string, customLoadingText?: string) => {
    setIsLoading(true);
    setLoadingText(customLoadingText || getLoadingTextForRoute(url));

    const startTime = Date.now();
    
    setTimeout(() => {
      router.push(url);
      
      // Ensure minimum loading time for consistent UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }, loadingDelay);
  };

  // Auto-hide loader when component unmounts
  useEffect(() => {
    return () => setIsLoading(false);
  }, []);

  return {
    isLoading,
    loadingText,
    navigate
  };
}

export default useNavigationLoading;
