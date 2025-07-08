'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, VolumeX, Volume2, Info, Plus } from 'lucide-react';
import { Movie, TVShow } from '@/types/tmdb';
import { MediaVideo } from '@/types/tmdb-types';

interface HeroVideoPlayerProps {
  content: (Movie | TVShow) & { videos?: MediaVideo[] };
  autoPlay?: boolean;
  showControls?: boolean;
  onAddToWatchlist?: () => void;
  onMoreInfo?: () => void;
}

export default function HeroVideoPlayer({
  content,
  autoPlay = true,
  showControls = true,
  onAddToWatchlist,
  onMoreInfo
}: HeroVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<MediaVideo | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get the best trailer video
  useEffect(() => {
    if (content.videos && content.videos.length > 0) {
      // Find the best trailer
      const trailer = content.videos.find(video => 
        video.type === 'Trailer'
      ) || content.videos[0];
      
      setCurrentVideo(trailer);
    }
  }, [content.videos]);

  // Auto-play logic (disabled on mobile to save data)
  useEffect(() => {
    if (autoPlay && currentVideo && !isMobile) {
      const timer = setTimeout(() => {
        setShowVideo(true);
        setIsPlaying(true);
      }, 2000); // Start playing after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [autoPlay, currentVideo, isMobile]);

  const togglePlay = () => {
    // On mobile, redirect to YouTube instead of playing inline
    if (isMobile && currentVideo) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${currentVideo.key}`;
      window.open(youtubeUrl, '_blank');
      return;
    }
    
    // On desktop, play inline
    setIsPlaying(!isPlaying);
    if (!showVideo) {
      setShowVideo(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getTitle = () => {
    return 'title' in content ? content.title : content.name;
  };

  const getYear = () => {
    const date = 'release_date' in content ? content.release_date : 
                 'first_air_date' in content ? content.first_air_date : null;
    return date ? new Date(date).getFullYear() : '';
  };

  const getBackdropUrl = () => {
    return content.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${content.backdrop_path}`
      : '/api/placeholder/1920/1080';
  };

  const getYouTubeEmbedUrl = () => {
    if (!currentVideo) return '';
    
    const baseUrl = `https://www.youtube.com/embed/${currentVideo.key}`;
    const params = new URLSearchParams({
      autoplay: isPlaying ? '1' : '0',
      mute: isMuted ? '1' : '0',
      controls: '0',
      showinfo: '0',
      rel: '0',
      iv_load_policy: '3',
      modestbranding: '1',
      playsinline: '1',
      enablejsapi: '1',
      origin: window.location.origin,
      widget_referrer: window.location.origin,
      cc_load_policy: '0',
      disablekb: '1',
      fs: '0', // Disable fullscreen button
      loop: '1',
      playlist: currentVideo.key // For looping
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${getBackdropUrl()})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      </div>

      {/* Video Player - Full Screen Coverage */}
      {showVideo && currentVideo && (
        <div className="hero-video-container z-10">
          <iframe
            ref={playerRef}
            src={getYouTubeEmbedUrl()}
            className="hero-video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${getTitle()} Trailer`}
          />
          {/* Enhanced Video Overlays - Stronger on mobile */}
          <div className={`absolute inset-0 ${
            isMobile 
              ? 'bg-gradient-to-r from-black/95 via-black/70 to-black/40' 
              : 'bg-gradient-to-r from-black/90 via-black/50 to-black/20'
          }`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40" />
          <div className={`absolute inset-0 ${
            isMobile 
              ? 'bg-gradient-to-l from-transparent via-transparent to-black/80' 
              : 'bg-gradient-to-l from-transparent via-transparent to-black/60'
          }`} />
        </div>
      )}

      {/* Content Overlay - Mobile Responsive */}
      <div className={`absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-6 lg:px-16 transition-opacity duration-1000 ${
        showVideo && isPlaying && !isMobile ? 'opacity-30 hover:opacity-100' : 'opacity-100'
      }`}>
        <div className="max-w-2xl">
          {/* Title - Mobile Responsive */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 heading-hero drop-shadow-2xl leading-tight">
            {getTitle()}
          </h1>

          {/* Meta Info - Mobile Responsive */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6 text-white/90 drop-shadow-lg text-sm sm:text-base lg:text-lg">
            <span className="font-semibold">{getYear()}</span>
            <span className="w-1 h-1 bg-white/60 rounded-full hidden sm:block"></span>
            <span>
              {'title' in content ? 'Movie' : 'TV Show'}
            </span>
            <span className="w-1 h-1 bg-white/60 rounded-full hidden sm:block"></span>
            <span className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span>{content.vote_average?.toFixed(1)}</span>
            </span>
          </div>

          {/* Description - Mobile Responsive */}
          <p className={`text-sm sm:text-base lg:text-xl text-white/90 mb-4 sm:mb-8 leading-relaxed body-large drop-shadow-lg ${
            isMobile ? 'line-clamp-3' : 'line-clamp-4'
          }`}>
            {content.overview}
          </p>

          {/* Action Buttons - Mobile Responsive */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className={`flex items-center space-x-2 bg-white hover:bg-white/90 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isMobile ? 'px-4 py-2 text-sm' : 'px-6 sm:px-8 py-2 sm:py-3'
              }`}
            >
              {!isMobile && isPlaying ? <Pause size={isMobile ? 16 : 20} /> : <Play size={isMobile ? 16 : 20} />}
              <span className={isMobile ? 'block' : 'block'}>
                {isMobile ? 'Watch on YouTube' : (isPlaying ? 'Pause Trailer' : 'Play Trailer')}
              </span>
            </button>

            {/* More Info Button */}
            <button
              onClick={onMoreInfo}
              className={`flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-md ${
                isMobile ? 'px-4 py-2 text-sm' : 'px-6 sm:px-8 py-2 sm:py-3'
              }`}
            >
              <Info size={isMobile ? 16 : 20} />
              <span className={isMobile ? 'hidden' : 'block'}>More Info</span>
              {isMobile && <span>Info</span>}
            </button>

            {/* Add to Watchlist - Hidden on very small screens */}
            <button
              onClick={onAddToWatchlist}
              className={`items-center space-x-2 bg-transparent border-2 border-white/40 hover:border-white/60 text-white font-semibold rounded-lg transition-all duration-300 ${
                isMobile ? 'hidden sm:flex px-3 py-2 text-sm' : 'flex px-6 py-3'
              }`}
            >
              <Plus size={isMobile ? 16 : 20} />
              <span>Watchlist</span>
            </button>
          </div>

          {/* Video Controls */}
          {showControls && showVideo && (
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMute}
                className="p-2 bg-black/40 hover:bg-black/60 border border-white/20 rounded-full transition-all duration-300 backdrop-blur-md"
              >
                {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
              </button>
              
              <span className="text-white/60 text-sm">
                {currentVideo?.name || 'Official Trailer'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Skip Intro */}
      {showVideo && (
        <div className="absolute bottom-8 right-8 z-30">
          <button
            onClick={() => {
              setShowVideo(false);
              setIsPlaying(false);
            }}
            className="bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-md border border-white/20"
          >
            Skip Trailer
          </button>
        </div>
      )}
    </div>
  );
}
