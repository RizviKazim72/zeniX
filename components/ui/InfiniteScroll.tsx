'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { SkeletonGrid } from './Loading';

interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  loadMore: () => void;
  loading: boolean;
  threshold?: number;
  skeletonCount?: number;
}

export default function InfiniteScroll({
  children,
  hasMore,
  loadMore,
  loading,
  threshold = 200,
  skeletonCount = 6,
}: InfiniteScrollProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadMore();
    }
  }, [loading, hasMore, threshold, loadMore]);

  useEffect(() => {
    if (!isMounted) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, isMounted]);

  return (
    <div>
      {children}
      
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="flex items-center justify-center py-6 mb-6">
            <div className="flex items-center space-x-3 text-white">
              <Loader2 className="animate-spin text-netflix-red" size={24} />
              <span className="font-heading text-lg">Loading more content...</span>
            </div>
          </div>
          <SkeletonGrid count={skeletonCount} />
        </motion.div>
      )}
      
      {!hasMore && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-netflix-red mr-2" size={24} />
            <div className="section-divider w-32"></div>
            <Sparkles className="text-netflix-red ml-2" size={24} />
          </div>
          <p className="text-gray-400 font-heading text-lg">You've discovered everything!</p>
          <p className="text-gray-500 text-sm mt-2">No more content to load</p>
        </motion.div>
      )}
    </div>
  );
}
