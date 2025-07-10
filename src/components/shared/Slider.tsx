"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Star, Play, AlertCircle, 
  TrendingUp, Flame, Film, Tv, Award, Clock,
  Calendar, BarChart, ThumbsUp, Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTMDBEndpoint } from "@/hooks";
import { getPosterUrl, getMediaTitle, getMediaUrl } from "@/utils";
import type { Movie, TVShow, MediaType } from "@/types";
import { UI_CONFIG, ANIMATION_CONFIG } from "@/lib/config";

interface SliderProps {
  title: string;
  endpoint: string;
  category: string;
  cardWidth: string;
  autoScroll?: boolean;
  type?: MediaType;
}

type MediaItem = Movie | TVShow;

/**
 * Helper function to get appropriate Lucide icon for slider title
 * Uses consistent icon system from Lucide instead of custom emojis
 */
const getTitleIcon = (title: string, category: string) => {
  // Trending categories
  if (category.includes('trending-today')) return <Flame className="inline-block mr-2 text-orange-500" size={20} />;
  if (category.includes('trending-week')) return <TrendingUp className="inline-block mr-2 text-blue-500" size={20} />;
  if (category.includes('trending-movies')) return <Film className="inline-block mr-2 text-purple-500" size={20} />;
  if (category.includes('trending-tv')) return <Tv className="inline-block mr-2 text-green-500" size={20} />;
  
  // Popular content
  if (category.includes('popular-movies') || title.includes('Popular Movies')) 
    return <ThumbsUp className="inline-block mr-2 text-yellow-500" size={20} />;
  if (category.includes('popular-tv') || title.includes('Popular TV')) 
    return <ThumbsUp className="inline-block mr-2 text-cyan-500" size={20} />;
  
  // Top rated content
  if (category.includes('top-rated')) 
    return <Award className="inline-block mr-2 text-amber-500" size={20} />;
  
  // Upcoming/new content
  if (category.includes('upcoming') || title.toLowerCase().includes('upcoming')) 
    return <Calendar className="inline-block mr-2 text-indigo-400" size={20} />;
  if (category.includes('whats-new') || title.includes('What\'s New')) 
    return <Zap className="inline-block mr-2 text-yellow-400" size={20} />;
  if (category.includes('now-playing')) 
    return <Play className="inline-block mr-2 text-green-400" size={20} />;
  if (category.includes('on-air')) 
    return <Clock className="inline-block mr-2 text-blue-400" size={20} />;
  
  // Default case - return null if no matching category
  return null;
};

const Slider: React.FC<SliderProps> = ({
  title,
  endpoint,
  category,
  cardWidth,
  autoScroll = true,
  type = "movie",
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const { data, loading, error } = useTMDBEndpoint<{ results: MediaItem[] }>(endpoint);
  const items = data?.results?.slice(0, 20) || [];

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    
    const scrollAmount = sliderRef.current.offsetWidth * 0.75;
    const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.offsetWidth;
    
    const nextPosition = direction === "left"
      ? Math.max(scrollPosition - scrollAmount, 0)
      : Math.min(scrollPosition + scrollAmount, maxScroll);
    
    sliderRef.current.scrollTo({ left: nextPosition, behavior: "smooth" });
    setScrollPosition(nextPosition);
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || !sliderRef.current || !items.length) return;

    const slider = sliderRef.current;
    const interval = setInterval(() => {
      const maxScroll = slider.scrollWidth - slider.offsetWidth;
      const nextPosition = scrollPosition + slider.offsetWidth * 0.75;
      const finalPosition = nextPosition > maxScroll ? 0 : nextPosition;
      
      slider.scrollTo({ left: finalPosition, behavior: "smooth" });
      setScrollPosition(finalPosition);
    }, UI_CONFIG.SLIDER.AUTO_SCROLL_DELAY);

    return () => clearInterval(interval);
  }, [autoScroll, scrollPosition, items.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, direction: "left" | "right") => {
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      scroll(direction);
    }
  };

  if (loading) {
    return <SkeletonSection title={title} cardWidth={cardWidth} />;
  }

  if (error) {
    console.error(`Slider error for ${title} (${endpoint}):`, error);
    return <ErrorSection title={title} message={`Error loading content: ${error}`} category={category} />;
  }

  if (!items || !items.length) {
    console.warn(`No items found for slider: ${title} (${endpoint})`);
    return <ErrorSection title={title} message={`No ${type} content available at the moment`} category={category} />;
  }

  const isAtStart = scrollPosition === 0;
  const isAtEnd = sliderRef.current 
    ? scrollPosition >= sliderRef.current.scrollWidth - sliderRef.current.offsetWidth
    : false;

  return (
    <section className="py-8 bg-bg-primary" aria-label={`${title} slider`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_CONFIG.DURATIONS.NORMAL / 1000 }}
          className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6 gradient-text flex items-center"
        >
          {getTitleIcon(title, category)}
          {title}
        </motion.h2>

        <div className="relative group">
          <NavigationArrow
            direction="left"
            onClick={() => scroll("left")}
            onKeyDown={(e) => handleKeyDown(e, "left")}
            disabled={isAtStart}
          />

          <div
            ref={sliderRef}
            className="grid grid-flow-col auto-cols-[minmax(12rem,_1fr)] gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
            role="region"
            aria-label={`${title} content`}
          >
            <AnimatePresence>
              {items.map((item, index) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  type={type}
                  cardWidth={cardWidth}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>

          <NavigationArrow
            direction="right"
            onClick={() => scroll("right")}
            onKeyDown={(e) => handleKeyDown(e, "right")}
            disabled={isAtEnd}
          />
        </div>
      </div>
    </section>
  );
};

// ===============================
// SUB-COMPONENTS
// ===============================

interface MediaCardProps {
  item: MediaItem;
  type: MediaType;
  cardWidth: string;
  index: number;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, cardWidth, index }) => {
  const posterUrl = getPosterUrl(item.poster_path, "MEDIUM");
  const title = getMediaTitle(item);
  const mediaUrl = getMediaUrl(item);
  const router = useRouter();

  const handleWatchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(mediaUrl);
  };

  return (
    <Link href={mediaUrl}>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ 
          duration: ANIMATION_CONFIG.DURATIONS.NORMAL / 1000, 
          delay: index * 0.1 
        }}
        className={`${cardWidth} snap-start`}
      >
        <div className="relative h-72 rounded-xl overflow-hidden shadow-xl group/item cursor-pointer">
          {posterUrl && (
            <Image src={posterUrl} alt={title} fill className="object-cover transition-transform duration-300 group-hover/item:scale-105" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
             />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
            <h3 className="text-white text-sm font-semibold truncate mb-1">
              {title}
            </h3>
            
            {item.vote_average && (
              <div className="flex items-center gap-2 text-xs text-gray-300 mb-3">
                <Star size={14} className="text-yellow-400" fill="currentColor" />
                <span>{item.vote_average.toFixed(1)}</span>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-netflix-red hover:bg-netflix-red-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-netflix cursor-pointer"
              onClick={handleWatchClick}
            >
              <Play size={16} fill="currentColor" />
              Watch
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

interface NavigationArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  disabled: boolean;
}

const NavigationArrow: React.FC<NavigationArrowProps> = ({
  direction,
  onClick,
  onKeyDown,
  disabled,
}) => (
  <motion.button
    whileHover={{ 
      scale: disabled ? 1 : 1.1, 
      backgroundColor: disabled ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.8)" 
    }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    whileFocus={{ 
      scale: disabled ? 1 : 1.1, 
      outline: "2px solid #9333ea" 
    }}
    onClick={onClick}
    onKeyDown={onKeyDown}
    className={`
      absolute ${direction === "left" ? "left-4" : "right-4"} 
      top-1/2 -translate-y-1/2 z-10 
      bg-black/50 p-3 rounded-full shadow-lg 
      transition-all duration-300 hidden md:block
      ${disabled 
        ? "opacity-30 cursor-not-allowed" 
        : "opacity-0 group-hover:opacity-100 hover:opacity-100"
      }
    `}
    disabled={disabled}
    aria-label={`Scroll ${direction}`}
    tabIndex={disabled ? -1 : 0}
  >
    {direction === "left" ? (
      <ChevronLeft size={28} className="text-white" />
    ) : (
      <ChevronRight size={28} className="text-white" />
    )}
  </motion.button>
);

interface SkeletonSectionProps {
  title: string;
  cardWidth: string;
}

const SkeletonSection: React.FC<SkeletonSectionProps> = ({ title, cardWidth }) => (
  <section className="py-8 bg-bg-primary">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-flow-col auto-cols-[minmax(12rem,_1fr)] gap-4 overflow-hidden">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className={`${cardWidth} h-72 animate-pulse`}>
            <div className="w-full h-full bg-gray-800/30 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

interface ErrorSectionProps {
  title: string;
  message: string | null;
  category: string;
}

const ErrorSection: React.FC<ErrorSectionProps> = ({ title, message, category }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  // Add retry logic
  const handleRetry = () => {
    setIsRetrying(true);
    // Force a reload of the slider after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <section className="py-8 bg-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          {getTitleIcon(title, category)}
          {title}
        </h2>
        <div className="flex flex-col items-center justify-center py-12 bg-gray-800/20 rounded-xl">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <p className="text-gray-300 text-lg text-center mb-4">
            {isRetrying ? "Loading content..." : message || `No ${category} available at the moment`}
          </p>
          {!isRetrying && (
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 transition-colors rounded text-sm font-medium text-white"
            >
              Reload Content
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Slider;
