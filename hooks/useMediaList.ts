'use client';

import { useState, useEffect } from 'react';
import { mediaService, MediaItem, ApiResponse } from '@/services/mediaService';
import { useToast } from '@/context/ToastContext';

type MediaListType = 'favorites' | 'watchlist' | 'recent';

/**
 * Custom hook for managing user media lists
 * Handles CRUD operations for favorites, watchlist, and recent watches
 */
export function useMediaList(type: MediaListType) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response: ApiResponse<MediaItem[]>;
      
      switch (type) {
        case 'favorites':
          response = await mediaService.getFavorites();
          break;
        case 'watchlist':
          response = await mediaService.getWatchlist();
          break;
        case 'recent':
          response = await mediaService.getRecentWatches();
          break;
        default:
          throw new Error('Invalid media list type');
      }

      if (response.success && response.data) {
        // Extract data from nested response structure
        let items: MediaItem[] = [];
        switch (type) {
          case 'favorites':
            items = (response.data as any).favorites || [];
            break;
          case 'watchlist':
            items = (response.data as any).watchlist || [];
            break;
          case 'recent':
            items = (response.data as any).recentWatches || [];
            break;
        }
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

  const addItem = async (mediaItem: Omit<MediaItem, 'addedAt' | 'watchedAt'>) => {
    try {
      let response: ApiResponse;
      
      switch (type) {
        case 'favorites':
          response = await mediaService.addToFavorites(mediaItem);
          break;
        case 'watchlist':
          response = await mediaService.addToWatchlist(mediaItem);
          break;
        case 'recent':
          response = await mediaService.addToRecentWatches(mediaItem);
          break;
        default:
          throw new Error('Invalid media list type');
      }

      if (response.success) {
        success(`Added to ${type} successfully!`);
        await fetchItems();
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

  const removeItem = async (mediaId: number, mediaType: 'movie' | 'tv') => {
    try {
      let response: ApiResponse;
      
      switch (type) {
        case 'favorites':
          response = await mediaService.removeFromFavorites(mediaId, mediaType);
          break;
        case 'watchlist':
          response = await mediaService.removeFromWatchlist(mediaId, mediaType);
          break;
        default:
          throw new Error('Cannot remove from recent watches');
      }

      if (response.success) {
        success(`Removed from ${type} successfully!`);
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

  const hasItem = (mediaId: number, mediaType: 'movie' | 'tv') => {
    return items.some(item => item.mediaId === mediaId && item.mediaType === mediaType);
  };

  const toggleItem = async (mediaItem: Omit<MediaItem, 'addedAt' | 'watchedAt'>) => {
    const exists = hasItem(mediaItem.mediaId, mediaItem.mediaType);
    
    if (exists) {
      return await removeItem(mediaItem.mediaId, mediaItem.mediaType);
    } else {
      return await addItem(mediaItem);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

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
