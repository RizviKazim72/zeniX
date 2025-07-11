/**
 * Movie Details Page Component
 * Displays comprehensive movie information including details, cast, reviews, and similar content
 */

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Play,
  Star,
  Calendar,
  Clock,
  Users,
  Heart,
  Share2,
  Plus,
  ChevronLeft,
  Eye,
  Globe,
  User,
  Film,
} from "lucide-react";

// Type imports using barrel exports
import type { 
  DetailsResponse, 
  MediaReview as Review,
  MediaType,
  MediaCredit,
  Movie,
  MovieDetails
} from "@/types";

// Component imports
import { NavBar, Footer } from "@/components";

// Service and utility imports
import { useMediaPageData } from "@/hooks";
import { useMediaList } from "@/hooks/useMediaList";
import { useToast } from "@/context/ToastContext";
import { 
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl
} from "@/utils/imageUtils";
import { 
  getMediaTitle, 
  getMediaYear, 
  getMediaReleaseDate,
  formatRuntime,
  formatDate,
  getTrailerUrl
} from "@/utils/mediaUtils";

/**
 * Tab types
 */
type TabType = "overview" | "cast" | "reviews" | "similar" | "details";

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500" />
  </div>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div className="text-center">
      <p className="text-white text-xl mb-4">{message}</p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

/**
 * Cast member component
 */
const CastMember: React.FC<{ member: MediaCredit; index: number }> = ({ member, index }) => {
  const profileUrl = getProfileUrl(member.profile_path, "MEDIUM");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card p-4 text-center hover:shadow-netflix/30 hover:border-netflix-red/20 transition-all duration-300 transform hover:scale-105"
    >
      <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-bg-tertiary border-2 border-glass-border">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={member.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-8 h-8 text-text-disabled" />
          </div>
        )}
      </div>
      <h4 className="font-semibold text-text-primary text-sm mb-1">{member.name}</h4>
      {member.character && (
        <p className="text-text-muted text-xs">{member.character}</p>
      )}
    </motion.div>
  );
};

/**
 * Review component
 */
const ReviewCard: React.FC<{ review: Review; index: number }> = ({ review, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;
  const shouldTruncate = review.content.length > maxLength;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card p-6 hover:shadow-netflix/20 hover:border-netflix-red/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-netflix rounded-full flex items-center justify-center shadow-netflix/50">
            <span className="text-text-primary font-bold text-sm">
              {review.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">{review.author}</h4>
            <p className="text-text-muted text-sm">{formatDate(review.created_at)}</p>
          </div>
        </div>
        {review.author_details?.rating && (
          <div className="flex items-center gap-1 bg-accent-gold/20 border border-accent-gold/30 px-3 py-1 rounded-full backdrop-blur-sm">
            <Star className="w-4 h-4 text-accent-gold fill-current" />
            <span className="text-accent-gold text-sm font-medium">
              {review.author_details.rating}/10
            </span>
          </div>
        )}
      </div>
      
      <div className="text-text-secondary leading-relaxed">
        {shouldTruncate && !isExpanded ? (
          <>
            {review.content.slice(0, maxLength)}...
            <button
              onClick={() => setIsExpanded(true)}
              className="text-netflix-red hover:text-netflix-red-light ml-2 font-medium transition-colors"
            >
              Read more
            </button>
          </>
        ) : (
          <>
            {review.content}
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-netflix-red hover:text-netflix-red-light ml-2 font-medium transition-colors"
              >
                Show less
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Similar movie card component
 */
const SimilarMovieCard: React.FC<{ movie: Movie; index: number }> = ({ movie, index }) => {
  const posterUrl = getPosterUrl(movie.poster_path, "MEDIUM");
  const title = getMediaTitle(movie);
  const year = getMediaYear(movie);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => window.location.href = `/movies/${movie.id}`}
    >
      <div className="relative overflow-hidden rounded-xl bg-bg-card border border-glass-border hover:border-netflix-red/30 transition-all duration-500 hover:shadow-netflix/30">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            width={240}
            height={320}
            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="w-full h-80 bg-bg-tertiary flex items-center justify-center border border-glass-border">
            <Film className="w-16 h-16 text-text-disabled" />
          </div>
        )}
        
        {/* Dark overlay on hover with proper gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content that appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h4 className="font-semibold text-white mb-1 line-clamp-2">{title}</h4>
          <p className="text-gray-300 text-sm mb-2">{year}</p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent-gold fill-current" />
            <span className="text-accent-gold text-sm font-medium">{movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Tab navigation component
 */
const TabNavigation: React.FC<{
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: {
    cast: number;
    reviews: number;
    similar: number;
  };
}> = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: Eye },
    { id: "cast" as TabType, label: `Cast (${counts.cast})`, icon: Users },
    { id: "reviews" as TabType, label: `Reviews (${counts.reviews})`, icon: Star },
    { id: "similar" as TabType, label: `Similar (${counts.similar})`, icon: Film },
    { id: "details" as TabType, label: "Details", icon: Globe },
  ];

  return (
    <div className="border-b border-slate-700/50">
      <div className="flex overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer hover:scale-105 ${
                activeTab === tab.id
                  ? "text-red-500 border-b-2 border-red-500 bg-red-500/5"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Overview tab content
 */
const OverviewContent: React.FC<{ details: DetailsResponse }> = ({ details }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    {details.overview && (
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Plot</h3>
        <p className="text-gray-300 leading-relaxed text-lg">{details.overview}</p>
      </div>
    )}
    
    {details.genres && details.genres.length > 0 && (
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Genres</h3>
        <div className="flex flex-wrap gap-3">
          {details.genres.map((genre: { id: number; name: string }) => (
            <span
              key={genre.id}
              className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-full text-sm font-medium hover:bg-red-600/30 transition-colors"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    )}
  </motion.div>
);

/**
 * Details tab content
 */
const DetailsContent: React.FC<{ details: DetailsResponse; type: MediaType }> = ({ details, type }) => {
  type DetailItem = {
    label: string;
    value: string;
  };

  const detailItems: DetailItem[] = [
    { label: "Rating", value: `${details.vote_average?.toFixed(1) || 'N/A'}/10` },
    { label: "Vote Count", value: details.vote_count?.toLocaleString() || 'N/A' },
    { label: "Popularity", value: details.popularity?.toFixed(0) || 'N/A' },
    ...(type === "movie" && "runtime" in details && details.runtime ? [
      { label: "Runtime", value: formatRuntime(details.runtime) }
    ] : []),
    ...(type === "movie" && "budget" in details && (details as MovieDetails).budget ? [
      { label: "Budget", value: `$${(details as MovieDetails).budget!.toLocaleString()}` }
    ] : []),
    ...(type === "movie" && "revenue" in details && (details as MovieDetails).revenue ? [
      { label: "Revenue", value: `$${(details as MovieDetails).revenue!.toLocaleString()}` }
    ] : []),
    { label: "Status", value: details.status || "Released" },
    { label: "Original Language", value: ("original_language" in details ? details.original_language || "" : "").toUpperCase() },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {detailItems.map((item: DetailItem, index: number) => (
        item.value && (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30"
          >
            <dt className="text-gray-400 text-sm font-medium">{item.label}</dt>
            <dd className="text-white text-lg font-semibold mt-1">{item.value}</dd>
          </motion.div>
        )
      ))}
    </motion.div>
  );
};

/**
 * Hero section component
 */
interface HeroSectionProps {
  details: DetailsResponse;
  backdropUrl: string | null;
  posterUrl: string | null;
  title: string;
  year: string;
  trailerUrl: string | null;
  type: MediaType;
  isWatchlisted: boolean;
  isLiked: boolean;
  onWatchlistToggle: () => void;
  onLikeToggle: () => void;
  onAddRecentWatch: () => void;
  onGoBack: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  details,
  backdropUrl,
  posterUrl,
  title,
  year,
  trailerUrl,
  type,
  isWatchlisted,
  isLiked,
  onWatchlistToggle,
  onLikeToggle,
  onAddRecentWatch,
  onGoBack
}) => {
  const releaseDate = getMediaReleaseDate(details);
  
  // Share functionality
  const handleShare = async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${title} on ZeniX`,
          text: `Watch ${title} and more amazing movies on ZeniX!`,
          url: url,
        });
      } catch (error) {
        // Handle share error silently
        fallbackShare(url);
      }
    } else {
      fallbackShare(url);
    }
  };

  const fallbackShare = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      // You can show a toast here
      alert('Link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    });
  };
  
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      {backdropUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/90" />
        </div>
      )}

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <NavBar />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={onGoBack}
        className="absolute top-24 right-6 z-20 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Go back"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center pt-20 md:pt-16 lg:pt-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
            {/* Poster - Hidden on mobile to prevent header overlap */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-shrink-0 hidden md:block"
            >
              {posterUrl && (
                <Image
                  src={posterUrl}
                  alt={title}
                  width={320}
                  height={480}
                  className="w-64 md:w-72 lg:w-80 h-auto rounded-2xl shadow-2xl mx-auto lg:mx-0 hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left"
            >
              {/* Title */}
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-lg leading-tight">
                  {title}
                </h1>
                {details.tagline && (
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 italic font-light max-w-3xl mx-auto lg:mx-0">
                    &ldquo;{details.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base md:text-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-current" />
                  <span className="text-white font-semibold">{details.vote_average?.toFixed(1)}</span>
                  <span className="text-gray-400">/10</span>
                </div>
                
                {releaseDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    <span className="text-white">{year}</span>
                  </div>
                )}
                
                {type === "movie" && "runtime" in details && details.runtime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    <span className="text-white">{formatRuntime(details.runtime)}</span>
                  </div>
                )}
                
                <span className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-full font-medium text-sm">
                  {type === "movie" ? "Movie" : "TV Show"}
                </span>
              </div>

              {/* Genres */}
              {details.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 max-w-2xl mx-auto lg:mx-0">
                  {details.genres.slice(0, 4).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm sm:text-base font-medium hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 w-full max-w-2xl mx-auto lg:mx-0">
                {/* Primary Button - Watch Trailer */}  
                {trailerUrl && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onAddRecentWatch}
                    className="flex items-center justify-center gap-3 bg-netflix-red hover:bg-netflix-red-dark text-white px-6 sm:px-8 py-4 rounded-xl font-semibold text-base lg:text-lg transition-all duration-300 shadow-lg hover:shadow-netflix/25 lg:flex-1 min-h-[56px]"
                  >
                    <Play className="w-5 h-5 lg:w-6 lg:h-6 fill-current" />
                    <span className="whitespace-nowrap">Watch Trailer</span>
                  </motion.a>
                )}
                
                {/* Secondary Buttons Row */}
                <div className="flex gap-3 lg:gap-4 lg:flex-shrink-0">
                  {/* Watchlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onWatchlistToggle}
                    className={`flex items-center justify-center gap-2 px-4 lg:px-6 py-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 shadow-lg min-h-[56px] min-w-[140px] lg:min-w-[160px] ${
                      isWatchlisted 
                        ? "bg-white text-black hover:bg-gray-200" 
                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                    }`}
                  >
                    <Plus className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">
                      {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
                    </span>
                  </motion.button>
                  
                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onLikeToggle}
                    className="flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-4 lg:px-6 py-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 min-h-[56px] min-w-[56px]"
                    aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`w-4 h-4 lg:w-5 lg:h-5 ${isLiked ? "fill-current text-red-500" : ""}`} />
                  </motion.button>
                  
                  {/* Share Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleShare(title, window.location.href)}
                    className="flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-4 lg:px-6 py-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 min-h-[56px] min-w-[56px]"
                    aria-label="Share movie"
                  >
                    <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Main component for displaying movie details
 */
const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { success } = useToast();
  
  // State for UI interactions
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Media lists hooks
  const favorites = useMediaList('favorites');
  const watchlist = useMediaList('watchlist');
  const recentWatches = useMediaList('recent');

  // Use custom hook for data fetching
  const pageData = useMediaPageData(Number(id), "movie");
  const { loading, error } = pageData;

  // Check if movie is in favorites/watchlist
  const movieId = Number(id);
  const isLiked = favorites.items.some(item => item.mediaId === movieId && item.mediaType === 'movie');
  const isWatchlisted = watchlist.items.some(item => item.mediaId === movieId && item.mediaType === 'movie');

  // Early returns for loading and error states
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !pageData || !pageData.details) {
    return <ErrorState message={error || "Content not found"} />;
  }

  const { details, videos, credits, similar, reviews } = pageData;
  
  // Computed values using utilities
  const title = getMediaTitle(details);
  const year = getMediaYear(details);
  const backdropUrl = getBackdropUrl(details.backdrop_path, "ORIGINAL");
  const posterUrl = getPosterUrl(details.poster_path, "LARGE");
  const trailerUrl = getTrailerUrl(videos);

  // Event handlers
  const handleWatchlistToggle = async () => {
    if (!details) return;
    
    const mediaItem = {
      mediaId: details.id,
      mediaType: 'movie' as const,
      title: getMediaTitle(details),
      posterPath: details.poster_path || undefined,
    };

    if (isWatchlisted) {
      await watchlist.removeItem(details.id, 'movie');
      success('Removed from watchlist');
    } else {
      await watchlist.addItem(mediaItem);
      success('Added to watchlist');
    }
  };

  const handleLikeToggle = async () => {
    if (!details) return;
    
    const mediaItem = {
      mediaId: details.id,
      mediaType: 'movie' as const,
      title: getMediaTitle(details),
      posterPath: details.poster_path || undefined,
    };

    if (isLiked) {
      await favorites.removeItem(details.id, 'movie');
      success('Removed from favorites');
    } else {
      await favorites.addItem(mediaItem);
      success('Added to favorites');
    }
  };

  const handleAddRecentWatch = async () => {
    if (!details) return;
    
    const mediaItem = {
      mediaId: details.id,
      mediaType: 'movie' as const,
      title: getMediaTitle(details),
      posterPath: details.poster_path || undefined,
    };

    await recentWatches.addItem(mediaItem);
    success('Added to recent watches');
  };

  // Counts for tabs
  const counts = {
    cast: credits?.cast?.length || 0,
    reviews: reviews?.length || 0,
    similar: similar?.length || 0,
  };

  return (
    <div className="relative bg-bg-primary text-text-primary min-h-screen overflow-hidden font-netflix">
      {/* Hero Section */}
      <HeroSection
        details={details}
        backdropUrl={backdropUrl}
        posterUrl={posterUrl}
        title={title}
        year={year}
        trailerUrl={trailerUrl}
        type="movie"
        isWatchlisted={isWatchlisted}
        isLiked={isLiked}
        onWatchlistToggle={handleWatchlistToggle}
        onLikeToggle={handleLikeToggle}
        onAddRecentWatch={handleAddRecentWatch}
        onGoBack={() => router.back()}
      />

      {/* Content Section with Glass Morphism */}
      <div className="relative">
        {/* Background with Netflix gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-secondary/80 to-bg-primary" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/5 via-transparent to-netflix-red/5" />
        
        <div className="relative backdrop-blur-medium">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16">
            {/* Tab Navigation */}
            <div className="mb-8 lg:mb-12">
              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={counts}
              />
            </div>

            {/* Tab Content */}
            <div className="min-h-[60vh]">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <OverviewContent details={details} />
                  </motion.div>
                )}
                
                {activeTab === "cast" && (
                  <motion.div
                    key="cast"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-6 lg:space-y-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                        Cast & Crew
                      </h3>
                      <div className="text-sm text-text-muted bg-netflix-red/10 border border-netflix-red/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        {credits?.cast?.length || 0} members
                      </div>
                    </div>
                    
                    {credits?.cast && credits.cast.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-6">
                        {credits.cast.slice(0, 16).map((member: MediaCredit, index: number) => (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                          >
                            <CastMember member={member} index={index} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-bg-card border border-glass-border flex items-center justify-center">
                          <svg className="w-8 h-8 text-text-disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                          </svg>
                        </div>
                        <p className="text-text-muted text-center">No cast information available.</p>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-6 lg:space-y-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Reviews
                      </h3>
                      <div className="text-sm text-slate-400">
                        {reviews?.length || 0} reviews
                      </div>
                    </div>
                    
                    {reviews && reviews.length > 0 ? (
                      <div className="space-y-4 lg:space-y-6">
                        {reviews.slice(0, 5).map((review: Review, index: number) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                          >
                            <ReviewCard review={review} index={index} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
                          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="text-slate-400 text-center">No reviews available.</p>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {activeTab === "similar" && (
                  <motion.div
                    key="similar"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-6 lg:space-y-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Similar Movies
                      </h3>
                      <div className="text-sm text-slate-400">
                        {similar?.length || 0} movies
                      </div>
                    </div>
                    
                    {similar && similar.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                        {similar.slice(0, 12).map((movie, index: number) => (
                          <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                          >
                            <SimilarMovieCard movie={movie as Movie} index={index} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
                          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v14h12V6H6z" />
                          </svg>
                        </div>
                        <p className="text-slate-400 text-center">No similar movies found.</p>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-6 lg:space-y-8"
                  >
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      Movie Details
                    </h3>
                    <DetailsContent details={details} type="movie" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-16 lg:mt-24">
        <Footer />
      </div>
    </div>
  );
};


export default MovieDetailsPage;