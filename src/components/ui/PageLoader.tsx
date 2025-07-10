'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ZeniXLoader from './ZeniXLoader';

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading ZeniX Experience...');
  const pathname = usePathname();

  // Get loading text based on route
  const getLoadingTextForRoute = (path: string) => {
    if (path.includes('/movies')) return 'Loading Cinema Experience...';
    if (path.includes('/tv-shows')) return 'Loading TV Universe...';
    if (path.includes('/myspace')) return 'Loading Your Personal Space...';
    if (path.includes('/search')) return 'Preparing Search Results...';
    if (path.includes('/profile')) return 'Loading Profile Settings...';
    if (path.includes('/trending')) return 'Loading Trending Content...';
    if (path.includes('/genres')) return 'Loading Genre Collections...';
    return 'Loading ZeniX Experience...';
  };

  useEffect(() => {
    // Show loader when route changes
    setIsLoading(true);
    setLoadingText(getLoadingTextForRoute(pathname));

    // Hide loader after delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [pathname]);

  return <ZeniXLoader isLoading={isLoading} loadingText={loadingText} variant="navigation" />;
};

export default PageLoader;
