/**
 * Media utility functions for movie and TV show data handling
 * Provides unified interface for both movie and TV show objects
 */

import type { Movie, TVShow, MovieDetails, TVDetails, DetailsResponse } from "@/types/tmdb";

/**
 * Type guards for distinguishing between movies and TV shows
 */
export const isMovie = (media: Movie | TVShow): media is Movie => {
  return 'title' in media && 'release_date' in media;
};

export const isTVShow = (media: Movie | TVShow): media is TVShow => {
  return 'name' in media && 'first_air_date' in media;
};

export const isMovieDetails = (details: DetailsResponse): details is MovieDetails => {
  return 'title' in details && 'release_date' in details;
};

export const isTVDetails = (details: DetailsResponse): details is TVDetails => {
  return 'name' in details && 'first_air_date' in details;
};

/**
 * Universal getters that work for both movies and TV shows
 */
export const getMediaTitle = (media: Movie | TVShow | DetailsResponse): string => {
  if (isMovie(media) || isMovieDetails(media)) {
    return media.title;
  }
  return (media as TVShow | TVDetails).name;
};

export const getMediaReleaseDate = (media: Movie | TVShow | DetailsResponse): string | undefined => {
  if (isMovie(media) || isMovieDetails(media)) {
    return media.release_date;
  }
  return (media as TVShow | TVDetails).first_air_date;
};

export const getMediaYear = (media: Movie | TVShow | DetailsResponse): string => {
  const releaseDate = getMediaReleaseDate(media);
  return releaseDate ? new Date(releaseDate).getFullYear().toString() : "TBA";
};

export const getMediaType = (media: Movie | TVShow | DetailsResponse): "movie" | "tv" => {
  return isMovie(media) || isMovieDetails(media) ? "movie" : "tv";
};

/**
 * Format runtime for display
 */
export const formatRuntime = (minutes?: number | number[]): string => {
  if (!minutes) return "N/A";
  
  const runtime = Array.isArray(minutes)
    ? Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length)
    : minutes;
    
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format release year
 */
export const formatYear = (dateString?: string): string => {
  if (!dateString) return "TBA";
  return new Date(dateString).getFullYear().toString();
};

/**
 * Format vote average for display
 */
export const formatVoteAverage = (voteAverage?: number): string => {
  if (!voteAverage) return "N/A";
  return voteAverage.toFixed(1);
};

/**
 * Get genres as comma-separated string
 */
export const getGenresString = (media: DetailsResponse): string => {
  return media.genres?.map((g) => g.name).join(", ") || "N/A";
};

/**
 * Get media URL path
 */
export const getMediaUrl = (media: Movie | TVShow | DetailsResponse): string => {
  const type = getMediaType(media);
  const routePath = type === 'movie' ? 'movies' : 'tv-shows';
  return `/${routePath}/${media.id}`;
};

/**
 * Check if media has trailer
 */
export const hasTrailer = (videos: any[]): boolean => {
  return videos.some(video => 
    video.type === "Trailer" && 
    video.site === "YouTube"
  );
};

/**
 * Get trailer video
 */
export const getTrailer = (videos: any[]) => {
  return videos.find(video => 
    video.type === "Trailer" && 
    video.site === "YouTube"
  );
};

/**
 * Get YouTube trailer URL
 */
export const getTrailerUrl = (videos: any[]): string | null => {
  const trailer = getTrailer(videos);
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};

/**
 * Check if media is released
 */
export const isReleased = (media: Movie | TVShow | DetailsResponse): boolean => {
  const releaseDate = getMediaReleaseDate(media);
  if (!releaseDate) return false;
  return new Date(releaseDate) <= new Date();
};

/**
 * Get popularity level
 */
export const getPopularityLevel = (popularity?: number): "low" | "medium" | "high" | "viral" => {
  if (!popularity) return "low";
  if (popularity < 10) return "low";
  if (popularity < 50) return "medium";
  if (popularity < 100) return "high";
  return "viral";
};

/**
 * Sort media by popularity
 */
export const sortByPopularity = <T extends Movie | TVShow>(media: T[]): T[] => {
  return [...media].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
};

/**
 * Sort media by release date
 */
export const sortByReleaseDate = <T extends Movie | TVShow>(media: T[]): T[] => {
  return [...media].sort((a, b) => {
    const dateA = getMediaReleaseDate(a);
    const dateB = getMediaReleaseDate(b);
    if (!dateA || !dateB) return 0;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
};

/**
 * Filter media by minimum rating
 */
export const filterByMinRating = <T extends Movie | TVShow>(
  media: T[], 
  minRating: number
): T[] => {
  return media.filter(item => (item.vote_average || 0) >= minRating);
};
