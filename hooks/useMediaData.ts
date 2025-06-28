/**
 * Custom hook for media data management
 * Provides state management, caching, and error handling for TMDB data
 */

import { useState, useEffect, useCallback, useRef } from "react";
import TMDBService from "@/services/tmdb-api";
import type { Movie, TVShow, DetailsResponse, Genre, ApiResponse } from "@/types";

// Hook return types
interface UseMediaDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

interface UseMediaListReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  page: number;
  totalPages: number;
}

// Cache type
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Cache utilities
 */
const getCacheKey = (key: string, params?: Record<string, any>): string => {
  return params ? `${key}-${JSON.stringify(params)}` : key;
};

const getFromCache = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiry) {
    return entry.data;
  }
  if (entry) {
    cache.delete(key); // Remove expired entry
  }
  return null;
};

const setToCache = <T>(key: string, data: T, duration: number = CACHE_DURATION): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiry: Date.now() + duration
  });
};

/**
 * Hook for fetching single media details
 */
export const useMediaDetails = (
  id: number | null, 
  type: "movie" | "tv"
): UseMediaDataReturn<DetailsResponse> => {
  const [data, setData] = useState<DetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    const cacheKey = getCacheKey(`${type}-details`, { id });
    const cachedData = getFromCache<DetailsResponse>(cacheKey);
    
    if (cachedData) {
      setData(cachedData);
      return;
    }

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = type === "movie" 
        ? await TMDBService.getMovieDetails(id)
        : await TMDBService.getTVShowDetails(id);
      
      setData(result);
      setToCache(cacheKey, result);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [id, type]);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    hasMore: false,
    loadMore: async () => {}
  };
};

/**
 * Hook for fetching media lists with pagination
 */
export const useMediaList = <T extends Movie | TVShow>(
  fetchFunction: (page: number) => Promise<ApiResponse<T>>,
  dependencies: any[] = []
): UseMediaListReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const abortController = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    setLoading(true);
    if (!append) {
      setError(null);
    }

    try {
      const result = await fetchFunction(pageNum);
      
      setData(prev => append ? [...prev, ...result.results] : result.results);
      const totalPages = result.total_pages || 0;
      setTotalPages(totalPages);
      setPage(pageNum);
      setHasMore(pageNum < totalPages);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchData(page + 1, true);
  }, [fetchData, hasMore, loading, page]);

  const refetch = useCallback(async () => {
    setPage(1);
    await fetchData(1, false);
  }, [fetchData]);

  useEffect(() => {
    fetchData(1, false);
    
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch,
    hasMore,
    loadMore,
    page,
    totalPages
  };
};

/**
 * Hook for popular movies
 */
export const usePopularMovies = () => {
  return useMediaList<Movie>(
    (page) => TMDBService.getPopularMovies(page) as Promise<ApiResponse<Movie>>
  );
};

/**
 * Hook for top rated movies
 */
export const useTopRatedMovies = () => {
  return useMediaList<Movie>(
    (page) => TMDBService.getTopRatedMovies(page) as Promise<ApiResponse<Movie>>
  );
};

/**
 * Hook for trending movies
 */
export const useTrendingMovies = (timeWindow: "day" | "week" = "week") => {
  return useMediaList<Movie>(
    (page) => TMDBService.getTrendingMovies(timeWindow, page) as Promise<ApiResponse<Movie>>,
    [timeWindow]
  );
};

/**
 * Hook for popular TV shows
 */
export const usePopularTVShows = () => {
  return useMediaList<TVShow>(
    (page) => TMDBService.getPopularTVShows(page) as Promise<ApiResponse<TVShow>>
  );
};

/**
 * Hook for top rated TV shows
 */
export const useTopRatedTVShows = () => {
  return useMediaList<TVShow>(
    (page) => TMDBService.getTopRatedTVShows(page) as Promise<ApiResponse<TVShow>>
  );
};

/**
 * Hook for trending TV shows
 */
export const useTrendingTVShows = (timeWindow: "day" | "week" = "week") => {
  return useMediaList<TVShow>(
    (page) => TMDBService.getTrendingTVShows(timeWindow, page) as Promise<ApiResponse<TVShow>>,
    [timeWindow]
  );
};

/**
 * Hook for movies by genre
 */
export const useMoviesByGenre = (genreId: number | null) => {
  return useMediaList<Movie>(
    (page) => genreId ? TMDBService.discoverMoviesByGenre(genreId, page) as Promise<ApiResponse<Movie>> : Promise.reject(new Error("No genre ID")),
    [genreId]
  );
};

/**
 * Hook for TV shows by genre
 */
export const useTVShowsByGenre = (genreId: number | null) => {
  return useMediaList<TVShow>(
    (page) => genreId ? TMDBService.discoverTVShowsByGenre(genreId, page) as Promise<ApiResponse<TVShow>> : Promise.reject(new Error("No genre ID")),
    [genreId]
  );
};

/**
 * Hook for searching content
 */
export const useSearch = (query: string, type: "movie" | "tv" | "multi" = "multi") => {
  const fetchFunction = useCallback((page: number) => {
    if (!query.trim()) {
      return Promise.resolve({ 
        results: [], 
        page: 1, 
        total_pages: 0,
        total_results: 0 
      });
    }

    switch (type) {
      case "movie":
        return TMDBService.searchMovies(query, page);
      case "tv":
        return TMDBService.searchTVShows(query, page);
      case "multi":
      default:
        return TMDBService.searchMulti(query, page);
    }
  }, [query, type]);

  return useMediaList(fetchFunction, [query, type]);
};

/**
 * Hook for fetching genres
 */
export const useGenres = (type: "movie" | "tv") => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      const cacheKey = `${type}-genres`;
      const cachedGenres = getFromCache<Genre[]>(cacheKey);
      
      if (cachedGenres) {
        setGenres(cachedGenres);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = type === "movie" 
          ? await TMDBService.getMovieGenres()
          : await TMDBService.getTVGenres();
        
        setGenres(result);
        setToCache(cacheKey, result, 60 * 60 * 1000); // Cache for 1 hour
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [type]);

  return { genres, loading, error };
};

/**
 * Hook for media page data (details, videos, credits, etc.)
 */
export const useMediaPageData = (id: number | null, type: "movie" | "tv") => {
  const [data, setData] = useState<{
    details: DetailsResponse | null;
    videos: any[];
    credits: any;
    similar: any[];
    reviews: any[];
  }>({
    details: null,
    videos: [],
    credits: null,
    similar: [],
    reviews: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await TMDBService.getMediaPageData(id, type);
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [id, type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Hook for dynamic TMDB endpoint
 */
export const useTMDBEndpoint = <T = any>(
  endpoint: string | null, 
  params: Record<string, any> = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    const cacheKey = getCacheKey(endpoint, params);
    const cachedData = getFromCache<T>(cacheKey);
    
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await TMDBService.dynamic<T>(endpoint, params);
      setData(result);
      setToCache(cacheKey, result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Hook for clearing cache
 */
export const useClearCache = () => {
  const clearCache = useCallback((pattern?: string) => {
    if (pattern) {
      // Clear cache entries matching pattern
      const keysToDelete: string[] = [];
      cache.forEach((_, key) => {
        if (key.includes(pattern)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => cache.delete(key));
    } else {
      // Clear all cache
      cache.clear();
    }
  }, []);

  return clearCache;
};
