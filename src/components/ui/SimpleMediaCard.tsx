'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SimpleMediaCardProps {
  media: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    media_type: 'movie' | 'tv';
  };
  width?: string;
  showBadge?: boolean;
  badgeText?: string;
}

/**
 * Simple Media Card Component
 * A lighter version of MediaCard for homepage displays
 */
export default function SimpleMediaCard({ 
  media, 
  width = "w-[200px]",
  showBadge = false,
  badgeText = ""
}: SimpleMediaCardProps) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  
  // Image URL generator
  const getImageUrl = (posterPath: string) => {
    if (!posterPath || imageError) {
      return '/images/placeholder-poster.jpg';
    }
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  const handleClick = () => {
    const route = media.media_type === 'movie' 
      ? `/movies/${media.id}`
      : `/tv-shows/${media.id}`;
    router.push(route);
  };

  return (
    <div 
      className={`${width} relative cursor-pointer transition-transform duration-200 hover:scale-105`}
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
        <Image
          src={getImageUrl(media.poster_path)}
          alt={media.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={() => setImageError(true)}
        />
        
        {/* Rating badge */}
        <div className="absolute bottom-0 left-0 bg-black/80 text-white px-2 py-1 text-xs">
          ★ {media.vote_average.toFixed(1)}
        </div>
        
        {/* Custom badge */}
        {showBadge && badgeText && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded-md">
            {badgeText}
          </div>
        )}
      </div>
      
      <h3 className="mt-2 text-sm font-medium text-white truncate">{media.title}</h3>
    </div>
  );
}
