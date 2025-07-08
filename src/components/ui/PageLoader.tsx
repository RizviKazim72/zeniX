'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ZeniXLoader from './ZeniXLoader';

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading ZeniX Experience...');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get loading text based on route
  const getLoadingTextForRoute = (path: string) => {
    if (path.includes('/movies')) return 'Loading Cinema Experience...';
    if (path.includes('/tv-shows')) return 'Loading TV Universe...';
    if (path.includes('/myspace')) return 'Loading Your Personal Space...';
    if (path.includes('/search')) return 'Preparing Search Results...';
    if (path.includes('/profile')) return 'Loading Profile Settings...';
    if (path.includes('/trending')) return 'Loading Trending Content...';
    if (path.includes('/genres')) return 'Loading Genre Collections...';
    if (path.includes('/login')) return 'Accessing ZeniX Portal...';
    if (path.includes('/register')) return 'Creating Your ZeniX Account...';
    return 'Loading ZeniX Experience...';
  };

  useEffect(() => {
    // Show loader when route changes
    setIsLoading(true);
    setLoadingText(getLoadingTextForRoute(pathname));
    
    // Hide loader after content has loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Longer duration to ensure page loads

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  // Hide loader when page is fully loaded
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 300);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <ZeniXLoader
      isLoading={isLoading}
      loadingText={loadingText}
      variant="navigation"
    />
  );
};

export default PageLoader;
