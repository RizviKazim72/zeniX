/**
 * Trending Page
 * Displays trending content organized by different time windows and genres
 * Uses optimized components and clean architecture patterns
 */

"use client";

import { NavBar, BannerSlider, Slider, Footer } from "@/components";
import { trendingSliders, trendingGenreSliders, getAllTrendingConfigs } from "@/constants/config";

/**
 * Trending Page Component
 * Uses the same layout structure as movies/TV pages for consistency
 */
export default function TrendingPage() {
  const allTrendingConfigs = getAllTrendingConfigs();

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary font-netflix">
      <NavBar />
      <BannerSlider category="trending" />

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
