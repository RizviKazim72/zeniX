/**
 * Trending Page
 * Displays trending content organized by different time windows and genres
 * Uses optimized components and clean architecture patterns
 */

"use client";

import { Suspense, useState, useEffect } from "react";
import { NavBar, Slider, Footer } from "@/components";
import HeroSlider from "@/components/ui/HeroSlider";
import { trendingSliders, trendingGenreSliders } from "@/constants/config";
import { TMDBService } from "@/services/tmdb-api";
import { Movie, TVShow } from "@/types/tmdb";
import { MediaVideo } from "@/types/tmdb-types";

/**
 * Trending Page Component
 * Uses mixed trending content for hero slider
 */
export default function TrendingPage() {
  const [heroTrendingContent, setHeroTrendingContent] = useState<((Movie | TVShow) & { videos?: MediaVideo[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingHeroContent = async () => {
      try {
        const trendingContent = await TMDBService.getMixedTrendingWithVideos(5);
        setHeroTrendingContent(trendingContent);
      } catch (error) {
        console.error('Failed to load trending hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingHeroContent();
  }, []);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary font-netflix">
      <NavBar />
      
      {/* Hero Slider - Mixed Trending Content */}
      {heroTrendingContent.length > 0 && !loading ? (
        <HeroSlider
          heroContent={heroTrendingContent}
          autoPlay={true}
          autoSlide={true}
          slideInterval={15000}
        />
      ) : (
        <div className="w-full h-screen bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="text-white text-xl">Loading Trending Content...</div>
        </div>
      )}

      {/* Main Trending Sliders */}
      {trendingSliders.map((config) => (
        <Slider
          key={config.id}
          title={config.title}
          endpoint={config.endpoint}
          cardWidth={config.cardWidth}
          type={config.type}
          category={config.category}
          autoScroll={config.autoScroll}
        />
      ))}

      {/* Popular and Top Rated Content */}
      <Slider
        title="Popular Movies"
        endpoint="/movie/popular"
        cardWidth="w-[200px]"
        type="movie"
        category="popular-movies"
      />

      <Slider
        title="Popular TV Shows"
        endpoint="/tv/popular"
        cardWidth="w-[200px]"
        type="tv"
        category="popular-tv"
      />

      <Slider
        title="Top Rated Movies"
        endpoint="/movie/top_rated"
        cardWidth="w-[200px]"
        type="movie"
        category="top-rated-movies"
      />

      <Slider
        title="Top Rated TV Shows"
        endpoint="/tv/top_rated"
        cardWidth="w-[200px]"
        type="tv"
        category="top-rated-tv"
      />

      {/* Genre-based Trending Sliders */}
      {trendingGenreSliders.map((config) => (
        <Slider
          key={config.id}
          title={config.title}
          endpoint={config.endpoint}
          cardWidth={config.cardWidth}
          type={config.type}
          category={config.category}
          autoScroll={config.autoScroll}
        />
      ))}

      <Footer />
    </main>
  );
}
