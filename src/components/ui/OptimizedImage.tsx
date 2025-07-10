'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * Enhanced image component with loading skeleton and error handling
 * Used to provide consistent image loading experience across the application
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  fill = false,
  sizes = '100vw',
  priority = false,
  quality = 75,
  style,
  objectFit = 'cover',
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  style?: React.CSSProperties;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Default fallback image
  const fallbackSrc = '/images/placeholder-poster.jpg';
  
  // Handle image load completion
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  // Handle image load error
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  return (
    <div className={`relative ${className}`} style={style}>
      {/* Skeleton loader shown while image is loading */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-slate-700 animate-pulse rounded-md"
          style={{ zIndex: 1 }}
        />
      )}
      
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={`rounded-md ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300 ease-in-out`}
        onLoadingComplete={handleImageLoad}
        onError={handleImageError}
        style={{
          objectFit,
        }}
      />
    </div>
  );
};

export default OptimizedImage;
