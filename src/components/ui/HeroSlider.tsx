'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Movie, TVShow } from '@/types/tmdb';
import { MediaVideo } from '@/types/tmdb-types';
import HeroVideoPlayer from './HeroVideoPlayer';

interface HeroSliderProps {
  heroContent: ((Movie | TVShow) & { videos?: MediaVideo[] })[];
  autoPlay?: boolean;
  autoSlide?: boolean;
  slideInterval?: number;
}

export default function HeroSlider({
  heroContent,
  autoPlay = true,
  autoSlide = true,
  slideInterval = 15000 // 15 seconds
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const slideTimer = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide logic
  useEffect(() => {
    if (autoSlide && !isPaused && heroContent.length > 1) {
      slideTimer.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % heroContent.length);
      }, slideInterval);

      return () => {
        if (slideTimer.current) {
          clearInterval(slideTimer.current);
        }
      };
    }
  }, [autoSlide, isPaused, heroContent.length, slideInterval]);

  // Pause auto-slide when video is playing
  useEffect(() => {
    setIsPaused(isPlaying);
  }, [isPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(false); // Reset video state when changing slides
  };

  const goToPrevious = () => {
    setCurrentSlide(prev => (prev - 1 + heroContent.length) % heroContent.length);
    setIsPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide(prev => (prev + 1) % heroContent.length);
    setIsPlaying(false);
  };

  const handleAddToWatchlist = () => {
    console.log('Add to watchlist:', heroContent[currentSlide]);
  };

  const handleMoreInfo = () => {
    const content = heroContent[currentSlide];
    if (content) {
      const isMovie = 'title' in content;
      const id = content.id;
      window.location.href = isMovie ? `/movies/${id}` : `/tv-shows/${id}`;
    }
  };

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && heroContent.length > 1) {
      goToNext();
    }
    if (isRightSwipe && heroContent.length > 1) {
      goToPrevious();
    }
  };

  if (!heroContent || heroContent.length === 0) {
    return (
      <div className="w-full h-screen bg-slate-800 animate-pulse flex items-center justify-center">
        <div className="text-white text-xl">Loading Hero Content...</div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-screen overflow-hidden pt-16"
      style={{ height: 'calc(100vh - 0px)' }}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
    >
      {/* Main Hero Video Player */}
      <HeroVideoPlayer
        content={heroContent[currentSlide]}
        autoPlay={autoPlay}
        showControls={true}
        onAddToWatchlist={handleAddToWatchlist}
        onMoreInfo={handleMoreInfo}
      />

      {/* Navigation Arrows - Mobile Responsive */}
      {heroContent.length > 1 && !isMobile && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-black/60 border border-white/20 rounded-full transition-all duration-300 backdrop-blur-md group"
          >
            <ChevronLeft size={24} className="text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-black/60 border border-white/20 rounded-full transition-all duration-300 backdrop-blur-md group"
          >
            <ChevronRight size={24} className="text-white group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Mobile Swipe Indicators */}
      {heroContent.length > 1 && isMobile && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
          <div className="flex items-center space-x-2 text-white text-xs">
            <span>Swipe</span>
            <div className="flex space-x-1">
              <ChevronLeft size={12} />
              <ChevronRight size={12} />
            </div>
            <span>or tap dots</span>
          </div>
        </div>
      )}

      {/* Slide Indicators - Mobile Responsive */}
      {heroContent.length > 1 && (
        <div className={`absolute left-1/2 -translate-x-1/2 z-30 flex space-x-3 ${
          isMobile ? 'bottom-4' : 'bottom-8'
        }`}>
          {heroContent.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                isMobile ? 'w-2 h-2' : 'w-3 h-3'
              } ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content Counter - Hidden on mobile */}
      {heroContent.length > 1 && !isMobile && (
        <div className="absolute top-8 right-8 z-30 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2">
          <span className="text-white text-sm font-medium">
            {currentSlide + 1} / {heroContent.length}
          </span>
        </div>
      )}

      {/* Play/Pause Auto-slide Control - Hidden on mobile */}
      {heroContent.length > 1 && autoSlide && !isMobile && (
        <div className="absolute top-8 left-8 z-30">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 bg-black/40 hover:bg-black/60 border border-white/20 rounded-full transition-all duration-300 backdrop-blur-md group"
            title={isPaused ? 'Resume auto-slide' : 'Pause auto-slide'}
          >
            {isPaused ? (
              <Play size={16} className="text-white group-hover:scale-110 transition-transform" />
            ) : (
              <Pause size={16} className="text-white group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      )}

      {/* Progress Bar for Auto-slide - Responsive */}
      {heroContent.length > 1 && autoSlide && !isPaused && (
        <div className={`absolute bottom-0 left-0 right-0 z-30 bg-white/20 ${
          isMobile ? 'h-0.5' : 'h-1'
        }`}>
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / heroContent.length) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  );
}
