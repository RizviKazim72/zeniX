"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { Film, Star, Calendar, Play, Info } from "lucide-react";
import { Button } from "@/components";
import ZeniXLoader from "@/components/ui/ZeniXLoader";
import { TMDBService } from "@/services";
import { useNavigationLoading } from "@/hooks/useNavigationLoading";
import {
  getBackdropUrl,
  getPosterUrl,
  getMediaTitle,
  getMediaYear,
} from "@/utils";
import type { Movie, TVShow } from "@/types";
import { UI_CONFIG, ANIMATION_CONFIG } from "@/lib/config";

interface BannerSliderProps {
  category: "movie" | "tv" | "trending" | "top-rated" | string;
}

const BannerSlider: React.FC<BannerSliderProps> = ({ category }) => {
  const [mediaItems, setMediaItems] = useState<(Movie | TVShow)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useNavigationLoading();

  // Helper function for responsive overview length
  const getOverviewLength = () => {
    if (typeof window === 'undefined') return 200;
    if (window.innerWidth < 640) return 120; // Mobile
    if (window.innerWidth < 768) return 150; // Small tablet
    if (window.innerWidth < 1024) return 180; // Tablet
    return 220; // Desktop
  };

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;

        switch (category) {
          case "movie":
          case "movies":
            response = await TMDBService.getPopularMovies(1);
            break;
          case "tv":
            response = await TMDBService.getPopularTVShows(1);
            break;
          case "top-rated":
            response = await TMDBService.getTopRatedMovies(1);
            break;
          case "trending":
          default:
            response = await TMDBService.getTrendingMovies("week", 1);
        }

        setMediaItems(response.results.slice(0, 3));
      } catch (err) {
        console.error("Error fetching banner items:", err);
        setError("Failed to load featured content");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaItems();
  }, [category]);

  useEffect(() => {
    if (!mediaItems.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    }, UI_CONFIG.SLIDER.AUTO_SCROLL_DELAY);

    return () => clearInterval(interval);
  }, [mediaItems]);

  if (loading) {
    return (
      <div className="relative w-full h-[75vh]">
        <ZeniXLoader
          isLoading={true}
          loadingText="Loading featured content..."
          variant="component"
        />
      </div>
    );
  }

  if (error || !mediaItems.length) {
    return (
      <div className="relative w-full h-[75vh] flex items-center justify-center bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
        <div className="text-center text-text-primary max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-netflix-red/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Film size={40} className="text-netflix-red" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Content Unavailable</h2>
          <p className="text-text-muted">
            {error || "Unable to load featured content"}
          </p>
        </div>
      </div>
    );
  }

  const currentMedia = mediaItems[currentIndex];
  const backdropUrl = getBackdropUrl(currentMedia.backdrop_path, "ORIGINAL");
  const posterUrl = getPosterUrl(currentMedia.poster_path, "LARGE");
  const title = getMediaTitle(currentMedia);
  const year = getMediaYear(currentMedia);

  return (
    <div className="relative w-full h-[150vh] sm:h-[120vh] md:h-[110vh] lg:h-screen xl:h-screen mt-16 overflow-hidden font-netflix">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{
            duration: UI_CONFIG.SLIDER.TRANSITION_DURATION / 1000,
            ease: [0.25, 0.25, 0, 1],
          }}
          className="absolute inset-0"
        >
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={title}
              fill
              sizes="100vw"
              priority
              className="object-cover object-center"
            />
          )}
          
          {/* Responsive gradient overlays optimized for all devices */}
          <div className="absolute inset-0 z-0">
            {/* Mobile: Strong overlay for readability */}
            <div className="block sm:hidden absolute inset-0 bg-black/75" />
            {/* Small tablet (portrait): Medium overlay */}
            <div className="hidden sm:block md:hidden absolute inset-0 bg-black/65" />
            {/* Tablet/iPad (landscape): Gradient overlay */}
            <div className="hidden md:block lg:hidden absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
            {/* Desktop: Full gradient */}
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>

          <div className="absolute inset-0 z-0">
            {/* Mobile: Additional bottom overlay */}
            <div className="block sm:hidden absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Tablet: Subtle vertical gradient */}
            <div className="hidden sm:block lg:hidden absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Desktop: Light vertical gradient */}
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-64 z-0">
            {/* Mobile: Strong bottom gradient */}
            <div className="block sm:hidden h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            {/* Tablet: Medium bottom gradient */}
            <div className="hidden sm:block lg:hidden h-full bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            {/* Desktop: Subtle bottom gradient */}
            <div className="hidden lg:block h-full bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
              <div className="md:col-span-8 lg:col-span-7 space-y-4 sm:space-y-5 md:space-y-6">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.3,
                    duration: ANIMATION_CONFIG.DURATIONS.SLOW / 1000,
                  }}
                  className="space-y-3 sm:space-y-4 md:space-y-4"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-sm">
                    <span className="px-2.5 py-1 sm:px-3 sm:py-1 bg-netflix-red/20 text-netflix-red rounded-full border border-netflix-red/30 text-xs sm:text-sm">
                      Featured
                    </span>
                    {currentMedia.vote_average && (
                      <div className="flex items-center space-x-1.5 sm:space-x-2 text-accent-gold">
                        <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
                        <span className="font-semibold text-xs sm:text-sm">
                          {currentMedia.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-text-secondary">
                      <Calendar size={14} className="sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{year}</span>
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary leading-tight">
                    {title}
                  </h1>

                  <p className="text-text-secondary text-sm sm:text-base md:text-lg lg:text-xl max-w-full md:max-w-2xl leading-relaxed">
                    {currentMedia.overview && currentMedia.overview.length > getOverviewLength()
                      ? `${currentMedia.overview.substring(0, getOverviewLength())}...`
                      : currentMedia.overview}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.5,
                    duration: ANIMATION_CONFIG.DURATIONS.SLOW / 1000,
                  }}
                  className="flex flex-col sm:flex-row gap-3 md:gap-4"
                >
                  <Button
                    ariaLabel="Watch Now"
                    variant="white"
                    size="lg"
                    className="transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                    onClick={() => {
                      const detailsUrl = category === 'tv' 
                        ? `/tv-shows/${currentMedia.id}` 
                        : `/movies/${currentMedia.id}`;
                      navigate(detailsUrl, 'Loading Content Details...');
                    }}
                    icon={<Play size={16} className="sm:w-5 sm:h-5" fill="currentColor" />}
                  >
                    Watch Now
                  </Button>

                  <Button
                    ariaLabel="More Info"
                    variant="ghost"
                    size="lg"
                    className="transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                    onClick={() => {
                      const detailsUrl = category === 'tv' 
                        ? `/tv-shows/${currentMedia.id}` 
                        : `/movies/${currentMedia.id}`;
                      navigate(detailsUrl, 'Loading Content Details...');
                    }}
                    icon={<Info size={16} className="sm:w-5 sm:h-5" />}
                  >
                    More Info
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: 0.7,
                  duration: ANIMATION_CONFIG.DURATIONS.SLOW / 1000,
                }}
                className="md:col-span-4 lg:col-span-5 flex justify-center md:justify-end"
              >
                <div className="relative group">
                  {posterUrl && (
                    <Image
                      src={posterUrl}
                      alt={title}
                      width={320}
                      height={480}
                      sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 320px"
                      className="w-40 sm:w-48 md:w-56 lg:w-80 h-auto object-cover rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl sm:rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Responsive pagination dots optimized for all devices */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-2.5 md:space-x-3">
        {mediaItems.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.3 }}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
              index === currentIndex
                ? "w-6 sm:w-7 md:w-8 bg-netflix-red shadow-netflix"
                : "w-1.5 sm:w-2 bg-white/40 hover:bg-netflix-red/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
