'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Bookmark, Trash2, Play, Star, Calendar, Clock } from 'lucide-react';
import { MediaItem } from '@/services/mediaService';

// Props interface - MediaCard ke liye sab options
interface MediaCardProps {
  item: MediaItem;
  onRemove?: (mediaId: number, mediaType: 'movie' | 'tv') => void;
  showRemoveButton?: boolean;
  showWatchProgress?: boolean;
  type: 'favorites' | 'watchlist' | 'recent';
}

/**
 * 🎬 MediaCard Component 
 * Interactive card jo movies/TV shows display karta hai
 * Features: hover effects, remove button, progress tracking
 */
export default function MediaCard({ 
  item, 
  onRemove, 
  showRemoveButton = true, 
  showWatchProgress = false,
  type 
}: MediaCardProps) {
  // Local state management
  const [imageError, setImageError] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Remove function - item ko list se hatata hai
  const handleRemove = async () => {
    if (!onRemove || !item.mediaId || !item.mediaType) return;
    
    setIsRemoving(true);
    try {
      await onRemove(item.mediaId, item.mediaType);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  // Image URL generator - poster path se full URL banata hai
  const getImageUrl = (posterPath?: string) => {
    if (!posterPath || imageError) {
      // Fallback SVG placeholder jab image load nahi hoti
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg width="500" height="750" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#1a1a1a"/>
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
                fill="#666" font-family="Arial, sans-serif" font-size="24">
            ${item.title}
          </text>
        </svg>
      `);
    }
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  // Date formatter - readable format mein convert karta hai
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Type-based icon selector
  const getTypeIcon = () => {
    switch (type) {
      case 'favorites': return <Heart size={16} className="text-netflix-red" />;
      case 'watchlist': return <Bookmark size={16} className="text-blue-500" />;
      case 'recent': return <Clock size={16} className="text-green-500" />;
      default: return null;
    }
  };

  // Type-based border color
  const getTypeColor = () => {
    const colors = {
      favorites: 'border-netflix-red/20',
      watchlist: 'border-blue-500/20', 
      recent: 'border-green-500/20'
    };
    return colors[type] || 'border-white/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ 
        y: -8, 
        scale: 1.05,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`bg-black/60 backdrop-blur-md border ${getTypeColor()} rounded-lg overflow-hidden 
                  transition-all duration-300 group cursor-pointer card-hover 
                  hover:shadow-2xl hover:shadow-netflix-red/20`}
    >
      {/* 🖼️ Movie Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={getImageUrl(item.posterPath)}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          onError={() => setImageError(true)}
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* 🔄 Hover Overlay with Play Button */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 flex items-center justify-center">
          <button className="p-3 bg-netflix-red rounded-full hover:bg-netflix-red-dark transition-colors">
            <Play size={20} className="text-white ml-1" />
          </button>
        </div>

        {/* 🏷️ Type Badge */}
        <div className="absolute top-2 left-2 flex items-center space-x-1 
                        bg-black/80 backdrop-blur-sm rounded-full px-2 py-1">
          {getTypeIcon()}
          <span className="text-xs text-white capitalize">{item.mediaType}</span>
        </div>

        {/* 📊 Progress Bar (recent watches ke liye) */}
        {showWatchProgress && item.progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div 
              className="h-full bg-netflix-red transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* 📝 Card Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-white heading-card mb-2 line-clamp-2">
          {item.title}
        </h3>

        {/* 📺 TV Show Episode Info */}
        {item.mediaType === 'tv' && (item.seasonNumber || item.episodeNumber) && (
          <div className="flex items-center space-x-1 body-tiny text-gray-400 mb-2">
            <Star size={12} />
            <span>S{item.seasonNumber || 1}E{item.episodeNumber || 1}</span>
          </div>
        )}

        {/* 📅 Date Information */}
        <div className="flex items-center space-x-1 body-tiny text-gray-400 mb-3">
          <Calendar size={12} />
          <span>
            {type === 'recent' 
              ? `Watched ${formatDate(item.watchedAt)}`
              : `Added ${formatDate(item.addedAt)}`
            }
          </span>
        </div>

        {/* 🎛️ Action Buttons */}
        <div className="flex items-center justify-between">
          {/* View Details Button */}
          <button 
            onClick={() => {
              const detailsUrl = item.mediaType === 'movie' 
                ? `/movies/${item.mediaId}` 
                : `/tv-shows/${item.mediaId}`;
              window.location.href = detailsUrl;
            }}
            className="body-tiny text-netflix-red hover:text-netflix-red-light 
                       transition-colors cursor-pointer hover:scale-105"
          >
            View Details
          </button>
          
          {/* Remove Button */}
          {showRemoveButton && onRemove && (
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors 
                         disabled:opacity-50 cursor-pointer hover:scale-110"
              title="Remove"
            >
              {isRemoving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-400" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
