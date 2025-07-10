'use client';

import { useState, useEffect, useCallback } from 'react';
import { TMDBService } from '@/services/tmdb-api';

interface UseTMDBEndpointReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching data from TMDB API endpoints
 * Handles loading states, errors, and caching for optimal performance
 */
export function useTMDBEndpoint<T>(endpoint: string): UseTMDBEndpointReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Map endpoint to appropriate TMDBService method
      let result;
      
      // Handle different endpoint patterns
      if (endpoint === '/movie/popular') {
        result = await TMDBService.getPopularMovies();
      } else if (endpoint === '/movie/top_rated') {
        result = await TMDBService.getTopRatedMovies();
      } else if (endpoint === '/movie/upcoming') {
        result = await TMDBService.getUpcomingMovies();
      } else if (endpoint === '/movie/now_playing') {
        result = await TMDBService.getNowPlayingMovies();
      } else if (endpoint === '/tv/popular') {
        result = await TMDBService.getPopularTVShows();
      } else if (endpoint === '/tv/top_rated') {
        result = await TMDBService.getTopRatedTVShows();
      } else if (endpoint === '/tv/on_the_air') {
        result = await TMDBService.getTVShowsOnTheAir();
      } else if (endpoint === '/tv/airing_today') {
        result = await TMDBService.getTVShowsAiringToday();
      } else if (endpoint.includes('trending/all')) {
        result = await TMDBService.getTrendingContent();
      } else if (endpoint.includes('trending/movie')) {
        result = await TMDBService.getTrendingMovies();
      } else if (endpoint.includes('trending/tv')) {
        result = await TMDBService.getTrendingTVShows();
      } else if (endpoint.startsWith('/discover/movie')) {
        // Handle discover/movie endpoint with genre parameter
        try {
          // Try to parse the genre ID from the URL
          const urlParts = endpoint.split('?');
          if (urlParts.length > 1) {
            const genreParam = new URLSearchParams(urlParts[1]);
            const genreId = parseInt(genreParam.get('with_genres') || '0');
            if (genreId) {
              result = await TMDBService.discoverMoviesByGenre(genreId);
            } else {
              throw new Error('Invalid genre ID');
            }
          } else {
            throw new Error('Missing genre parameter');
          }
        } catch (parseError) {
          console.error('Error parsing discover/movie endpoint:', parseError);
          // Extract genreId manually as fallback
          const genreIdMatch = endpoint.match(/with_genres=(\d+)/);
          const genreId = genreIdMatch ? parseInt(genreIdMatch[1]) : 0;
          if (genreId) {
            result = await TMDBService.discoverMoviesByGenre(genreId);
          } else {
            throw new Error('Could not extract genre ID from endpoint');
          }
        }
      } else if (endpoint.startsWith('/discover/tv')) {
        // Handle discover/tv endpoint with genre parameter
        try {
          // Try to parse the genre ID from the URL
          const urlParts = endpoint.split('?');
          if (urlParts.length > 1) {
            const genreParam = new URLSearchParams(urlParts[1]);
            const genreId = parseInt(genreParam.get('with_genres') || '0');
            if (genreId) {
              result = await TMDBService.discoverTVShowsByGenre(genreId);
            } else {
              throw new Error('Invalid genre ID');
            }
          } else {
            throw new Error('Missing genre parameter');
          }
        } catch (parseError) {
          console.error('Error parsing discover/tv endpoint:', parseError);
          // Extract genreId manually as fallback
          const genreIdMatch = endpoint.match(/with_genres=(\d+)/);
          const genreId = genreIdMatch ? parseInt(genreIdMatch[1]) : 0;
          if (genreId) {
            result = await TMDBService.discoverTVShowsByGenre(genreId);
          } else {
            throw new Error('Could not extract genre ID from endpoint');
          }
        }
      } else {
        // Default case - use the enhanced fetchFromEndpoint method
        console.warn(`No direct mapping for endpoint: ${endpoint}, using fetchFromEndpoint`);
        result = await TMDBService.fetchFromEndpoint(endpoint);
      }
      
      // Data fetched successfully
      setData(result as T);
    } catch (err: any) {
      console.error(`Error fetching from endpoint ${endpoint}:`, err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

export default useTMDBEndpoint;
