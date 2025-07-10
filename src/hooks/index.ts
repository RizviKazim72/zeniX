/**
 * Hooks barrel export
 * Central access point for all custom hooks
 */

// Media data hooks
export {
  // Media collection hooks
  useMediaList,
  usePopularMovies,
  useTopRatedMovies,
  useTrendingMovies,
  usePopularTVShows,
  useTopRatedTVShows,
  useTrendingTVShows,
  
  // Media details hooks
  useMediaDetails,
  useMediaPageData,
  
  // Genre related hooks
  useMoviesByGenre,
  useTVShowsByGenre,
  useGenres,
  
  // Search and cache hooks
  useSearch,
  useClearCache
} from "./useMediaData";

// TMDB API endpoint hook
export { useTMDBEndpoint } from "./useTMDBEndpoint";

// Genre data hook
export { useGenreData } from "./useGenreData";

// Navigation loading hook
export { useNavigationLoading } from "./useNavigationLoading";
