/**
 * Utility functions barrel export
 */

// Image utilities
export {
  TMDB_IMAGE_BASE_URL,
  IMAGE_SIZES,
  getTMDBImageUrl,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
  getResponsiveImageSources,
  getImageFallback,
  isValidImageUrl
} from "./imageUtils";

// Media utilities  
export {
  isMovie,
  isTVShow,
  isMovieDetails,
  isTVDetails,
  getMediaTitle,
  getMediaReleaseDate,
  getMediaYear,
  getMediaType,
  formatRuntime,
  formatDate,
  formatYear,
  formatVoteAverage,
  getGenresString,
  getMediaUrl,
  hasTrailer,
  getTrailer,
  getTrailerUrl,
  isReleased,
  getPopularityLevel,
  sortByPopularity,
  sortByReleaseDate,
  filterByMinRating
} from "./mediaUtils";

// Other utilities
export { default as useOutsideClick } from "./useOutsideClick";

// Type exports for utilities
export type { ImageSizeType, PosterSize, BackdropSize } from "./imageUtils";
