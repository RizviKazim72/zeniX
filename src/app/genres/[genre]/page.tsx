/**
 * Genre Page Component
 * Displays movies and TV shows for a specific genre with Netflix-style layout
 */

"use client";

import { useState, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Film, 
  Star, 
  Calendar, 
  Grid3X3,
  List
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Component imports
import { NavBar, Footer } from "@/components";
import ZeniXLoader from "@/components/ui/ZeniXLoader";

// Hooks and utilities
import { useGenreData } from "@/hooks";
import type { GenreConfig } from "@/constants/genres";
import { 
  getPosterUrl, 
  getMediaTitle,
  getMediaYear,
  getMediaUrl
} from "@/utils";

// Types
import type { Movie, TVShow } from "@/types";

type ViewMode = "grid" | "list";
type FilterType = "all" | "movies" | "tv";

/**
 * Loading Component
 */
const LoadingSpinner = () => (
  <ZeniXLoader isLoading={true} loadingText="Loading content..." variant="component" />
);

/**
 * Error Component
 */
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-6xl mb-4">😔</div>
    <h2 className="text-2xl font-bold text-text-primary mb-2">Oops! Something went wrong</h2>
    <p className="text-text-muted mb-6 max-w-md">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-netflix-red hover:bg-netflix-red-dark text-white rounded-md transition-colors duration-200"
    >
      Try Again
    </button>
  </div>
);

/**
 * Media Card Component
 */
interface MediaCardProps {
  item: Movie | TVShow;
  index: number;
  viewMode: ViewMode;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, index, viewMode }) => {
  const posterUrl = getPosterUrl(item.poster_path, "MEDIUM");
  const title = getMediaTitle(item);
  const year = getMediaYear(item);
  const mediaUrl = getMediaUrl(item);
  const isMovie = 'title' in item;

  if (viewMode === "list") {
    return (
      <Link href={mediaUrl}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group flex items-center space-x-4 p-4 bg-bg-secondary border border-bg-tertiary hover:border-netflix-red/30 rounded-lg transition-all duration-300"
        >
          <div className="relative w-16 h-24 flex-shrink-0 rounded-md overflow-hidden bg-bg-tertiary">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-300"
                loading="lazy"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="w-6 h-6 text-text-disabled" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-text-primary group-hover:text-netflix-red transition-colors duration-200 truncate">
              {title}
            </h3>
            <div className="flex items-center space-x-4 mt-1 text-sm text-text-muted">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{year}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-accent-gold fill-current" />
                <span>{item.vote_average?.toFixed(1)}</span>
              </div>
              <span className={`px-2 py-1 rounded-md text-xs ${
                isMovie ? 'bg-netflix-red/20 text-netflix-red' : 'bg-accent-blue/20 text-accent-blue'
              }`}>
                {isMovie ? 'Movie' : 'TV Show'}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={mediaUrl}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group relative bg-black/60 backdrop-blur-md border border-white/10 hover:border-netflix-red/30 rounded-lg overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-netflix-red/20 cursor-pointer"
      >
        <div className="relative aspect-[2/3] bg-bg-tertiary overflow-hidden">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-12 h-12 text-text-disabled" />
            </div>
          )}
          
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            {/* Content that appears only on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {title}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-accent-gold fill-current" />
                    <span className="text-sm font-medium">{item.vote_average?.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-300">{year}</span>
                </div>
                
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                  isMovie ? 'bg-netflix-red text-white' : 'bg-blue-500 text-white'
                }`}>
                  {isMovie ? 'Movie' : 'TV'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

/**
 * Genre Header Component
 */
interface GenreHeaderProps {
  genreConfig: GenreConfig;
  totalItems: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const GenreHeader: React.FC<GenreHeaderProps> = ({
  genreConfig,
  totalItems,
  viewMode,
  onViewModeChange,
  filterType,
  onFilterChange
}) => {
  return (
    <div className={`relative py-20 px-4 text-center bg-gradient-to-r ${genreConfig.backgroundColor}`}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="text-6xl mb-4">{genreConfig.icon}</div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {genreConfig.name}
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-6">
            {genreConfig.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-text-muted">
            <span>{totalItems.toLocaleString()} titles available</span>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-bg-secondary/50 backdrop-blur-sm rounded-md p-1">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "grid" ? "bg-netflix-red text-white" : "text-text-muted hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "list" ? "bg-netflix-red text-white" : "text-text-muted hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              {/* Filter Toggle */}
              <div className="flex items-center space-x-2 bg-bg-secondary/50 backdrop-blur-sm rounded-md p-1">
                {["all", "movies", "tv"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => onFilterChange(filter as FilterType)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      filterType === filter ? "bg-netflix-red text-white" : "text-text-muted hover:text-white"
                    }`}
                  >
                    {filter === "all" ? "All" : filter === "movies" ? "Movies" : "TV Shows"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/**
 * Main Genre Page Component
 */
const GenrePage = () => {
  const params = useParams();
  const genreSlug = params?.genre as string;
  
  // State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<FilterType>("all");
  
  // Data fetching
  const {
    movies,
    tvShows,
    loading,
    error,
    genreConfig,
    refetch
  } = useGenreData(genreSlug);

  // If genre not found
  if (!loading && !genreConfig) {
    notFound();
  }

  // Filter and combine data
  const filteredData = (() => {
    const allData = [
      ...movies.map(item => ({ ...item, mediaType: 'movie' as const })),
      ...tvShows.map(item => ({ ...item, mediaType: 'tv' as const }))
    ];

    switch (filterType) {
      case "movies":
        return movies.map(item => ({ ...item, mediaType: 'movie' as const }));
      case "tv":
        return tvShows.map(item => ({ ...item, mediaType: 'tv' as const }));
      default:
        return allData;
    }
  })();

  // Event handlers
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleFilterChange = useCallback((filter: FilterType) => {
    setFilterType(filter);
  }, []);

  if (loading && !genreConfig) {
    return (
      <ZeniXLoader isLoading={true} loadingText="Loading genre..." variant="page" />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <NavBar />
        <div className="pt-16">
          <ErrorState message={error} onRetry={refetch} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <NavBar />
      
      {/* Hero Section */}
      <div className="pt-16">
        {genreConfig && (
          <GenreHeader
            genreConfig={genreConfig}
            totalItems={movies.length + tvShows.length}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            filterType={filterType}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {loading && filteredData.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
                {filteredData.map((item, index) => (
                  <MediaCard
                    key={`${item.id}-${item.mediaType}`}
                    item={item}
                    index={index}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                {filteredData.map((item, index) => (
                  <MediaCard
                    key={`${item.id}-${item.mediaType}`}
                    item={item}
                    index={index}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default GenrePage;
