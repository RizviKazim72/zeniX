/**
 * Hooks barrel export
 * Central access point for all custom hooks
 */

export {
  useMediaDetails,
  useMediaList,
  usePopularMovies,
  useTopRatedMovies,
  useTrendingMovies,
  usePopularTVShows,
  useTopRatedTVShows,
  useTrendingTVShows,
  useMoviesByGenre,
  useTVShowsByGenre,
  useSearch,
  useGenres,
  useMediaPageData,
  useTMDBEndpoint,
  useClearCache
} from "./useMediaData";

export { useGenreData } from "./useGenreData";

export {
  useScrollAnimation,
} from './useScrollAnimation';
