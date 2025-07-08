/**
 * Custom Hook for Genre Page Data
 * Handles fetching movies and TV shows for a specific genre
 */

import { useState, useEffect } from 'react';
import { TMDBService } from '@/services';
import type { Movie, TVShow, ApiResponse } from '@/types';
import { getGenreConfig, type GenreConfig } from '@/constants/genres';

export interface GenrePageData {
  movies: Movie[];
  tvShows: TVShow[];
  loading: boolean;
  error: string | null;
  genreConfig: GenreConfig | null;
}

export interface UseGenreDataReturn extends GenrePageData {
  refetch: () => Promise<void>;
}

export const useGenreData = (genreSlug: string): UseGenreDataReturn => {
  const [data, setData] = useState<GenrePageData>({
    movies: [],
    tvShows: [],
    loading: true,
    error: null,
    genreConfig: null,
  });

  const genreConfig = getGenreConfig(genreSlug);

  const fetchInitialData = async () => {
    if (!genreConfig) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: `Genre "${genreSlug}" not found`,
      }));
      return;
    }

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      const result = await TMDBService.getMediaByGenre(
        genreConfig.movieGenreId,
        genreConfig.tvGenreId,
        1
      );

      setData(prev => ({
        ...prev,
        movies: result.movies.results,
        tvShows: result.tvShows.results,
        genreConfig,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching genre data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load content. Please try again.',
      }));
    }
  };

  const refetch = async () => {
    setData(prev => ({
      ...prev,
      movies: [],
      tvShows: [],
    }));
    await fetchInitialData();
  };

  useEffect(() => {
    fetchInitialData();
  }, [genreSlug]);

  return {
    ...data,
    refetch,
  };
};
