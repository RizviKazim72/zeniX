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
  hasMoreMovies: boolean;
  hasMoreTVShows: boolean;
  currentMoviePage: number;
  currentTVPage: number;
}

export interface UseGenreDataReturn extends GenrePageData {
  loadMoreMovies: () => Promise<void>;
  loadMoreTVShows: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useGenreData = (genreSlug: string): UseGenreDataReturn => {
  const [data, setData] = useState<GenrePageData>({
    movies: [],
    tvShows: [],
    loading: true,
    error: null,
    genreConfig: null,
    hasMoreMovies: true,
    hasMoreTVShows: true,
    currentMoviePage: 1,
    currentTVPage: 1,
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
        hasMoreMovies: result.movies.page < (result.movies.total_pages || 1),
        hasMoreTVShows: result.tvShows.page < (result.tvShows.total_pages || 1),
        currentMoviePage: 1,
        currentTVPage: 1,
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

  const loadMoreMovies = async () => {
    if (!genreConfig || !data.hasMoreMovies || data.loading) return;

    try {
      const nextPage = data.currentMoviePage + 1;
      const result = await TMDBService.getMoviesByGenre(genreConfig.movieGenreId, nextPage);

      setData(prev => ({
        ...prev,
        movies: [...prev.movies, ...result.results],
        currentMoviePage: nextPage,
        hasMoreMovies: nextPage < (result.total_pages || 1),
      }));
    } catch (error) {
      console.error('Error loading more movies:', error);
    }
  };

  const loadMoreTVShows = async () => {
    if (!genreConfig || !data.hasMoreTVShows || data.loading) return;

    try {
      const nextPage = data.currentTVPage + 1;
      const result = await TMDBService.getTVShowsByGenre(genreConfig.tvGenreId, nextPage);

      setData(prev => ({
        ...prev,
        tvShows: [...prev.tvShows, ...result.results],
        currentTVPage: nextPage,
        hasMoreTVShows: nextPage < (result.total_pages || 1),
      }));
    } catch (error) {
      console.error('Error loading more TV shows:', error);
    }
  };

  const refetch = async () => {
    setData(prev => ({
      ...prev,
      movies: [],
      tvShows: [],
      currentMoviePage: 1,
      currentTVPage: 1,
      hasMoreMovies: true,
      hasMoreTVShows: true,
    }));
    await fetchInitialData();
  };

  useEffect(() => {
    fetchInitialData();
  }, [genreSlug]);

  return {
    ...data,
    loadMoreMovies,
    loadMoreTVShows,
    refetch,
  };
};
