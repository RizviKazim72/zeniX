'use client';

import { useState, useEffect } from 'react';
import { mediaService, MediaItem, ApiResponse } from '@/services/mediaService';
import { useToast } from '@/context/ToastContext';

type MediaListType = 'favorites' | 'watchlist' | 'recent';

/**
 * 🎬 useMediaList Hook 
 * User ke media lists manage karta hai (favorites, watchlist, recent)
 * CRUD operations provide karta hai saath toast notifications ke
 */
export function useMediaList(type: MediaListType) {
  // State management
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  // 📡 API se data fetch karta hai
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Type ke basis pe appropriate service call
      const serviceMap = {
        favorites: () => mediaService.getFavorites(),
        watchlist: () => mediaService.getWatchlist(), 
        recent: () => mediaService.getRecentWatches()
      };
      
      const response = await serviceMap[type]();

      if (response.success && response.data) {
        // Nested response structure se data extract karta hai
        const dataMap = {
          favorites: (data: any) => data.favorites || [],
          watchlist: (data: any) => data.watchlist || [],
          recent: (data: any) => data.recentWatches || []
        };
        
        const items = dataMap[type](response.data);
        setItems(items);
      } else {
        setError(response.message);
        showError(response.message);
      }
    } catch (err) {
      const errorMessage = `Failed to fetch ${type}`;
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Item add karta hai list mein
  const addItem = async (mediaItem: Omit<MediaItem, 'addedAt' | 'watchedAt'>) => {
    try {
      const serviceMap = {
        favorites: () => mediaService.addToFavorites(mediaItem),
        watchlist: () => mediaService.addToWatchlist(mediaItem),
        recent: () => mediaService.addToRecentWatches(mediaItem)
      };
      
      const response = await serviceMap[type]();

      if (response.success) {
        success(`Added to ${type} successfully!`);
        await fetchItems(); // Refresh list
        return true;
      } else {
        showError(response.message);
        return false;
      }
    } catch (err) {
      showError(`Failed to add to ${type}`);
      return false;
    }
  };

  // ➖ Item remove karta hai list se
  const removeItem = async (mediaId: number, mediaType: 'movie' | 'tv') => {
    try {
      const serviceMap = {
        favorites: () => mediaService.removeFromFavorites(mediaId, mediaType),
        watchlist: () => mediaService.removeFromWatchlist(mediaId, mediaType),
        recent: () => { throw new Error('Cannot remove from recent watches'); }
      };
      
      const response = await serviceMap[type]();

      if (response.success) {
        success(`Removed from ${type} successfully!`);
        // Local state se bhi remove kar dete hain for instant UI update
        setItems(prev => prev.filter(item => 
          !(item.mediaId === mediaId && item.mediaType === mediaType)
        ));
        return true;
      } else {
        showError(response.message);
        return false;
      }
    } catch (err) {
      showError(`Failed to remove from ${type}`);
      return false;
    }
  };

  // 🗑️ Recent watches clear karta hai (only for recent type)
  const clearAll = async () => {
    if (type !== 'recent') return false;
    
    try {
      const response = await mediaService.clearRecentWatches();
      
      if (response.success) {
        success('Recent watches cleared successfully!');
        setItems([]);
        return true;
      } else {
        showError(response.message);
        return false;
      }
    } catch (err) {
      showError('Failed to clear recent watches');
      return false;
    }
  };

  // 🔍 Check karta hai item exist karta hai ya nahi
  const hasItem = (mediaId: number, mediaType: 'movie' | 'tv') => {
    return items.some(item => item.mediaId === mediaId && item.mediaType === mediaType);
  };

  // 🔄 Toggle function - add/remove smartly karta hai
  const toggleItem = async (mediaItem: Omit<MediaItem, 'addedAt' | 'watchedAt'>) => {
    const exists = hasItem(mediaItem.mediaId, mediaItem.mediaType);
    return exists ? 
      await removeItem(mediaItem.mediaId, mediaItem.mediaType) : 
      await addItem(mediaItem);
  };

  // Component mount pe data fetch karta hai
  useEffect(() => {
    fetchItems();
  }, [type]);

  // Hook ka return object - sab kuch export kar rahe hain
  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    removeItem,
    clearAll,
    hasItem,
    toggleItem,
    count: items.length,
  };
}
