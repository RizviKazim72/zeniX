/**
 * Application Configuration Constants
 * Genre-based and general slider configurations for the application
 */

import { GENRE_CONFIG } from "@/lib/config";

// ===============================
// TYPE DEFINITIONS
// ===============================

export interface GenreSliderConfig {
  id: string;
  title: string;
  genreId: number;
  cardWidth: string;
}

export interface GeneralSliderConfig {
  id: string;
  title: string;
  endpoint: string;
  category: string;
  autoScroll: boolean;
  type: "movie" | "tv";
  cardWidth: string;
}

// ===============================
// MOVIE GENRE CONFIGURATIONS
// ===============================

export const genreBasedMovies: GenreSliderConfig[] = [
  { id: "action", title: "Action", genreId: GENRE_CONFIG.MOVIE_GENRES.ACTION, cardWidth: "w-[200px]" },
  { id: "adventure", title: "Adventure", genreId: GENRE_CONFIG.MOVIE_GENRES.ADVENTURE, cardWidth: "w-[200px]" },
  { id: "animation", title: "Animation", genreId: GENRE_CONFIG.MOVIE_GENRES.ANIMATION, cardWidth: "w-[200px]" },
  { id: "comedy", title: "Comedy", genreId: GENRE_CONFIG.MOVIE_GENRES.COMEDY, cardWidth: "w-[200px]" },
  { id: "crime", title: "Crime", genreId: GENRE_CONFIG.MOVIE_GENRES.CRIME, cardWidth: "w-[200px]" },
  { id: "documentary", title: "Documentary", genreId: GENRE_CONFIG.MOVIE_GENRES.DOCUMENTARY, cardWidth: "w-[200px]" },
  { id: "drama", title: "Drama", genreId: GENRE_CONFIG.MOVIE_GENRES.DRAMA, cardWidth: "w-[200px]" },
  { id: "family", title: "Family", genreId: GENRE_CONFIG.MOVIE_GENRES.FAMILY, cardWidth: "w-[200px]" },
  { id: "fantasy", title: "Fantasy", genreId: GENRE_CONFIG.MOVIE_GENRES.FANTASY, cardWidth: "w-[200px]" },
  { id: "history", title: "History", genreId: GENRE_CONFIG.MOVIE_GENRES.HISTORY, cardWidth: "w-[200px]" },
  { id: "horror", title: "Horror", genreId: GENRE_CONFIG.MOVIE_GENRES.HORROR, cardWidth: "w-[200px]" },
  { id: "mystery", title: "Mystery", genreId: GENRE_CONFIG.MOVIE_GENRES.MYSTERY, cardWidth: "w-[200px]" },
  { id: "sci-fi", title: "Science Fiction", genreId: GENRE_CONFIG.MOVIE_GENRES.SCIENCE_FICTION, cardWidth: "w-[200px]" },
  { id: "thriller", title: "Thriller", genreId: GENRE_CONFIG.MOVIE_GENRES.THRILLER, cardWidth: "w-[200px]" },
  { id: "war", title: "War", genreId: GENRE_CONFIG.MOVIE_GENRES.WAR, cardWidth: "w-[200px]" },
  { id: "western", title: "Western", genreId: GENRE_CONFIG.MOVIE_GENRES.WESTERN, cardWidth: "w-[200px]" },
];

// ===============================
// TV SHOW GENRE CONFIGURATIONS  
// ===============================

export const genreBasedTVShows: GenreSliderConfig[] = [
  { id: "action-adventure", title: "Action & Adventure", genreId: GENRE_CONFIG.TV_GENRES.ACTION_ADVENTURE, cardWidth: "w-[200px]" },
  { id: "animation", title: "Animation", genreId: GENRE_CONFIG.TV_GENRES.ANIMATION, cardWidth: "w-[200px]" },
  { id: "comedy", title: "Comedy", genreId: GENRE_CONFIG.TV_GENRES.COMEDY, cardWidth: "w-[200px]" },
  { id: "crime", title: "Crime", genreId: GENRE_CONFIG.TV_GENRES.CRIME, cardWidth: "w-[200px]" },
  { id: "documentary", title: "Documentary", genreId: GENRE_CONFIG.TV_GENRES.DOCUMENTARY, cardWidth: "w-[200px]" },
  { id: "drama", title: "Drama", genreId: GENRE_CONFIG.TV_GENRES.DRAMA, cardWidth: "w-[200px]" },
  { id: "family", title: "Family", genreId: GENRE_CONFIG.TV_GENRES.FAMILY, cardWidth: "w-[200px]" },
  { id: "kids", title: "Kids", genreId: GENRE_CONFIG.TV_GENRES.KIDS, cardWidth: "w-[200px]" },
  { id: "mystery", title: "Mystery", genreId: GENRE_CONFIG.TV_GENRES.MYSTERY, cardWidth: "w-[200px]" },
  { id: "news", title: "News", genreId: GENRE_CONFIG.TV_GENRES.NEWS, cardWidth: "w-[200px]" },
  { id: "reality", title: "Reality", genreId: GENRE_CONFIG.TV_GENRES.REALITY, cardWidth: "w-[200px]" },
  { id: "sci-fi-fantasy", title: "Sci-Fi & Fantasy", genreId: GENRE_CONFIG.TV_GENRES.SCI_FI_FANTASY, cardWidth: "w-[200px]" },
  { id: "soap", title: "Soap", genreId: GENRE_CONFIG.TV_GENRES.SOAP, cardWidth: "w-[200px]" },
  { id: "talk", title: "Talk", genreId: GENRE_CONFIG.TV_GENRES.TALK, cardWidth: "w-[200px]" },
  { id: "war-politics", title: "War & Politics", genreId: GENRE_CONFIG.TV_GENRES.WAR_POLITICS, cardWidth: "w-[200px]" },
  { id: "western", title: "Western", genreId: GENRE_CONFIG.TV_GENRES.WESTERN, cardWidth: "w-[200px]" },
];

// ===============================
// GENERAL SLIDERS FOR HOME PAGE
// ===============================

export const homeSliders: GeneralSliderConfig[] = [
  {
    id: "whats-new",
    title: "What's New",
    endpoint: "/movie/now_playing",
    category: "whats-new",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "upcoming-movies",
    title: "Upcoming Movies",
    endpoint: "/movie/upcoming",
    category: "upcoming-movies",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "top-rated-movies",
    title: "Top Rated Movies",
    endpoint: "/movie/top_rated",
    category: "top-rated-movies",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "now-playing-movies",
    title: "Now Playing Movies",
    endpoint: "/movie/now_playing",
    category: "now-playing-movies",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "on-air-tv-shows",
    title: "On Air TV Shows",
    endpoint: "/tv/on_the_air",
    category: "on-air-tv-shows",
    autoScroll: true,
    type: "tv",
    cardWidth: "w-[200px]"
  },
  {
    id: "top-rated-tv-shows",
    title: "Top Rated TV Shows",
    endpoint: "/tv/top_rated",
    category: "top-rated-tv-shows",
    autoScroll: true,
    type: "tv",
    cardWidth: "w-[200px]"
  },
  {
    id: "trending-movies",
    title: "Trending Movies",
    endpoint: "/trending/movie/week",
    category: "trending-movies",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "trending-tv-shows",
    title: "Trending TV Shows",
    endpoint: "/trending/tv/week",
    category: "trending-tv-shows",
    autoScroll: true,
    type: "tv",
    cardWidth: "w-[200px]"
  },
  {
    id: "popular-movies",
    title: "Popular Movies",
    endpoint: "/movie/popular",
    category: "popular-movies",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "popular-tv-shows",
    title: "Popular TV Shows",
    endpoint: "/tv/popular",
    category: "popular-tv-shows",
    autoScroll: true,
    type: "tv",
    cardWidth: "w-[200px]"
  },
];

// ===============================
// TRENDING PAGE SLIDERS
// ===============================

export const trendingSliders: GeneralSliderConfig[] = [
  {
    id: "trending-today",
    title: "Trending Today",
    endpoint: "/trending/all/day",
    category: "trending-today",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "trending-week",
    title: "This Week's Hottest",
    endpoint: "/trending/all/week",
    category: "trending-week",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "trending-movies",
    title: "Trending Movies",
    endpoint: "/trending/movie/week",
    category: "trending-movies",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "trending-tv",
    title: "Trending TV Shows",
    endpoint: "/trending/tv/week",
    category: "trending-tv",
    autoScroll: true,
    type: "tv",
    cardWidth: "w-[200px]"
  },
];

// ===============================
// GENRE-BASED TRENDING SLIDERS
// ===============================

export const trendingGenreSliders: GeneralSliderConfig[] = [
  {
    id: "trending-action",
    title: "🎭 Trending Action",
    endpoint: `/discover/movie?with_genres=${GENRE_CONFIG.MOVIE_GENRES.ACTION}&sort_by=popularity.desc`,
    category: "trending-action",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "trending-comedy",
    title: "😂 Trending Comedy",
    endpoint: `/discover/movie?with_genres=${GENRE_CONFIG.MOVIE_GENRES.COMEDY}&sort_by=popularity.desc`,
    category: "trending-comedy",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "trending-drama",
    title: "🎪 Trending Drama",
    endpoint: `/discover/movie?with_genres=${GENRE_CONFIG.MOVIE_GENRES.DRAMA}&sort_by=popularity.desc`,
    category: "trending-drama",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
  {
    id: "trending-horror",
    title: "👻 Trending Horror",
    endpoint: `/discover/movie?with_genres=${GENRE_CONFIG.MOVIE_GENRES.HORROR}&sort_by=popularity.desc`,
    category: "trending-horror",
    autoScroll: true,
    type: "movie",
    cardWidth: "w-[200px]"
  },
];

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Get slider configuration by ID
 */
export const getSliderConfigById = (id: string): GeneralSliderConfig | undefined => {
  return homeSliders.find(slider => slider.id === id);
};

/**
 * Get genre configuration by ID
 */
export const getGenreConfigById = (id: string, type: "movie" | "tv"): GenreSliderConfig | undefined => {
  const genreList = type === "movie" ? genreBasedMovies : genreBasedTVShows;
  return genreList.find(genre => genre.id === id);
};

/**
 * Get all trending configurations
 */
export const getAllTrendingConfigs = (): GeneralSliderConfig[] => {
  return [...trendingSliders, ...trendingGenreSliders];
};

/**
 * Get configurations by media type
 */
export const getConfigsByType = (type: "movie" | "tv"): GeneralSliderConfig[] => {
  return homeSliders.filter(slider => slider.type === type);
};
