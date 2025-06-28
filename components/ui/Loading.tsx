interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'netflix' | 'blue' | 'white';
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  color = 'netflix' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    netflix: 'border-gray-700 border-t-netflix-red',
    blue: 'border-gray-300 border-t-blue-600',
    white: 'border-gray-600 border-t-white'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin rounded-full border-2`}
      />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-gray-800/50 skeleton"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-700/50 rounded skeleton"></div>
        <div className="h-3 bg-gray-700/50 rounded w-3/4 skeleton"></div>
      </div>
    </div>
  );
}

export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <LoadingSpinner size="xl" color="netflix" />
        <p className="mt-4 text-gray-400 font-medium animate-pulse">{text}</p>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
}
