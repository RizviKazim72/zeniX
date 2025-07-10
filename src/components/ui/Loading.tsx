'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'netflix' | 'blue' | 'white';
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  color = 'netflix',
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    netflix: 'text-netflix-red',
    blue: 'text-blue-600',
    white: 'text-white'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
      {text && <p className="mt-4 text-gray-400 font-medium animate-pulse">{text}</p>}
    </div>
  );
}

// Media card loading skeleton
export function LoadingCard() {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-gray-800/50"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-700/50 rounded"></div>
        <div className="h-3 bg-gray-700/50 rounded w-3/4"></div>
      </div>
    </div>
  );
}

// Full page loading display
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <LoadingSpinner size="xl" color="netflix" text={text} />
    </div>
  );
}

// Grid of loading cards for media sections
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
}
