'use client';

import { UserRound } from 'lucide-react';

interface UserAvatarProps {
  user?: {
    name?: string;
    email?: string;
    profileImage?: string;
  } | null;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showOnlineStatus?: boolean;
}

export default function UserAvatar({ 
  user, 
  size = 'md', 
  className = '',
  showOnlineStatus = false 
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl'
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const getAvatarColor = (name?: string, email?: string) => {
    const text = name || email || 'default';
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ];
    
    const index = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const initials = getInitials(user?.name, user?.email);
  const bgColor = getAvatarColor(user?.name, user?.email);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white ${
          user?.profileImage ? 'bg-gray-800' : bgColor
        }`}
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name || user.email || 'User'}
            className="w-full h-full object-cover rounded-full"
          />
        ) : user ? (
          <span>{initials}</span>
        ) : (
          <UserRound className="w-1/2 h-1/2" />
        )}
      </div>
      
      {showOnlineStatus && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
      )}
    </div>
  );
}
