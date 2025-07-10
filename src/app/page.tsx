"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/common/PageLayout";
import Slider from "@/components/shared/Slider";
import HeroSlider from "@/components/ui/HeroSlider";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { homeSliders } from "@/constants/config";
import { TMDBService } from "@/services/tmdb-api";
import { recommendationService } from "@/services/recommendationService";
import { useAuth, UserMediaItem } from "@/context/AuthContext";
import { Movie, TVShow } from "@/types/tmdb";
import { MediaVideo } from "@/types/tmdb-types";

// Import skeleton loaders for consistent loading UI
import { 
  MediaRowSkeleton, 
  HeroSkeleton, 
  MediaGridSkeleton 
} from "@/components/ui/SkeletonLoaders";
// Media card with progress for Continue Watching section
const ContinueWatchingCard = ({ item }: { item: UserMediaItem }) => {
  const router = useRouter();
  const progress = item.progress || Math.floor(Math.random() * 80) + 10;
  
  return (
    <div
      className="relative cursor-pointer transition-transform hover:scale-105 duration-200"
      onClick={() => router.push(`/${item.type === 'movie' ? 'movies' : 'tv-shows'}/${item.id}`)}
    >
      <div className="aspect-[2/3] rounded-lg overflow-hidden">
        <OptimizedImage
          src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/images/placeholder-poster.jpg'}
          alt={item.title || item.name || ""}
          fill={true}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
        />
        
        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 
          flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="bg-red-600 text-white rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
        
        {item.type === 'tv' && item.episodeNumber && (
          <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 text-xs rounded">
            S{item.seasonNumber || 1}:E{item.episodeNumber}
          </div>
        )}
      </div>
      
      <h3 className="mt-2 text-sm font-medium text-white truncate">
        {item.title || item.name || ""}
      </h3>
      
      <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-600 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// Continue Watching section component
const ContinueWatchingSection = ({ items }: { items: UserMediaItem[] }) => {
  if (!items.length) return null;
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12 mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-white">Continue Watching</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <ContinueWatchingCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
};

// Reusable media grid component
const MediaGrid = ({ 
  title, 
  items 
}: { 
  title: string; 
  items: UserMediaItem[] 
}) => {
  const router = useRouter();
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12 mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <div 
            key={`${item.type}-${item.id}`}
            className="transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => router.push(`/${item.type === 'movie' ? 'movies' : 'tv-shows'}/${item.id}`)}
          >
            <OptimizedImage
              src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/images/placeholder-poster.jpg'}
              alt={item.title || ""}
              className="aspect-[2/3] rounded-lg cursor-pointer"
              fill={false}
              width={220}
              height={330}
            />
            <h3 className="mt-2 text-sm font-medium text-white truncate">
              {item.title || ""}
            </h3>
            {item.genres && item.genres.length > 0 && (
              <p className="text-xs text-gray-400 truncate">
                {item.genres.slice(0, 2).join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [heroContentList, setHeroContentList] = useState<((Movie | TVShow) & { videos?: MediaVideo[] })[]>([]);
  const [showHeroSlider, setShowHeroSlider] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<UserMediaItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<UserMediaItem[]>([]);
  const [userContentLoading, setUserContentLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        // Fetch mixed trending content for homepage
        const contentList = await TMDBService.getMixedTrendingWithVideos(5);
        setHeroContentList(contentList);
        setShowHeroSlider(contentList.length > 0);
      } catch (error) {
        console.error('Failed to load hero content:', error);
        // Fallback to movies only if mixed content fails
        try {
          const movieContent = await TMDBService.getMultipleTrendingWithVideos('movie', 3);
          setHeroContentList(movieContent);
          setShowHeroSlider(movieContent.length > 0);
        } catch (fallbackError) {
          console.error('Fallback hero content also failed');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadHeroContent();
    
    // Load user-specific content if logged in
    if (user) {
      loadUserSpecificContent();
    }
  }, [user]);
  
  // Load user-specific recommendations and continue watching
  const loadUserSpecificContent = async () => {
    if (!user) return;
    
    setUserContentLoading(true);
    
    try {
      // Process continue watching section
      if (user.recentWatches && user.recentWatches.length > 0) {
        setContinueWatching(
          [...user.recentWatches]
            .sort((a, b) => new Date(b.watchedAt || '').getTime() - new Date(a.watchedAt || '').getTime())
            .slice(0, 6)
        );
      }
      
      // Process personalized recommendations
      if (user.favorites || user.watchlist || user.recentWatches) {
        const userBehavior = {
          favorites: user.favorites || [],
          watchlist: user.watchlist || [],
          recentWatches: user.recentWatches || [],
          ratings: [],
          preferences: {
            favoriteGenres: user.preferences?.favoriteGenres || [],
            preferredLanguage: user.preferences?.preferredLanguage || 'en'
          }
        };
        
        try {
          // Try to get personalized recommendations first
          const recs = await recommendationService.getPersonalizedRecommendations(userBehavior, 12);
          
          if (recs?.length > 0) {
            setRecommendations(recs.map(rec => ({
              id: rec.mediaId,
              type: rec.mediaType,
              title: rec.title,
              poster_path: rec.posterPath,
              genres: rec.genres
            })));
          } else {
            // Fallback to generic recommendations if needed
            await loadFallbackRecommendations();
          }
        } catch (recError) {
          // Fallback on error
          await loadFallbackRecommendations();
        }
      }
    } catch (error) {
      console.error('Failed to load user-specific content');
    } finally {
      setUserContentLoading(false);
    }
  };
  
  // Helper function to load fallback recommendations
  const loadFallbackRecommendations = async () => {
    try {
      const fallbackRecs = await TMDBService.getFallbackRecommendations(12);
      setRecommendations(fallbackRecs.map(movie => ({
        id: movie.id,
        type: 'title' in movie ? 'movie' : 'tv',
        title: 'title' in movie ? movie.title : movie.name,
        poster_path: movie.poster_path,
        genres: []
      })));
    } catch (error) {
      console.error('Failed to load fallback recommendations');
    }
  };



  return (
    <PageLayout>
      {/* Hero Slider Section */}
      <Suspense fallback={<HeroSkeleton />}>
        {showHeroSlider && heroContentList.length > 0 && !loading ? (
          <HeroSlider
            heroContent={heroContentList}
            autoPlay={true}
            autoSlide={true}
            slideInterval={15000}
          />
        ) : (
          <HeroSkeleton />
        )}
      </Suspense>
      
      {/* Continue Watching - Only for logged in users */}
      {user && (
        <Suspense fallback={
          <div className="px-4 sm:px-6 lg:px-8 mt-12 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-white">Continue Watching</h2>
            <MediaGridSkeleton columns={6} rows={1} />
          </div>
        }>
          {continueWatching.length > 0 && <ContinueWatchingSection items={continueWatching} />}
          {userContentLoading && continueWatching.length === 0 && (
            <div className="px-4 sm:px-6 lg:px-8 mt-12 mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-white">Continue Watching</h2>
              <MediaGridSkeleton columns={6} rows={1} />
            </div>
          )}
        </Suspense>
      )}
      
      {/* Personalized Recommendations - Only for logged in users */}
      {user && (
        <Suspense fallback={
          <div className="px-4 sm:px-6 lg:px-8 mt-12 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-white">Recommended For You</h2>
            <MediaGridSkeleton columns={6} rows={1} />
          </div>
        }>
          {recommendations.length > 0 && <MediaGrid title="Recommended For You" items={recommendations} />}
          {userContentLoading && recommendations.length === 0 && (
            <div className="px-4 sm:px-6 lg:px-8 mt-12 mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-white">Recommended For You</h2>
              <MediaGridSkeleton columns={6} rows={1} />
            </div>
          )}
        </Suspense>
      )}
      
      {/* Regular content sliders */}
      <div className="space-y-12 pb-16">
        {homeSliders.map((slider) => (
          <Suspense key={slider.id} fallback={<MediaRowSkeleton />}>
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
    </PageLayout>
  );
}
