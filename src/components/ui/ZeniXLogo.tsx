'use client';

import React from 'react';

interface ZeniXLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Custom ZeniX Logo Component
 * Clean minimalist text logo with Z letter in dark background with red accent
 */
const ZeniXLogo: React.FC<ZeniXLogoProps> = ({ 
  className = '',
  size = 'md' 
}) => {
  // Size mapping for the logo
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div 
      className={`relative flex items-center justify-center bg-black rounded ${sizeClasses[size]} ${className}`}
    >
      {/* Red accent border */}
      <div className="absolute inset-0 rounded border-b-2 border-red-600 opacity-80"></div>
      
      {/* Z text */}
      <span 
        className="text-red-600 font-bold" 
        style={{ 
          fontSize: size === 'sm' ? '16px' : size === 'md' ? '20px' : '26px',
          fontWeight: 800,
          letterSpacing: '-0.5px'
        }}
      >
        Z
      </span>
    </div>
  );
};

export default ZeniXLogo;
