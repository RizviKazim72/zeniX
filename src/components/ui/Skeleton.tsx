'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'hero' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%]';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded h-4';
      case 'card':
        return 'rounded-lg';
      case 'hero':
        return 'rounded-xl';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
      default:
        return 'rounded';
    }
  };

  const getSize = () => {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()} ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
            style={getSize()}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={getSize()}
    />
  );
}

// Pre-built skeleton components for common use cases
export const HeroSkeleton = () => (
  <div className="w-full aspect-[21/9] bg-slate-800 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
    <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-16">
      <div className="max-w-2xl space-y-6">
        <Skeleton variant="text" height={60} className="w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton variant="text" width={80} height={20} />
          <Skeleton variant="text" width={100} height={20} />
        </div>
        <Skeleton variant="text" lines={3} />
      </div>
    </div>
  </div>
);

export const MediaCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-slate-800">
    <div className="aspect-[2/3] bg-slate-700 animate-pulse" />
    <div className="p-4 space-y-2">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  </div>
);

export const ReviewSkeleton = () => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
    <div className="flex items-center space-x-3 mb-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1">
        <Skeleton variant="text" width="40%" />
        <div className="flex items-center space-x-2 mt-1">
          <Skeleton variant="text" width={60} height={12} />
        </div>
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
    <div className="flex justify-between mt-3">
      <Skeleton variant="text" width={80} height={20} />
      <Skeleton variant="text" width={60} height={20} />
    </div>
  </div>
);
