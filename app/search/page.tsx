/**
 * Search Page Component
 * Provides search functionality with filters and displays trending content
 * Uses modern service layer, hooks, and utility patterns for maintainability
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter, Calendar, Star, Tag } from "lucide-react";

// Component imports using barrel exports
import { SearchResultItem, TrendingItem, FilterDropDown, NavBar, Footer } from "@/components";

// Constants and data imports
import {
  typeOptions,
  genreOptions,
  yearOptions,
  sortOptions,
} from "@/constants/searchData";

// Type imports using barrel exports
import type { Movie, TVShow } from "@/types";

// Service imports
import { TMDBService } from "@/services";

// Utility imports
import { getMediaTitle, getMediaType } from "@/utils/mediaUtils";

/**
 * Search filters interface
 */
interface SearchPageFilters {
  type: "all" | "movie" | "tv";
  genre: string;
  year: string;
  sortBy: string;
}

/**
 * Main Search Page Component
 */
const SearchPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // State management
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<SearchPageFilters>({
    type: "all",
    genre: "all",
    year: "all",
    sortBy: "popularity.desc",
  });

  const isSearching = searchQuery.trim().length > 0;

  /**
   * Load trending content on component mount
   */
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await TMDBService.getTrendingMovies("week");
        setTrending(data.results.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      }
    };
    loadTrending();
  }, []);

  /**
   * Handle initial search query from URL params
   */
  useEffect(() => {
    if (query && query.trim() !== "") {
      setSearchQuery(query);
      // Small delay to ensure state is updated
      setTimeout(() => {
        fetchResults();
      }, 100);
    }
  }, [query]); // Only run when the URL query changes

  /**
   * Fetch search results based on current query and filters
   */
  const fetchResults = useCallback(async () => {
    if (!isSearching) return;
    
    setIsLoading(true);
    try {
      let data;
      switch (filters.type) {
        case "movie":
          data = await TMDBService.searchMovies(searchQuery, currentPage);
          break;
        case "tv":
          data = await TMDBService.searchTVShows(searchQuery, currentPage);
          break;
        default:
          data = await TMDBService.searchMulti(searchQuery, currentPage);
          break;
      }

      // Filter out non-media results (persons, etc.)
      const validResults = data.results.filter(
        (item: any) => item.media_type === "movie" || item.media_type === "tv"
      );
      setResults(validResults);
      setTotalPages(Math.min(data.total_pages || 0, 100));
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentPage, filters, isSearching]);

  /**
   * Debounced search effect - handles both user input and initial URL query
   */
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeout = setTimeout(fetchResults, 300);
      return () => clearTimeout(timeout);
    } else {
      // Clear results when search query is empty
      setResults([]);
    }
  }, [fetchResults, searchQuery]);

  /**
   * Handle search input key events
   */
  const handleSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setCurrentPage(1);
      }
    },
    [searchQuery, router]
  );

  /**
   * Handle filter changes
   */
  const handleFilter = (key: keyof SearchPageFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  /**
   * Handle trending item click
   */
  const handleTrendingClick = (title: string) => {
    setSearchQuery(title);
    router.push(`/search?q=${encodeURIComponent(title)}`);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-netflix">
      <NavBar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-12 px-4 text-center relative">
        <div className="absolute inset-0 bg-gradient-netflix/10 pointer-events-none" />
        <motion.h1 
          className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-netflix-red to-netflix-red-light bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Find Your Next Favorite
        </motion.h1>
        
        <motion.p 
          className="text-text-muted text-lg mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Search through thousands of movies and TV shows to discover your next binge-watch
        </motion.p>

        {/* Search Input */}
        <motion.div 
          className="relative max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search movies, TV shows..."
            className="w-full pl-12 pr-12 py-4 glass-card border-glass-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-netflix-red transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <FilterDropDown
            title="Type"
            selected={filters.type}
            options={typeOptions}
            onSelect={(value) => handleFilter("type", value)}
            icon={Tag}
          />
          <FilterDropDown
            title="Genre"
            selected={filters.genre}
            options={genreOptions}
            onSelect={(value) => handleFilter("genre", value)}
            icon={Filter}
          />
          <FilterDropDown
            title="Year"
            selected={filters.year}
            options={yearOptions}
            onSelect={(value) => handleFilter("year", value)}
            icon={Calendar}
          />
          <FilterDropDown
            title="Sort By"
            selected={filters.sortBy}
            options={sortOptions}
            onSelect={(value) => handleFilter("sortBy", value)}
            icon={Star}
          />
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-12">
        {!isSearching ? (
          /* Trending Section */
          <div>
            <h2 className="text-2xl font-bold mb-6">Trending This Week</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map((item, index) => (
                <TrendingItem
                  key={item.id}
                  item={item as any}
                  onClick={handleTrendingClick}
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Search Results Section */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Search Results for "{searchQuery}"
              </h2>
              {results.length > 0 && (
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.map((item) => (
                    <SearchResultItem
                      key={item.id}
                      item={item}
                      isBookmarked={bookmarks.has(item.id)}
                      onBookmark={() => {
                        setBookmarks(prev => {
                          const newBookmarks = new Set(prev);
                          if (newBookmarks.has(item.id)) {
                            newBookmarks.delete(item.id);
                          } else {
                            newBookmarks.add(item.id);
                          }
                          return newBookmarks;
                        });
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 bg-pink-600 rounded-lg">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No results found for "{searchQuery}"
                </p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;


