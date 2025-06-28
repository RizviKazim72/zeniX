"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Star, Calendar, Play, Info } from "lucide-react";
import { Button } from "@/components";
import { TMDBService } from "@/services";
import { getBackdropUrl, getPosterUrl, getMediaTitle, getMediaYear } from "@/utils";
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
      <div className="relative w-full h-[75vh] flex items-center justify-center bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="w-16 h-16 border-4 border-netflix-red/30 border-t-netflix-red rounded-full"
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
          <p className="text-text-muted">{error || "Unable to load featured content"}</p>
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
    <div className="relative w-full h-[150vh] lg:h-screen overflow-hidden font-netflix">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ 
            duration: UI_CONFIG.SLIDER.TRANSITION_DURATION / 1000, 
            ease: [0.25, 0.25, 0, 1] 
          }}
          className="absolute inset-0"
        >
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover object-center absolute inset-0"
            />
          )}
          {/* Optimized gradient overlay for better contrast and fade effect */}
<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
<div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.3, 
                    duration: ANIMATION_CONFIG.DURATIONS.SLOW / 1000 
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="px-3 py-1 bg-netflix-red/20 text-netflix-red rounded-full border border-netflix-red/30">
                      Featured
                    </span>
                    {currentMedia.vote_average && (
                      <div className="flex items-center space-x-2 text-accent-gold">
                        <Star size={16} fill="currentColor" />
                        <span className="font-semibold">
                          {currentMedia.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-text-secondary">
                      <Calendar size={16} />
                      <span>{year}</span>
                    </div>
                  </div>
                  
                  <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-text-primary leading-tight">
                    {title}
                  </h1>
                  
                  <p className="text-text-secondary text-lg lg:text-xl max-w-2xl leading-relaxed">
                    {currentMedia.overview && currentMedia.overview.length > 200
                      ? `${currentMedia.overview.substring(0, 200)}...`
                      : currentMedia.overview}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.5, 
                    duration: ANIMATION_CONFIG.DURATIONS.SLOW / 1000 
                  }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    ariaLabel="Watch Now"
                    variant="netflix"
                    className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-bold cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => console.log("Play Media")}
                  >
                    <Play size={20} fill="currentColor" />
                    <span>Watch Now</span>
                  </Button>
                  <Button
                    ariaLabel="More Info"
                    variant="ghost"
                    className="bg-gray-600/80 text-white hover:bg-gray-500/80 px-8 py-4 text-lg font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => console.log("Show Info")}
                  >
                    <Info size={20} />
                    <span>More Info</span>
                  </Button>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.7, 
                  duration: ANIMATION_CONFIG.DURATIONS.SLOW / 1000 
                }}
                className="lg:col-span-5 flex justify-center lg:justify-end"
              >
                <div className="relative group">
                  {posterUrl && (
                    <img
                      src={posterUrl}
                      alt={title}
                      className="w-64 lg:w-80 h-auto object-cover rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {mediaItems.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.3 }}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentIndex
                ? "w-8 bg-netflix-red shadow-netflix"
                : "w-2 bg-white/40 hover:bg-netflix-red/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
