"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Film } from 'lucide-react';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  unoptimized?: boolean;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  priority,
  className,
  unoptimized = false,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no src or image error, show placeholder
  if (!src || imageError) {
    return (
      <div className={`bg-slate-800 flex items-center justify-center ${className || ''}`} {...(fill ? {} : { style: { width, height } })}>
        <Film className="w-16 h-16 text-slate-600" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center ${className || ''}`}>
          <Film className="w-16 h-16 text-slate-600" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={className}
        unoptimized={unoptimized}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </>
  );
};

export default SafeImage;
