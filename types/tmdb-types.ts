/**
 * Extended types for TMDB API
 * Additional interfaces for enhanced functionality
 */

import type { Movie, TVShow, MovieDetails, TVDetails, Genre, DetailsResponse } from "./tmdb";

// ===============================
// ENHANCED MEDIA INTERFACES
// ===============================

export interface MediaImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1?: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface MediaVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface MediaCredit {
  id: number;
  name: string;
  gender?: number;
  known_for_department?: string;
  original_name?: string;
  popularity?: number;
  profile_path?: string | null;
  cast_id?: number;
  character?: string;
  credit_id?: string;
  order?: number;
  department?: string;
  job?: string;
}

export interface MediaReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
  author_details: {
    name?: string;
    username: string;
    avatar_path?: string | null;
    rating?: number;
  };
}

export interface MediaKeyword {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path?: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// ===============================
// COLLECTION INTERFACES
// ===============================

export interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  parts: Movie[];
}

// ===============================
// PERSON INTERFACES
// ===============================

export interface Person {
  id: number;
  name: string;
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  gender?: number;
  homepage?: string | null;
  imdb_id?: string;
  known_for_department?: string;
  place_of_birth?: string | null;
  popularity?: number;
  profile_path?: string | null;
  adult?: boolean;
  also_known_as?: string[];
}

export interface PersonCombinedCredits {
  cast: (Movie | TVShow)[];
  crew: (Movie | TVShow)[];
}

export interface PersonMovieCredits {
  cast: Movie[];
  crew: Movie[];
}

export interface PersonTVCredits {
  cast: TVShow[];
  crew: TVShow[];
}

// ===============================
// SEARCH RESULT INTERFACES
// ===============================

export interface SearchResultItem {
  id: number;
  media_type: "movie" | "tv" | "person";
  popularity: number;
  vote_average?: number;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  
  // Movie specific
  title?: string;
  release_date?: string;
  
  // TV specific
  name?: string;
  first_air_date?: string;
  
  // Person specific
  profile_path?: string | null;
  known_for?: (Movie | TVShow)[];
  known_for_department?: string;
}

// ===============================
// TRENDING INTERFACES
// ===============================

export interface TrendingItem {
  id: number;
  media_type: "movie" | "tv";
  popularity: number;
  vote_average: number;
  overview: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  genre_ids?: number[];
  
  // Movie specific fields
  title?: string;
  release_date?: string;
  
  // TV specific fields  
  name?: string;
  first_air_date?: string;
}

// ===============================
// WATCH PROVIDER INTERFACES
// ===============================

export interface WatchProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface CountryWatchProviders {
  link?: string;
  buy?: WatchProvider[];
  rent?: WatchProvider[];
  flatrate?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
}

export interface WatchProviders {
  id: number;
  results: Record<string, CountryWatchProviders>;
}

// ===============================
// EPISODE INTERFACES (TV SPECIFIC)
// ===============================

export interface Episode {
  id: number;
  name: string;
  overview: string;
  air_date?: string;
  episode_number: number;
  season_number: number;
  still_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  runtime?: number;
  production_code?: string;
  guest_stars?: MediaCredit[];
  crew?: MediaCredit[];
}

export interface Season {
  id: number;
  air_date?: string;
  episode_count: number;
  name: string;
  overview: string;
  poster_path?: string | null;
  season_number: number;
  episodes?: Episode[];
}

// ===============================
// DISCOVER FILTER INTERFACES
// ===============================

export interface DiscoverFilters {
  page?: number;
  language?: string;
  region?: string;
  sort_by?: string;
  certification_country?: string;
  certification?: string;
  certification_lte?: string;
  certification_gte?: string;
  include_adult?: boolean;
  include_video?: boolean;
  primary_release_year?: number;
  primary_release_date_gte?: string;
  primary_release_date_lte?: string;
  release_date_gte?: string;
  release_date_lte?: string;
  with_release_type?: number;
  year?: number;
  vote_count_gte?: number;
  vote_count_lte?: number;
  vote_average_gte?: number;
  vote_average_lte?: number;
  with_cast?: string;
  with_crew?: string;
  with_people?: string;
  with_companies?: string;
  with_genres?: string;
  without_genres?: string;
  with_keywords?: string;
  without_keywords?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  with_original_language?: string;
  with_watch_providers?: string;
  watch_region?: string;
  with_watch_monetization_types?: string;
  without_companies?: string;
}

export interface TVDiscoverFilters extends Omit<DiscoverFilters, 
  'primary_release_year' | 'primary_release_date_gte' | 'primary_release_date_lte' | 
  'release_date_gte' | 'release_date_lte' | 'with_release_type' | 'year'> {
  air_date_gte?: string;
  air_date_lte?: string;
  first_air_date_gte?: string;
  first_air_date_lte?: string;
  first_air_date_year?: number;
  timezone?: string;
  include_null_first_air_dates?: boolean;
  with_networks?: string;
  with_status?: number;
  with_type?: number;
  screened_theatrically?: boolean;
}

// ===============================
// CONFIGURATION INTERFACES
// ===============================

export interface TMDBConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}

// ===============================
// ERROR INTERFACES
// ===============================

export interface TMDBError {
  status_code: number;
  status_message: string;
  success: boolean;
}

// ===============================
// API RESPONSE WRAPPERS
// ===============================

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface ImagesResponse {
  id: number;
  backdrops: MediaImage[];
  logos: MediaImage[];
  posters: MediaImage[];
}

export interface VideosResponse {
  id: number;
  results: MediaVideo[];
}

export interface CreditsResponse {
  id: number;
  cast: MediaCredit[];
  crew: MediaCredit[];
}

export interface ReviewsResponse {
  id: number;
  page: number;
  results: MediaReview[];
  total_pages: number;
  total_results: number;
}

export interface KeywordsResponse {
  id: number;
  keywords?: MediaKeyword[];
  results?: MediaKeyword[];
}

export interface SimilarResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface RecommendationsResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// ===============================
// UTILITY TYPES
// ===============================

export type MediaType = "movie" | "tv";
export type TimeWindow = "day" | "week";
export type SortBy = "popularity.asc" | "popularity.desc" | "release_date.asc" | "release_date.desc" | 
  "revenue.asc" | "revenue.desc" | "primary_release_date.asc" | "primary_release_date.desc" | 
  "original_title.asc" | "original_title.desc" | "vote_average.asc" | "vote_average.desc" | 
  "vote_count.asc" | "vote_count.desc";

export type ImageSize = "w45" | "w92" | "w154" | "w185" | "w300" | "w342" | "w500" | "w780" | "w1280" | "original";

// ===============================
// HOOK SPECIFIC TYPES
// ===============================

export interface UseMediaReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseMediaListReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  page: number;
  totalPages: number;
}

export interface MediaPageData {
  details: DetailsResponse;
  images: ImagesResponse;
  videos: VideosResponse;
  credits: CreditsResponse;
  reviews: ReviewsResponse;
  keywords: KeywordsResponse;
  similar: PaginatedResponse<Movie | TVShow>;
  recommendations: PaginatedResponse<Movie | TVShow>;
  watchProviders: WatchProviders;
}

// ===============================
// FILTER AND SEARCH TYPES
// ===============================

export interface SearchFilters {
  query: string;
  type: "movie" | "tv" | "person" | "multi";
  page?: number;
  include_adult?: boolean;
  language?: string;
  region?: string;
  year?: number;
  primary_release_year?: number;
  first_air_date_year?: number;
}

export interface GenreFilter {
  id: number;
  name: string;
  selected: boolean;
}

export interface YearFilter {
  year: number;
  selected: boolean;
}

export interface RatingFilter {
  min: number;
  max: number;
}

// ===============================
// COMPONENT PROP TYPES
// ===============================

export interface MediaCardProps {
  media: Movie | TVShow;
  type: MediaType;
  size?: "small" | "medium" | "large";
  showRating?: boolean;
  showGenres?: boolean;
  showOverview?: boolean;
  onClick?: (media: Movie | TVShow) => void;
  className?: string;
}

export interface MediaGridProps {
  items: (Movie | TVShow)[];
  type: MediaType;
  loading?: boolean;
  error?: string | null;
  onItemClick?: (item: Movie | TVShow) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

export interface MediaSliderProps {
  title: string;
  items: (Movie | TVShow)[];
  type: MediaType;
  loading?: boolean;
  error?: string | null;
  autoScroll?: boolean;
  showControls?: boolean;
  onItemClick?: (item: Movie | TVShow) => void;
  className?: string;
}

// Main types are already imported and re-exported above
