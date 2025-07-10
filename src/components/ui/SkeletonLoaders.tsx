/**
 * Common page loading skeleton components
 * For consistent loading experience across the application
 */

// Generic card skeleton for media items
export const MediaCardSkeleton = ({ width = 'w-[200px]' }: { width?: string }) => (
  <div className={`${width} animate-pulse`}>
    <div className="aspect-[2/3] bg-slate-700 rounded-lg"></div>
    <div className="h-4 bg-slate-700 rounded mt-2 w-3/4"></div>
  </div>
);

// Row of media cards skeleton
export const MediaRowSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="px-4 sm:px-6 lg:px-8">
    <div className="h-6 bg-slate-700 rounded w-48 mb-4"></div>
    <div className="flex gap-4 overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Grid of media cards skeleton
export const MediaGridSkeleton = ({ columns = 6, rows = 1 }: { columns?: number; rows?: number }) => (
  <div className="px-4 sm:px-6 lg:px-8">
    <div className="h-6 bg-slate-700 rounded w-48 mb-4"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(columns * rows)].map((_, i) => (
        <MediaCardSkeleton key={i} width="w-full" />
      ))}
    </div>
  </div>
);

// Hero section skeleton
export const HeroSkeleton = () => (
  <div className="w-full h-[70vh] bg-slate-800 animate-pulse flex items-center justify-center">
    <div className="text-white text-xl">Loading content...</div>
  </div>
);

// Full page skeleton with hero and rows
export const PageSkeleton = () => (
  <div className="space-y-12">
    <HeroSkeleton />
    <MediaRowSkeleton />
    <MediaRowSkeleton />
    <MediaRowSkeleton />
  </div>
);

// Profile section skeleton
export const ProfileSkeleton = () => (
  <div className="px-4 sm:px-6 lg:px-8 animate-pulse">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-20 h-20 rounded-full bg-slate-700"></div>
      <div>
        <div className="h-6 bg-slate-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-32"></div>
      </div>
    </div>
    <div className="h-6 bg-slate-700 rounded w-48 mb-4"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(12)].map((_, i) => (
        <MediaCardSkeleton key={i} width="w-full" />
      ))}
    </div>
  </div>
);

// Detail page skeleton
export const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full h-[50vh] bg-slate-800"></div>
    <div className="px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-[200px] h-[300px] bg-slate-700 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-slate-700 rounded mb-2 w-full"></div>
          <div className="h-4 bg-slate-700 rounded mb-2 w-full"></div>
          <div className="h-4 bg-slate-700 rounded mb-6 w-3/4"></div>
          <div className="flex gap-3">
            <div className="h-10 bg-slate-700 rounded w-28"></div>
            <div className="h-10 bg-slate-700 rounded w-28"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
