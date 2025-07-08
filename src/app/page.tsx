"use client";

import { Suspense, useState, useEffect } from "react";
import NavBar from "@/components/common/NavBar";
import Slider from "@/components/shared/Slider";
import Footer from "@/components/common/Footer";
import HeroSlider from "@/components/ui/HeroSlider";
import { homeSliders } from "@/constants/config";
import { TMDBService } from "@/services/tmdb-api";
import { Movie, TVShow } from "@/types/tmdb";
import { MediaVideo } from "@/types/tmdb-types";

// Loading component for sliders
const SliderSkeleton = () => (
  <div className="px-4 sm:px-6 lg:px-8">
    <div className="h-6 bg-slate-700 rounded w-48 mb-4"></div>
    <div className="flex gap-4 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-[200px] h-[300px] bg-slate-700 rounded-lg flex-shrink-0"></div>
      ))}
    </div>
  </div>
);

export default function Home() {
  const [heroContentList, setHeroContentList] = useState<((Movie | TVShow) & { videos?: MediaVideo[] })[]>([]);
  const [showHeroSlider, setShowHeroSlider] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        // Fetch mixed trending content (movies + TV shows) for homepage
        const contentList = await TMDBService.getMixedTrendingWithVideos(5);
        setHeroContentList(contentList);
        
        // Show hero slider if there's content with trailers
        if (contentList.length > 0) {
          setShowHeroSlider(true);
        }
      } catch (error) {
        console.error('Failed to load hero content:', error);
        // Fallback to movies only if mixed content fails
        try {
          const movieContent = await TMDBService.getMultipleTrendingWithVideos('movie', 3);
          setHeroContentList(movieContent);
          if (movieContent.length > 0) {
            setShowHeroSlider(true);
          }
        } catch (fallbackError) {
          console.error('Fallback hero content also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadHeroContent();
  }, []);

  const handleAddToWatchlist = () => {
    // TODO: Implement add to watchlist functionality
    console.log('Add to watchlist clicked');
  };

  const handleMoreInfo = () => {
    // This will be handled by individual HeroVideoPlayer components in the slider
    console.log('More info clicked');
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary page-transition font-netflix">
      <NavBar />
      
      {/* Hero Slider Section - Mixed Content */}
      {showHeroSlider && heroContentList.length > 0 && !loading ? (
        <HeroSlider
          heroContent={heroContentList}
          autoPlay={true}
          autoSlide={true}
          slideInterval={15000}
        />
      ) : (
        <Suspense fallback={
          <div className="w-full h-screen bg-slate-800 animate-pulse flex items-center justify-center">
            <div className="text-white text-xl">Loading Mixed Content...</div>
          </div>
        }>
          <div className="w-full h-screen bg-slate-800 animate-pulse flex items-center justify-center">
            <div className="text-white text-xl">Loading Hero Content...</div>
          </div>
        </Suspense>
      )}
      
      <div className="space-y-12 pb-16">
        {homeSliders.map((slider) => (
          <Suspense key={slider.id} fallback={<SliderSkeleton />}>
            <Slider
              title={slider.title}
              endpoint={slider.endpoint}
              category={slider.category}
              autoScroll={slider.autoScroll}
              type={slider.type}
              cardWidth={slider.cardWidth}
            />
          </Suspense>
        ))}
      </div>

      <Footer />
    </main>
  );
}
