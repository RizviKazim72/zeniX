/**
 * TV Shows Page
 * Displays TV shows organized by genres with consistent design patterns
 * Follows DRY principles and matches movies page layout exactly
 */

"use client";

import NavBar from "@/components/common/NavBar";
import BannerSlider from "@/components/shared/BannerSlider";
import { genreBasedTVShows, GenreSliderConfig } from "@/constants/config";
import Slider from "@/components/shared/Slider";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { Heart, Bookmark, Clock, Grid } from "lucide-react";
import { useState } from "react";

import ScrollAnimationWrapper from "@/components/ui/ScrollAnimationWrapper";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import Button from "@/components/ui/Button";
import { usePopularTVShows } from "@/hooks/useMediaData";
import { useNavigationLoading } from "@/hooks/useNavigationLoading";
import { SkeletonGrid } from "@/components/ui/Loading";

/**
 * TV Shows Page Component
 * Uses the same layout structure as movies page for consistency
 */
export default function TVShowsPage() {
  const [showAllShows, setShowAllShows] = useState(false);
  const { 
    data: popularShows, 
    loading, 
    hasMore, 
    loadMore 
  } = usePopularTVShows();

  const { navigate } = useNavigationLoading();

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary page-transition font-netflix">
      <NavBar />
      <BannerSlider category="tv" />

      {/* Quick Access Links */}
      <ScrollAnimationWrapper delay={200}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-section text-white gradient-text">TV Show Collections</h2>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowAllShows(!showAllShows)}
                variant="accent"
                size="sm"
                icon={<Grid size={16} />}
                className="bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                ariaLabel={showAllShows ? 'Hide TV shows grid' : 'Browse all TV shows'}
              >
                {showAllShows ? 'Hide Grid' : 'Browse All'}
              </Button>
              
              <Button
                onClick={() => navigate('/myspace?tab=favorites', 'Loading Favorites...')}
                variant="netflix"
                size="sm"
                icon={<Heart size={16} />}
                glow
                ariaLabel="View my favorite TV shows"
              >
                My Favorites
              </Button>
              
              <Button
                onClick={() => navigate('/myspace?tab=watchlist', 'Loading Watchlist...')}
                variant="accent"
                size="sm"
                icon={<Bookmark size={16} />}
                className="bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                ariaLabel="View my watchlist"
              >
                Watchlist
              </Button>
              
              <Button
                onClick={() => navigate('/myspace?tab=recent', 'Loading Recent Watches...')}
                variant="accent"
                size="sm"
                icon={<Clock size={16} />}
                className="bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
                ariaLabel="View recent watches"
              >
                Recent
              </Button>
            </div>
          </div>
        </div>
      </ScrollAnimationWrapper>

      {/* Popular TV Shows Grid with Infinite Scroll */}
      {showAllShows && (
        <ScrollAnimationWrapper 
          delay={300}
          fallback={<div className="container mx-auto px-4 mb-12"><SkeletonGrid count={12} /></div>}
        >
          <div className="container mx-auto px-4 mb-12">
            <div className="mb-6">
              <h2 className="heading-section text-white gradient-text mb-2">
                Popular TV Shows
              </h2>
              <div className="section-divider w-20"></div>
            </div>
            
            <InfiniteScroll
              hasMore={hasMore}
              loadMore={loadMore}
              loading={loading}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {popularShows.map((show, index) => (
                  <div 
                    key={show.id}
                    className="smooth-reveal visible"
                    style={{ animationDelay: `${(index % 6) * 0.1}s` }}
                  >
                    <Link 
                      href={`/tv-shows/${show.id}`}
                      className="block bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden transition-all duration-300 card-hover"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                          alt={show.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button className="p-3 bg-netflix-red rounded-full hover:bg-netflix-red-dark transition-colors">
                            <div className="w-6 h-6 text-white">▶</div>
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                          {show.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span>⭐ {show.vote_average?.toFixed(1)}</span>
                          <span>•</span>
                          <span>{show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </ScrollAnimationWrapper>
      )}

      <div className="space-y-8">
        {genreBasedTVShows.map(({ id, genreId, title, cardWidth }: GenreSliderConfig, index: number) => (
          <ScrollAnimationWrapper 
            key={id} 
            delay={index * 100}
            animationClass="smooth-reveal"
          >
            <Slider
              title={title}
              endpoint={`/discover/tv?with_genres=${genreId}`}
              cardWidth={"w-[200px]"}
              type="tv"
              category="tv-shows"
            />
          </ScrollAnimationWrapper>
        ))}
      </div>

      <Footer />
    </main>
  );
}
