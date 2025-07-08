/**
 * Image utility functions for TMDB API
 * Centralized image URL generation and optimization
 */

// TMDB Image Configuration
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

// Image Size Constants
export const IMAGE_SIZES = {
  POSTER: {
    SMALL: "w154",
    MEDIUM: "w342", 
    LARGE: "w500",
    XLARGE: "w780",
    ORIGINAL: "original"
  },
  BACKDROP: {
    SMALL: "w300",
    MEDIUM: "w780", 
    LARGE: "w1280",
    ORIGINAL: "original"
  },
  PROFILE: {
    SMALL: "w45",
    MEDIUM: "w185",
    LARGE: "h632",
    ORIGINAL: "original"
  }
} as const;

export type ImageSizeType = keyof typeof IMAGE_SIZES;
export type PosterSize = keyof typeof IMAGE_SIZES.POSTER;
export type BackdropSize = keyof typeof IMAGE_SIZES.BACKDROP;
export type ProfileSize = keyof typeof IMAGE_SIZES.PROFILE;

/**
 * Generates a complete TMDB image URL
 */
export const getTMDBImageUrl = (
  path: string | null | undefined,
  size: string = IMAGE_SIZES.POSTER.MEDIUM
): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

/**
 * Get poster URL with specified size
 */
export const getPosterUrl = (
  posterPath: string | null | undefined,
  size: PosterSize = "MEDIUM"
): string | null => {
  return getTMDBImageUrl(posterPath, IMAGE_SIZES.POSTER[size]);
};

/**
 * Get backdrop URL with specified size
 */
export const getBackdropUrl = (
  backdropPath: string | null | undefined,
  size: BackdropSize = "LARGE"
): string | null => {
  return getTMDBImageUrl(backdropPath, IMAGE_SIZES.BACKDROP[size]);
};

/**
 * Get profile image URL with specified size
 */
export const getProfileUrl = (
  profilePath: string | null | undefined,
  size: ProfileSize = "MEDIUM"
): string | null => {
  return getTMDBImageUrl(profilePath, IMAGE_SIZES.PROFILE[size]);
};

/**
 * Generate responsive image sources for different screen sizes
 */
export const getResponsiveImageSources = (path: string | null | undefined) => {
  if (!path) return null;
  
  return {
    mobile: getTMDBImageUrl(path, IMAGE_SIZES.BACKDROP.SMALL),
    tablet: getTMDBImageUrl(path, IMAGE_SIZES.BACKDROP.MEDIUM),
    desktop: getTMDBImageUrl(path, IMAGE_SIZES.BACKDROP.LARGE),
    original: getTMDBImageUrl(path, IMAGE_SIZES.BACKDROP.ORIGINAL)
  };
};

/**
 * Fallback placeholder for missing images
 */
export const getImageFallback = (type: "poster" | "backdrop" | "profile" = "poster"): string => {
  const fallbacks = {
    poster: "/images/poster-placeholder.jpg",
    backdrop: "/images/backdrop-placeholder.jpg", 
    profile: "/images/profile-placeholder.jpg"
  };
  
  return fallbacks[type];
};

/**
 * Check if an image URL is valid
 */
export const isValidImageUrl = (url: string | null): boolean => {
  return Boolean(url && url.startsWith("http"));
};
