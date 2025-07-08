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
  <div className="w-full h-screen bg-slate-800 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
    <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-16">
      <div className="max-w-2xl space-y-6">
        <Skeleton variant="text" height={60} className="w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton variant="text" width={80} height={20} />
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={60} height={20} />
        </div>
        <Skeleton variant="text" lines={4} />
        <div className="flex space-x-4">
          <Skeleton variant="rectangular" width={150} height={45} className="rounded-lg" />
          <Skeleton variant="rectangular" width={120} height={45} className="rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="flex-shrink-0 space-y-3">
    <Skeleton variant="card" width={200} height={300} />
    <Skeleton variant="text" width={180} height={16} />
    <Skeleton variant="text" width={120} height={14} />
  </div>
);

export const SliderSkeleton = ({ title }: { title?: string }) => (
  <div className="px-4 sm:px-6 lg:px-8 space-y-4">
    {title ? (
      <h2 className="text-xl font-bold text-white">{title}</h2>
    ) : (
      <Skeleton variant="text" width={200} height={24} />
    )}
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex items-center space-x-4 p-4">
    <Skeleton variant="circular" width={60} height={60} />
    <div className="space-y-2">
      <Skeleton variant="text" width={150} height={20} />
      <Skeleton variant="text" width={200} height={16} />
    </div>
  </div>
);

export const SearchResultSkeleton = () => (
  <div className="flex space-x-4 p-4 border-b border-slate-700">
    <Skeleton variant="card" width={80} height={120} />
    <div className="flex-1 space-y-3">
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" lines={3} />
      <div className="flex space-x-2">
        <Skeleton variant="text" width={60} height={16} />
        <Skeleton variant="text" width={80} height={16} />
      </div>
    </div>
  </div>
);
