/**
 * 🎬 Media Utility Functions 
 * Movie aur TV show data handle karne ke liye helper functions
 * Type guards aur unified getters provide karte hain
 */

import type { Movie, TVShow, MovieDetails, TVDetails, DetailsResponse } from "@/types/tmdb";
import { MediaVideo } from '@/types/tmdb-types';

// 🔍 Type Guards - Movie vs TV Show distinguish karte hain
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

// 🔄 Universal Getters - Movie aur TV dono ke liye work karte hain
export const getMediaTitle = (media: Movie | TVShow | DetailsResponse): string => {
  return isMovie(media) || isMovieDetails(media) 
    ? media.title 
    : (media as TVShow | TVDetails).name;
};

export const getMediaReleaseDate = (media: Movie | TVShow | DetailsResponse): string | undefined => {
  return isMovie(media) || isMovieDetails(media) 
    ? media.release_date 
    : (media as TVShow | TVDetails).first_air_date;
};

export const getMediaYear = (media: Movie | TVShow | DetailsResponse): string => {
  const releaseDate = getMediaReleaseDate(media);
  return releaseDate ? new Date(releaseDate).getFullYear().toString() : "TBA";
};

export const getMediaType = (media: Movie | TVShow | DetailsResponse): "movie" | "tv" => {
  return isMovie(media) || isMovieDetails(media) ? "movie" : "tv";
};

// ⏱️ Formatting Functions
export const formatRuntime = (minutes?: number | number[]): string => {
  if (!minutes) return "N/A";
  
  const runtime = Array.isArray(minutes)
    ? Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length)
    : minutes;
    
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric",
  });
};

export const formatYear = (dateString?: string): string => {
  if (!dateString) return "TBA";
  return new Date(dateString).getFullYear().toString();
};

export const formatVoteAverage = (voteAverage?: number): string => {
  if (!voteAverage) return "N/A";
  return voteAverage.toFixed(1);
};

export const getGenresString = (media: DetailsResponse): string => {
  return media.genres?.map(g => g.name).join(", ") || "N/A";
};

// 🔗 URL and Path Generators
export const getMediaUrl = (media: Movie | TVShow | DetailsResponse): string => {
  const type = getMediaType(media);
  const routePath = type === 'movie' ? 'movies' : 'tv-shows';
  return `/${routePath}/${media.id}`;
};

// 🎬 Video/Trailer Functions
export const hasTrailer = (videos: MediaVideo[]): boolean => {
  return videos.some(video => 
    video.type === "Trailer" && video.site === "YouTube"
  );
};

export const getTrailer = (videos: MediaVideo[]) => {
  return videos.find(video => 
    video.type === "Trailer" && video.site === "YouTube"
  );
};

export const getTrailerUrl = (videos: MediaVideo[]): string | null => {
  const trailer = getTrailer(videos);
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};

// 📅 Release Status Functions  
export const isReleased = (media: Movie | TVShow | DetailsResponse): boolean => {
  const releaseDate = getMediaReleaseDate(media);
  if (!releaseDate) return false;
  return new Date(releaseDate) <= new Date();
};

export const getPopularityLevel = (popularity?: number): "low" | "medium" | "high" | "viral" => {
  if (!popularity) return "low";
  if (popularity < 10) return "low";
  if (popularity < 50) return "medium";
  if (popularity < 100) return "high";
  return "viral";
};

// 🔄 Array Manipulation Functions
export const sortByPopularity = <T extends Movie | TVShow>(media: T[]): T[] => {
  return [...media].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
};

export const sortByReleaseDate = <T extends Movie | TVShow>(media: T[]): T[] => {
  return [...media].sort((a, b) => {
    const dateA = getMediaReleaseDate(a);
    const dateB = getMediaReleaseDate(b);
    if (!dateA || !dateB) return 0;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
};

export const filterByMinRating = <T extends Movie | TVShow>(
  media: T[], 
  minRating: number
): T[] => {
  return media.filter(item => (item.vote_average || 0) >= minRating);
};
