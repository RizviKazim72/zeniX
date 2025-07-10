/**
 * Add/Update Watchlist Item Component
 * 
 * This component handles adding or updating items in user's watchlist
 * Uses the mediaService API to perform operations
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mediaService } from '@/services/mediaService';
import { PlusCircle, Bookmark, Check } from 'lucide-react';

interface AddToWatchlistButtonProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  className?: string;
}

export default function AddToWatchlistButton({
  mediaId,
  mediaType,
  title,
  posterPath,
  className = ''
}: AddToWatchlistButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth();

  // Check if item is already in watchlist
  useEffect(() => {
    if (user && user.watchlist) {
      const exists = user.watchlist.some(
        item => item.mediaId === mediaId && item.mediaType === mediaType
      );
      setIsInWatchlist(exists);
    }
  }, [user, mediaId, mediaType]);

  const handleAddToWatchlist = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }
    
    if (isInWatchlist) {
      return; // Already in watchlist
    }
    
    setIsAdding(true);
    
    try {
      await mediaService.addToWatchlist({
        mediaId,
        mediaType,
        title,
        posterPath
      });
      
      // Show confirmation message
      setIsInWatchlist(true);
      setShowConfirmation(true);
      
      // Hide confirmation after 2 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
    } finally {
      setIsAdding(false);
    }
  };
  
  // Disable button if not logged in
  if (!user) {
    return null;
  }
  
  return (
    <div className="relative">
      <button
        onClick={handleAddToWatchlist}
        disabled={isAdding || isInWatchlist}
        className={`flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 disabled:bg-gray-700 disabled:text-gray-400 transition-colors rounded-md px-4 py-2 ${className}`}
      >
        {isInWatchlist ? (
          <>
            <Bookmark size={18} className="text-green-400" />
            <span>Added</span>
          </>
        ) : (
          <>
            <PlusCircle size={18} />
            <span>Watchlist</span>
          </>
        )}
      </button>
      
      {/* Confirmation tooltip */}
      {showConfirmation && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-2 rounded-md text-sm flex items-center gap-2 z-10">
          <Check size={16} />
          <span>Added to watchlist</span>
        </div>
      )}
    </div>
  );
}
