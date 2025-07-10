/**
 * Central export file for all types
 */

// Core TMDB types
export type {
  Movie,
  TVShow,
  Genre,
  MovieDetails,
  TVDetails,
  DetailsResponse,
  ApiResponse
} from "./tmdb";

// Extended media types
export type {
  MediaImage,
  MediaVideo,
  MediaCredit,
  MediaReview,
  MediaKeyword,
  Person,
  Episode,
  Season,
} from "./tmdb-types";

// API response types
export type {
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  Collection,
  PersonCombinedCredits,
  PersonMovieCredits,
  PersonTVCredits,
  SearchResultItem,
  TrendingItem,
  WatchProvider,
  CountryWatchProviders,
  WatchProviders,
  TMDBConfiguration,
  TMDBError,
  PaginatedResponse,
  ImagesResponse,
  VideosResponse,
  CreditsResponse,
  ReviewsResponse,
  KeywordsResponse,
  SimilarResponse,
  RecommendationsResponse,
} from "./tmdb-types";

// Utility types
export type {
  MediaType,
  TimeWindow,
  SortBy,
  ImageSize,
  UseMediaReturn,
  UseMediaListReturn,
  MediaPageData,
  SearchFilters,
  GenreFilter,
  YearFilter,
  RatingFilter,
} from "./tmdb-types";

// Component props types
export type {
  MediaCardProps,
  MediaGridProps,
  MediaSliderProps
} from "./tmdb-types";

// Filter types
export type {
  DiscoverFilters,
  TVDiscoverFilters,
} from "./tmdb-types";
