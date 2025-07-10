"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Star,
  Calendar,
  Clock,
  Users,
  Heart,
  Share2,
  Plus,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { mediaService } from '@/services/mediaService';

interface MediaActionBarProps {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string;
  userInFavorites: boolean;
  userInWatchlist: boolean;
  onShare: () => void;
  onPlayTrailer: () => void;
}

/**
 * Common action bar for media details pages (movies & TV shows)
 * Handles favorites, watchlist, share and play actions
 */
export function MediaActionBar({
  id,
  type,
  title,
  posterPath,
  userInFavorites,
  userInWatchlist,
  onShare,
  onPlayTrailer,
}: MediaActionBarProps) {
  const { user } = useAuth();
  const [inFavorites, setInFavorites] = useState(userInFavorites);
  const [inWatchlist, setInWatchlist] = useState(userInWatchlist);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  
  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      if (inFavorites) {
        await mediaService.removeFromFavorites(id, type);
        setInFavorites(false);
      } else {
        await mediaService.addToFavorites({
          mediaId: id,
          mediaType: type,
          title,
          posterPath,
        });
        setInFavorites(true);
      }
      
      // User state will update on next auth context refresh
    } catch (error) {
      console.error('Error updating favorites:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Toggle watchlist status
  const toggleWatchlist = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      if (inWatchlist) {
        await mediaService.removeFromWatchlist(id, type);
        setInWatchlist(false);
      } else {
        await mediaService.addToWatchlist({
          mediaId: id,
          mediaType: type,
          title,
          posterPath,
        });
        setInWatchlist(true);
      }
      
      // User state will update on next auth context refresh
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <button
        onClick={onPlayTrailer}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        <Play size={18} />
        <span>Play Trailer</span>
      </button>
      
      <button
        onClick={toggleFavorite}
        className={`flex items-center gap-2 ${
          inFavorites ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
        } text-white px-4 py-2 rounded-md transition-colors`}
        disabled={isProcessing}
      >
        <Heart size={18} fill={inFavorites ? 'white' : 'none'} />
        <span>{inFavorites ? 'In Favorites' : 'Add to Favorites'}</span>
      </button>
      
      <button
        onClick={toggleWatchlist}
        className={`flex items-center gap-2 ${
          inWatchlist ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
        } text-white px-4 py-2 rounded-md transition-colors`}
        disabled={isProcessing}
      >
        <Plus size={18} />
        <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
      </button>
      
      <button
        onClick={onShare}
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
      >
        <Share2 size={18} />
        <span>Share</span>
      </button>
    </div>
  );
}

interface MediaInfoProps {
  releaseDate?: string;
  runtime?: number;
  voteAverage?: number;
  voteCount?: number;
  genres?: { id: number; name: string }[];
}

/**
 * Common media info display component
 * Shows release date, runtime, rating, and genres
 */
export function MediaInfo({
  releaseDate,
  runtime,
  voteAverage,
  voteCount,
  genres
}: MediaInfoProps) {
  return (
    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-300">
      {releaseDate && (
        <div className="flex items-center gap-1">
          <Calendar size={16} className="text-gray-400" />
          <span>{new Date(releaseDate).getFullYear()}</span>
        </div>
      )}
      
      {runtime && (
        <div className="flex items-center gap-1">
          <Clock size={16} className="text-gray-400" />
          <span>{Math.floor(runtime / 60)}h {runtime % 60}m</span>
        </div>
      )}
      
      {voteAverage && (
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-500" />
          <span>{voteAverage.toFixed(1)}/10</span>
          {voteCount && <span className="text-gray-500">({voteCount.toLocaleString()})</span>}
        </div>
      )}
      
      <div className="flex items-center gap-1 flex-wrap">
        {genres?.map((genre) => (
          <span
            key={genre.id}
            className="bg-gray-800 px-2 py-1 rounded-md text-xs"
          >
            {genre.name}
          </span>
        ))}
      </div>
    </div>
  );
}
