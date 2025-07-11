/**
 * TMDB API Service - Centralized movie/TV data management
 * Handles all interactions with The Movie Database API
 */

import { tmdbApi } from "@/types/tmdb";
import type { 
  Movie, 
  TVShow, 
  MovieDetails, 
  TVDetails, 
  Genre,
  DetailsResponse,
  ApiResponse
} from "@/types";

import type {
  MediaVideo,
  MediaCredit,
  MediaReview
} from "@/types/tmdb-types";

interface SimpleVideosResponse {
  results: MediaVideo[];
}

interface SimpleCreditsResponse {
  cast: MediaCredit[];
  crew: MediaCredit[];
}

interface SimpleReviewsResponse {
  results: MediaReview[];
}

type Video = MediaVideo;
type Credit = MediaCredit;
type Review = MediaReview;

export class TMDBService {
  
  /**
   * Generic method to fetch data from any TMDB endpoint
   * This enables reusable data fetching across the application
   */
  static async fetchFromEndpoint<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      // Parse endpoint to extract any query parameters from the URL
      const [path, queryString] = endpoint.split('?');
      let combinedParams = { ...params };
      
      // If there are query parameters in the URL, extract and merge them
      if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        urlParams.forEach((value, key) => {
          combinedParams[key] = value;
        });
      }
      
      // Clean the path by removing leading slashes
      const cleanPath = path.replace(/^\/+/, '');
      
      console.log(`Fetching from: ${cleanPath} with params:`, combinedParams);
      
      // Use the dynamic method as a generic fetcher
      const response = await tmdbApi.dynamic<T>(cleanPath, combinedParams);
      return response;
    } catch (error) {
      console.error(`Error fetching from endpoint ${endpoint}:`, error);
      throw error;
    }
  }
  
  /**
   * Get movies by genre
   */
  static async getMoviesByGenre(genreId: number, page = 1): Promise<ApiResponse<Movie>> {
    try {
      return await tmdbApi.discoverMoviesByGenre(genreId, page);
    } catch (error) {
      console.error(`Error fetching movies for genre ${genreId}:`, error);
      throw error;
    }
  }

  /**
   * Get TV shows by genre
   */
  static async getTVShowsByGenre(genreId: number, page = 1): Promise<ApiResponse<TVShow>> {
    try {
      return await tmdbApi.discoverTVByGenre(genreId, page);
    } catch (error) {
      console.error(`Error fetching TV shows for genre ${genreId}:`, error);
      throw error;
    }
  }

  /**
   * Get both movies and TV shows by genre
   */
  static async getMediaByGenre(movieGenreId: number, tvGenreId: number, page = 1) {
    try {
      const [movies, tvShows] = await Promise.all([
        tmdbApi.discoverMoviesByGenre(movieGenreId, page),
        tmdbApi.discoverTVByGenre(tvGenreId, page)
      ]);
      
      return {
        movies,
        tvShows
      };
    } catch (error) {
      console.error(`Error fetching media for genres ${movieGenreId}/${tvGenreId}:`, error);
      throw error;
    }
  }

  // ===============================
  // MOVIES
  // ===============================
  
  /**
   * Get popular movies
   */
  static async getPopularMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    try {
      return await tmdbApi.moviesPopular(page);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw new Error("Failed to fetch popular movies");
    }
  }

  /**
   * Get top rated movies
   */
  static async getTopRatedMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    try {
      return await tmdbApi.moviesTopRated(page);
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      throw new Error("Failed to fetch top rated movies");
    }
  }

  /**
   * Get upcoming movies
   */
  static async getUpcomingMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    try {
      return await tmdbApi.moviesUpcoming(page);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      throw new Error("Failed to fetch upcoming movies");
    }
  }

  /**
   * Get now playing movies
   */
  static async getNowPlayingMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    try {
      return await tmdbApi.moviesNowPlaying(page);
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      throw new Error("Failed to fetch now playing movies");
    }
  }

  /**
   * Get movie details by ID
   */
  static async getMovieDetails(id: number): Promise<MovieDetails> {
    try {
      return await tmdbApi.movieById(id);
    } catch (error) {
      console.error(`Error fetching movie details for ID ${id}:`, error);
      throw new Error("Failed to fetch movie details");
    }
  }

  // ===============================
  // TV SHOWS
  // ===============================

  /**
   * Get popular TV shows
   */
  static async getPopularTVShows(page: number = 1): Promise<ApiResponse<TVShow>> {
    try {
      return await tmdbApi.tvPopular(page);
    } catch (error) {
      console.error("Error fetching popular TV shows:", error);
      throw new Error("Failed to fetch popular TV shows");
    }
  }

  /**
   * Get top rated TV shows
   */
  static async getTopRatedTVShows(page: number = 1): Promise<ApiResponse<TVShow>> {
    try {
      return await tmdbApi.tvTopRated(page);
    } catch (error) {
      console.error("Error fetching top rated TV shows:", error);
      throw new Error("Failed to fetch top rated TV shows");
    }
  }

  /**
   * Get TV shows airing today
   */
  static async getTVShowsAiringToday(page: number = 1): Promise<ApiResponse<TVShow>> {
    try {
      return await tmdbApi.tvAiringToday(page);
    } catch (error) {
      console.error("Error fetching TV shows airing today:", error);
      throw new Error("Failed to fetch TV shows airing today");
    }
  }

  /**
   * Get TV shows on the air
   */
  static async getTVShowsOnTheAir(page: number = 1): Promise<ApiResponse<TVShow>> {
    try {
      return await tmdbApi.tvOnTheAir(page);
    } catch (error) {
      console.error("Error fetching TV shows on the air:", error);
      throw new Error("Failed to fetch TV shows on the air");
    }
  }

  /**
   * Get TV show details by ID
   */
  static async getTVShowDetails(id: number): Promise<TVDetails> {
    try {
      return await tmdbApi.tvById(id);
    } catch (error) {
      console.error(`Error fetching TV show details for ID ${id}:`, error);
      throw new Error("Failed to fetch TV show details");
    }
  }

  // ===============================
  // TRENDING
  // ===============================

  /**
   * Get trending movies
   */
  static async getTrendingMovies(
    timeWindow: "day" | "week" = "week", 
    page: number = 1
  ): Promise<ApiResponse<Movie>> {
    try {
      return await tmdbApi.trendingMovies(timeWindow, page);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      throw new Error("Failed to fetch trending movies");
    }
  }

  /**
   * Get trending TV shows
   */
  static async getTrendingTVShows(
    timeWindow: "day" | "week" = "week", 
    page: number = 1
  ): Promise<ApiResponse<TVShow>> {
    try {
      return await tmdbApi.trendingTV(timeWindow, page);
    } catch (error) {
      console.error("Error fetching trending TV shows:", error);
      throw new Error("Failed to fetch trending TV shows");
    }
  }

  // ===============================
  // DISCOVER & GENRES
  // ===============================

  /**
   * Discover movies by genre
   */
  static async discoverMoviesByGenre(
    genreId: number, 
    page: number = 1
  ): Promise<ApiResponse<Movie>> {
    try {
      return await tmdbApi.discoverMoviesByGenre(genreId, page);
    } catch (error) {
      console.error(`Error discovering movies for genre ${genreId}:`, error);
      throw new Error("Failed to discover movies by genre");
    }
  }

  /**
   * Discover TV shows by genre
   */
  static async discoverTVShowsByGenre(
    genreId: number, 
    page: number = 1
  ): Promise<ApiResponse<TVShow>> {
    try {
      return await tmdbApi.discoverTVByGenre(genreId, page);
    } catch (error) {
      console.error(`Error discovering TV shows for genre ${genreId}:`, error);
      throw new Error("Failed to discover TV shows by genre");
    }
  }

  /**
   * Get movie genres
   */
  static async getMovieGenres(): Promise<Genre[]> {
    try {
      return await tmdbApi.getMovieGenres();
    } catch (error) {
      console.error("Error fetching movie genres:", error);
      throw new Error("Failed to fetch movie genres");
    }
  }

  /**
   * Get TV genres
   */
  static async getTVGenres(): Promise<Genre[]> {
    try {
      return await tmdbApi.getTVGenres();
    } catch (error) {
      console.error("Error fetching TV genres:", error);
      throw new Error("Failed to fetch TV genres");
    }
  }

  // ===============================
  // SEARCH
  // ===============================

  /**
   * Search movies
   */
  static async searchMovies(
    query: string, 
    page: number = 1
  ): Promise<ApiResponse<Movie>> {
    try {
      return await tmdbApi.searchMovies(query, page);
    } catch (error) {
      console.error(`Error searching movies for query "${query}":`, error);
      throw new Error("Failed to search movies");
    }
  }

  /**
   * Search TV shows
   */
  static async searchTVShows(
    query: string, 
    page: number = 1
  ): Promise<ApiResponse<TVShow>> {
    try {
      return await tmdbApi.searchTVShows(query, page);
    } catch (error) {
      console.error(`Error searching TV shows for query "${query}":`, error);
      throw new Error("Failed to search TV shows");
    }
  }

  /**
   * Multi search (movies, TV shows, people)
   */
  static async searchMulti(
    query: string, 
    page: number = 1
  ): Promise<ApiResponse<any>> {
    try {
      return await tmdbApi.searchMulti(query, page);
    } catch (error) {
      console.error(`Error in multi search for query "${query}":`, error);
      throw new Error("Failed to perform multi search");
    }
  }

  // ===============================
  // MEDIA DETAILS (VIDEOS, CREDITS, REVIEWS)
  // ===============================

  /**
   * Get videos for movie or TV show
   */
  static async getVideos(
    id: number, 
    type: "movie" | "tv"
  ): Promise<Video[]> {
    try {
      const response: SimpleVideosResponse = type === "movie" 
        ? await tmdbApi.movieVideos(id)
        : await tmdbApi.tvVideos(id);
      return response.results;
    } catch (error) {
      console.error(`Error fetching videos for ${type} ID ${id}:`, error);
      throw new Error("Failed to fetch videos");
    }
  }

  /**
   * Get credits for movie or TV show
   */
  static async getCredits(
    id: number, 
    type: "movie" | "tv"
  ): Promise<SimpleCreditsResponse> {
    try {
      return type === "movie" 
        ? await tmdbApi.movieCredits(id)
        : await tmdbApi.tvCredits(id);
    } catch (error) {
      console.error(`Error fetching credits for ${type} ID ${id}:`, error);
      throw new Error("Failed to fetch credits");
    }
  }

  /**
   * Get similar movies or TV shows
   */
  static async getSimilar(
    id: number, 
    type: "movie" | "tv"
  ): Promise<(Movie | TVShow)[]> {
    try {
      const endpoint = `${type}/${id}/similar`;
      const response: ApiResponse<Movie | TVShow> = await tmdbApi.dynamic(endpoint);
      return response.results;
    } catch (error) {
      console.error(`Error fetching similar ${type}s for ID ${id}:`, error);
      throw new Error("Failed to fetch similar content");
    }
  }

  /**
   * Get reviews for movie or TV show
   */
  static async getReviews(
    id: number, 
    type: "movie" | "tv"
  ): Promise<Review[]> {
    try {
      const endpoint = `${type}/${id}/reviews`;
      const response: SimpleReviewsResponse = await tmdbApi.dynamic(endpoint);
      return response.results;
    } catch (error) {
      console.error(`Error fetching reviews for ${type} ID ${id}:`, error);
      throw new Error("Failed to fetch reviews");
    }
  }

  // ===============================
  // DYNAMIC ENDPOINT
  // ===============================

  /**
   * Generic dynamic endpoint call
   */
  static async dynamic<T = any>(
    endpoint: string, 
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      return await tmdbApi.dynamic<T>(endpoint, params);
    } catch (error) {
      console.error(`Error calling dynamic endpoint ${endpoint}:`, error);
      throw new Error(`Failed to call endpoint: ${endpoint}`);
    }
  }

  // ===============================
  // BULK OPERATIONS
  // ===============================

  /**
   * Get all data for a movie/TV show page
   */
  static async getMediaPageData(
    id: number, 
    type: "movie" | "tv"
  ): Promise<{
    details: DetailsResponse;
    videos: Video[];
    credits: SimpleCreditsResponse;
    similar: (Movie | TVShow)[];
    reviews: Review[];
  }> {
    try {
      const [details, videos, credits, similar, reviews] = await Promise.all([
        type === "movie" ? this.getMovieDetails(id) : this.getTVShowDetails(id),
        this.getVideos(id, type),
        this.getCredits(id, type),
        this.getSimilar(id, type),
        this.getReviews(id, type)
      ]);

      return {
        details,
        videos,
        credits,
        similar,
        reviews
      };
    } catch (error) {
      console.error(`Error fetching media page data for ${type} ID ${id}:`, error);
      throw new Error("Failed to fetch media page data");
    }
  }

  /**
   * Get trending content for homepage
   */
  static async getTrendingContent(): Promise<{
    trendingMovies: Movie[];
    trendingTVShows: TVShow[];
  }> {
    try {
      const [moviesResponse, tvResponse] = await Promise.all([
        this.getTrendingMovies("week", 1),
        this.getTrendingTVShows("week", 1)
      ]);

      return {
        trendingMovies: moviesResponse.results,
        trendingTVShows: tvResponse.results
      };
    } catch (error) {
      console.error("Error fetching trending content:", error);
      throw new Error("Failed to fetch trending content");
    }
  }

  // ===============================
  // ADDITIONAL METHODS FOR RECOMMENDATIONS
  // ===============================

  /**
   * Generic discover method for recommendations
   */
  static async discover(
    mediaType: 'movie' | 'tv', 
    params: Record<string, string>
  ): Promise<ApiResponse<Movie | TVShow>> {
    try {
      const endpoint = `discover/${mediaType}`;
      return await tmdbApi.dynamic(endpoint, params);
    } catch (error) {
      console.error(`Error discovering ${mediaType}:`, error);
      throw new Error(`Failed to discover ${mediaType}`);
    }
  }

  /**
   * Generic getTrending method
   */
  static async getTrending(
    mediaType: 'movie' | 'tv', 
    timeWindow: 'day' | 'week' = 'week'
  ): Promise<ApiResponse<Movie | TVShow>> {
    try {
      const endpoint = `trending/${mediaType}/${timeWindow}`;
      return await tmdbApi.dynamic(endpoint);
    } catch (error) {
      console.error(`Error fetching trending ${mediaType}:`, error);
      throw new Error(`Failed to fetch trending ${mediaType}`);
    }
  }

  /**
   * Get videos for a movie (trailers, teasers, clips)
   */
  static async getMovieVideos(movieId: number): Promise<MediaVideo[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch movie videos: ${response.statusText}`);
      }
      
      const data: SimpleVideosResponse = await response.json();
      
      // Filter for YouTube videos and prioritize trailers
      return data.results
        .filter(video => video.site === 'YouTube')
        .sort((a, b) => {
          // Prioritize official trailers
          if (a.type === 'Trailer' && b.type !== 'Trailer') return -1;
          if (b.type === 'Trailer' && a.type !== 'Trailer') return 1;
          return 0;
        });
    } catch (error) {
      console.error(`Error fetching videos for movie ${movieId}:`, error);
      return [];
    }
  }

  /**
   * Get videos for a TV show (trailers, teasers, clips)
   */
  static async getTVVideos(tvId: number): Promise<MediaVideo[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/${tvId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch TV videos: ${response.statusText}`);
      }
      
      const data: SimpleVideosResponse = await response.json();
      
      // Filter for YouTube videos and prioritize trailers
      return data.results
        .filter(video => video.site === 'YouTube')
        .sort((a, b) => {
          // Prioritize official trailers
          if (a.type === 'Trailer' && b.type !== 'Trailer') return -1;
          if (b.type === 'Trailer' && a.type !== 'Trailer') return 1;
          return 0;
        });
    } catch (error) {
      console.error(`Error fetching videos for TV show ${tvId}:`, error);
      return [];
    }
  }

  /**
   * Get trending content with videos for hero section
   */
  static async getTrendingWithVideos(mediaType: 'movie' | 'tv' = 'movie'): Promise<(Movie | TVShow) & { videos?: MediaVideo[] }> {
    try {
      const trendingResponse = mediaType === 'movie' 
        ? await this.getTrendingMovies()
        : await this.getTrendingTVShows();
      
      if (trendingResponse.results.length === 0) {
        throw new Error('No trending content found');
      }
      
      // Get the first trending item
      const heroContent = trendingResponse.results[0];
      
      // Fetch videos for this content
      const videos = mediaType === 'movie' 
        ? await this.getMovieVideos(heroContent.id)
        : await this.getTVVideos(heroContent.id);
      
      return {
        ...heroContent,
        videos
      };
    } catch (error) {
      console.error('Error fetching trending content with videos:', error);
      throw error;
    }
  }

  /**
   * Get multiple trending content with videos for hero slider
   */
  static async getMultipleTrendingWithVideos(
    mediaType: 'movie' | 'tv' = 'movie',
    count: number = 5
  ): Promise<((Movie | TVShow) & { videos?: MediaVideo[] })[]> {
    try {
      const trendingResponse = mediaType === 'movie' 
        ? await this.getTrendingMovies()
        : await this.getTrendingTVShows();
      
      if (trendingResponse.results.length === 0) {
        throw new Error('No trending content found');
      }
      
      // Get top trending items (limit by count)
      const topContent = trendingResponse.results.slice(0, count);
      
      // Fetch videos for each content item
      const contentWithVideos = await Promise.all(
        topContent.map(async (content) => {
          try {
            const videos = mediaType === 'movie' 
              ? await this.getMovieVideos(content.id)
              : await this.getTVVideos(content.id);
            
            return {
              ...content,
              videos
            };
          } catch (error) {
            console.error(`Failed to fetch videos for ${mediaType} ${content.id}:`, error);
            // Return content without videos if video fetch fails
            return {
              ...content,
              videos: []
            };
          }
        })
      );
      
      // Filter out content that doesn't have any videos (optional)
      return contentWithVideos.filter(content => 
        content.videos && content.videos.length > 0
      );
    } catch (error) {
      console.error('Error fetching multiple trending content with videos:', error);
      throw error;
    }
  }

  /**
   * Get mixed trending content (movies + TV shows) for homepage hero slider
   */
  static async getMixedTrendingWithVideos(count: number = 5): Promise<((Movie | TVShow) & { videos?: MediaVideo[] })[]> {
    try {
      // Get both movies and TV shows
      const [moviesResponse, tvResponse] = await Promise.all([
        this.getTrendingMovies(),
        this.getTrendingTVShows()
      ]);
      
      if (moviesResponse.results.length === 0 && tvResponse.results.length === 0) {
        throw new Error('No trending content found');
      }
      
      // Mix movies and TV shows, take top items from each
      const mixedContent = [
        ...moviesResponse.results.slice(0, Math.ceil(count / 2)),
        ...tvResponse.results.slice(0, Math.floor(count / 2))
      ].slice(0, count);
      
      // Fetch videos for each content item
      const contentWithVideos = await Promise.all(
        mixedContent.map(async (content) => {
          try {
            // Determine if it's a movie or TV show
            const isMovie = 'title' in content;
            const videos = isMovie 
              ? await this.getMovieVideos(content.id)
              : await this.getTVVideos(content.id);
            
            return {
              ...content,
              videos
            };
          } catch (error) {
            console.error(`Failed to fetch videos for content ${content.id}:`, error);
            // Return content without videos if video fetch fails
            return {
              ...content,
              videos: []
            };
          }
        })
      );
      
      // Filter out content that doesn't have any videos and shuffle for variety
      const contentWithTrailers = contentWithVideos.filter(content => 
        content.videos && content.videos.length > 0
      );
      
      // Shuffle array for more variety
      return contentWithTrailers.sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error('Error fetching mixed trending content with videos:', error);
      throw error;
    }
  }

  /**
   * Get fallback recommendations when personalized recommendations fail
   * This ensures users always see content even if recommendation engine fails
   */
  static async getFallbackRecommendations(count: number = 12): Promise<(Movie | TVShow)[]> {
    try {
      // Try to get popular movies as fallback
      const popularMovies = await this.getPopularMovies();
      
      if (popularMovies && popularMovies.results && popularMovies.results.length > 0) {
        return popularMovies.results.slice(0, count);
      }
      
      // If that fails, try trending as a second fallback
      const trending = await this.getTrendingMovies();
      if (trending && trending.results && trending.results.length > 0) {
        return trending.results.slice(0, count);
      }
      
      return [];
    } catch (error) {
      console.error("Failed to get fallback recommendations:", error);
      return [];
    }
  }
}

export default TMDBService;
