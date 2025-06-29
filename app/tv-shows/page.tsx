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
import { Heart, Bookmark, Clock, Grid } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { useNavigationLoading } from "@/hooks/useNavigationLoading";
import ZeniXLoader from "@/components/ui/ZeniXLoader";

export default function TVShowsPage() {
  const [showAllTVShows, setShowAllTVShows] = useState(false);

  const { navigate } = useNavigationLoading();

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary page-transition font-netflix">
      <NavBar />
      <BannerSlider category="tv" />

      {/* Quick Access Links */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="heading-section text-white gradient-text mt-2 mb-4">
          TV Show Collections
        </h2>

        <div className="relative">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            <Button
              onClick={() => setShowAllTVShows(!showAllTVShows)}
              variant="accent"
              size="sm"
              icon={<Grid size={16} />}
              className="whitespace-nowrap bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 flex-shrink-0"
              ariaLabel={showAllTVShows ? 'Hide TV show grid' : 'Browse all TV shows'}
            >
              {showAllTVShows ? 'Hide Grid' : 'Browse All'}
            </Button>

            <Button
              onClick={() => navigate('/myspace?tab=favorites', 'Loading Favorites...')}
              variant="netflix"
              size="sm"
              icon={<Heart size={16} />}
              className="whitespace-nowrap flex-shrink-0"
              ariaLabel="View favorite TV shows"
            >
              Favorites
            </Button>

            <Button
              onClick={() => navigate('/myspace?tab=watchlist', 'Loading Watchlist...')}
              variant="accent"
              size="sm"
              icon={<Bookmark size={16} />}
              className="whitespace-nowrap bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 flex-shrink-0"
              ariaLabel="View TV show watchlist"
            >
              Watchlist
            </Button>

            <Button
              onClick={() => navigate('/myspace?tab=recent', 'Loading Recent Watches...')}
              variant="accent"
              size="sm"
              icon={<Clock size={16} />}
              className="whitespace-nowrap bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 flex-shrink-0"
              ariaLabel="View recent TV shows"
            >
              Recent
            </Button>
          </div>
        </div>
      </div>

      {/* Popular TV Shows Grid */}
      {showAllTVShows && (
        <div className="container mx-auto px-4 mb-12">
          <div className="mb-6">
            <h2 className="heading-section text-white gradient-text mb-2">
              Browse All TV Shows
            </h2>
            <div className="section-divider w-20"></div>
            <p className="text-gray-400 mt-2">
              Browse our extensive collection of TV shows organized by genre below
            </p>
          </div>
        </div>
      )}

      {/* Genre-based TV Show Sliders */}
      <div className="space-y-8">
        {genreBasedTVShows.map(({ id, genreId, title, cardWidth }: GenreSliderConfig) => (
          <Slider
            key={id}
            title={title}
            endpoint={`/discover/tv?with_genres=${genreId}`}
            cardWidth="w-[200px]"
            type="tv"
            category="tv-shows"
          />
        ))}
      </div>

      <Footer />
    </main>
  );
}
