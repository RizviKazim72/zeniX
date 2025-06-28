import axios from 'axios'

// ✅ Base Interfaces
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average: number;
  genre_ids?: number[];
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

export interface Genre {
  id: number;
  name: string;
}

// ✅ Detailed interfaces with all required properties
export interface MovieDetails extends Movie {
  runtime?: number;
  genres?: Genre[];
  production_companies?: { id: number; name: string; logo_path?: string | null }[];
  tagline?: string;
  budget?: number;
  revenue?: number;
  keywords?: {
    keywords?: { id: number; name: string }[];
  };
  spoken_languages?: { iso_639_1: string; name: string }[];
  status?: string;
  homepage?: string;
  imdb_id?: string;
  popularity?: number;
  vote_count?: number;
}

export interface TVDetails extends TVShow {
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: Genre[];
  production_companies?: { id: number; name: string; logo_path?: string | null }[];
  tagline?: string;
  keywords?: {
    results?: { id: number; name: string }[];
  };
  spoken_languages?: { iso_639_1: string; name: string }[];
  status?: string;
  homepage?: string;
  popularity?: number;
  vote_count?: number;
  created_by?: { id: number; name: string }[];
  episode_run_time?: number[];
  in_production?: boolean;
  languages?: string[];
  last_air_date?: string;
  last_episode_to_air?: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    season_number: number;
  };
  networks?: { id: number; name: string; logo_path?: string | null }[];
  origin_country?: string[];
  original_language?: string;
  original_name?: string;
  seasons?: {
    air_date?: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path?: string | null;
    season_number: number;
  }[];
  type?: string;
}

// ✅ Union type for handling both movie and TV details
export type DetailsResponse = MovieDetails | TVDetails;

export interface ApiResponse<T> {
  results: T[];
  page: number;
  total_pages?: number;
  total_results?: number;
}

// ✅ API Client
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment variables");
}

const apiClient = async <T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T> => {
  const response = await axios.get<T>(`${TMDB_BASE_URL}/${endpoint.replace(/^\//, "")}`, {
    params: { api_key: TMDB_API_KEY, ...params },
  });
  return response.data;
};

// ✅ Interface for tmdbApi
interface TmdbApi {
  // Movies
  moviesPopular: (page?: number) => Promise<ApiResponse<Movie>>;
  moviesTopRated: (page?: number) => Promise<ApiResponse<Movie>>;
  moviesUpcoming: (page?: number) => Promise<ApiResponse<Movie>>;
  moviesNowPlaying: (page?: number) => Promise<ApiResponse<Movie>>;
  movieById: (id: number) => Promise<MovieDetails>;
  movieVideos: (id: number) => Promise<{ results: any[] }>;
  movieCredits: (id: number) => Promise<{ cast: any[]; crew: any[] }>;

  // TV
  tvPopular: (page?: number) => Promise<ApiResponse<TVShow>>;
  tvTopRated: (page?: number) => Promise<ApiResponse<TVShow>>;
  tvAiringToday: (page?: number) => Promise<ApiResponse<TVShow>>;
  tvOnTheAir: (page?: number) => Promise<ApiResponse<TVShow>>;
  tvById: (id: number) => Promise<TVDetails>;
  tvVideos: (id: number) => Promise<{ results: any[] }>;
  tvCredits: (id: number) => Promise<{ cast: any[]; crew: any[] }>;

  // Search
  searchMovies: (query: string, page?: number) => Promise<ApiResponse<Movie>>;
  searchTVShows: (query: string, page?: number) => Promise<ApiResponse<TVShow>>;
  searchMulti: (query: string, page?: number) => Promise<ApiResponse<any>>;

  // Trending
  trendingMovies: (timeWindow?: "day" | "week", page?: number) => Promise<ApiResponse<Movie>>;
  trendingTV: (timeWindow?: "day" | "week", page?: number) => Promise<ApiResponse<TVShow>>;

  // Discover
  discoverMoviesByGenre: (genreId: number, page?: number) => Promise<ApiResponse<Movie>>;
  discoverTVByGenre: (genreId: number, page?: number) => Promise<ApiResponse<TVShow>>;

  // Genres
  getMovieGenres: () => Promise<Genre[]>;
  getTVGenres: () => Promise<Genre[]>;

  // ✅ Generic Dynamic Fetch
  dynamic: <T = any>(endpoint: string, params?: Record<string, any>) => Promise<T>;
}

// ✅ tmdbApi object - Using named export instead of default
export const tmdbApi: TmdbApi = {
  moviesPopular: (page = 1) => apiClient("movie/popular", { page }),
  moviesTopRated: (page = 1) => apiClient("movie/top_rated", { page }),
  moviesUpcoming: (page = 1) => apiClient("movie/upcoming", { page }),
  moviesNowPlaying: (page = 1) => apiClient("movie/now_playing", { page }),
  movieById: (id) => apiClient(`movie/${id}`),
  movieVideos: (id) => apiClient(`movie/${id}/videos`),
  movieCredits: (id) => apiClient(`movie/${id}/credits`),

  tvPopular: (page = 1) => apiClient("tv/popular", { page }),
  tvTopRated: (page = 1) => apiClient("tv/top_rated", { page }),
  tvAiringToday: (page = 1) => apiClient("tv/airing_today", { page }),
  tvOnTheAir: (page = 1) => apiClient("tv/on_the_air", { page }),
  tvById: (id) => apiClient(`tv/${id}`),
  tvVideos: (id) => apiClient(`tv/${id}/videos`),
  tvCredits: (id) => apiClient(`tv/${id}/credits`),

  searchMovies: (query, page = 1) => apiClient("search/movie", { query, page }),
  searchTVShows: (query, page = 1) => apiClient("search/tv", { query, page }),
  searchMulti: (query, page = 1) => apiClient("search/multi", { query, page }),

  trendingMovies: (timeWindow = "day", page = 1) =>
    apiClient(`trending/movie/${timeWindow}`, { page }),
  trendingTV: (timeWindow = "day", page = 1) =>
    apiClient(`trending/tv/${timeWindow}`, { page }),

  discoverMoviesByGenre: (genreId, page = 1) =>
    apiClient("discover/movie", { with_genres: genreId, page }),
  discoverTVByGenre: (genreId, page = 1) =>
    apiClient("discover/tv", { with_genres: genreId, page }),

  getMovieGenres: async () =>
    (await apiClient<{ genres: Genre[] }>("genre/movie/list")).genres,
  getTVGenres: async () =>
    (await apiClient<{ genres: Genre[] }>("genre/tv/list")).genres,

  dynamic: <T = any>(endpoint: string, params: Record<string, any> = {}) =>
    apiClient<T>(endpoint.replace(/^\//, ""), params),
};

// ✅ Utility functions for type checking
export const isMovieDetails = (details: DetailsResponse): details is MovieDetails => {
  return 'title' in details && 'release_date' in details;
};

export const isTVDetails = (details: DetailsResponse): details is TVDetails => {
  return 'name' in details && 'first_air_date' in details;
};

// ✅ Safe access utility functions
export const getTagline = (details: DetailsResponse): string | undefined => {
  return details.tagline;
};

export const getBudget = (details: DetailsResponse): number | undefined => {
  return isMovieDetails(details) ? details.budget : undefined;
};

export const getRevenue = (details: DetailsResponse): number | undefined => {
  return isMovieDetails(details) ? details.revenue : undefined;
};

export const getKeywords = (details: DetailsResponse): { id: number; name: string }[] => {
  if (isMovieDetails(details)) {
    return details.keywords?.keywords || [];
  } else if (isTVDetails(details)) {
    return details.keywords?.results || [];
  }
  return [];
};

export const getProductionCompanies = (details: DetailsResponse): { id: number; name: string }[] => {
  return details.production_companies || [];
};