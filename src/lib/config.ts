/**
 * Application Configuration
 * Centralized configuration for the entire application
 */

// ===============================
// API CONFIGURATION
// ===============================

export const API_CONFIG = {
  TMDB: {
    BASE_URL: process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3",
    API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
    IMAGE_BASE_URL: "https://image.tmdb.org/t/p/",
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

// ===============================
// IMAGE CONFIGURATION
// ===============================

export const IMAGE_CONFIG = {
  POSTER_SIZES: {
    SMALL: "w154",
    MEDIUM: "w342",
    LARGE: "w500",
    XLARGE: "w780",
    ORIGINAL: "original"
  },
  BACKDROP_SIZES: {
    SMALL: "w300",
    MEDIUM: "w780",
    LARGE: "w1280",
    ORIGINAL: "original"
  },
  PROFILE_SIZES: {
    SMALL: "w45",
    MEDIUM: "w185",
    LARGE: "h632",
    ORIGINAL: "original"
  },
  FALLBACK: {
    POSTER: "/images/poster-placeholder.jpg",
    BACKDROP: "/images/backdrop-placeholder.jpg",
    PROFILE: "/images/profile-placeholder.jpg"
  }
} as const;

// ===============================
// UI CONFIGURATION
// ===============================

export const UI_CONFIG = {
  PAGINATION: {
    ITEMS_PER_PAGE: 20,
    MAX_PAGES_TO_SHOW: 10
  },
  SLIDER: {
    ITEMS_PER_VIEW: {
      MOBILE: 2,
      TABLET: 4,
      DESKTOP: 6,
      LARGE: 8
    },
    AUTO_SCROLL_DELAY: 12000, // 12 seconds
    TRANSITION_DURATION: 1200 // 1.2 seconds
  },
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE: 1280,
    XLARGE: 1536
  },
  CARD_SIZES: {
    SMALL: "w-[150px] h-[225px]",
    MEDIUM: "w-[200px] h-[300px]",
    LARGE: "w-[250px] h-[375px]"
  }
} as const;

// ===============================
// RATING CONFIGURATION
// ===============================

export const RATING_CONFIG = {
  MIN_RATING: 0,
  MAX_RATING: 10,
  RATING_COLORS: {
    EXCELLENT: "text-green-400", // 8.0+
    GOOD: "text-yellow-400",     // 6.0-7.9
    AVERAGE: "text-orange-400",  // 4.0-5.9
    POOR: "text-red-400"         // <4.0
  }
} as const;

// ===============================
// GENRE CONFIGURATION
// ===============================

export const GENRE_CONFIG = {
  MOVIE_GENRES: {
    ACTION: 28,
    ADVENTURE: 12,
    ANIMATION: 16,
    COMEDY: 35,
    CRIME: 80,
    DOCUMENTARY: 99,
    DRAMA: 18,
    FAMILY: 10751,
    FANTASY: 14,
    HISTORY: 36,
    HORROR: 27,
    MUSIC: 10402,
    MYSTERY: 9648,
    SCIENCE_FICTION: 878,
    TV_MOVIE: 10770,
    THRILLER: 53,
    WAR: 10752,
    WESTERN: 37
  },
  TV_GENRES: {
    ACTION_ADVENTURE: 10759,
    ANIMATION: 16,
    COMEDY: 35,
    CRIME: 80,
    DOCUMENTARY: 99,
    DRAMA: 18,
    FAMILY: 10751,
    KIDS: 10762,
    MYSTERY: 9648,
    NEWS: 10763,
    REALITY: 10764,
    SCI_FI_FANTASY: 10765,
    SOAP: 10766,
    TALK: 10767,
    WAR_POLITICS: 10768,
    WESTERN: 37
  }
} as const;

// ===============================
// SEARCH CONFIGURATION
// ===============================

export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300, // 300ms
  MAX_RESULTS_PER_PAGE: 20,
  DEFAULT_FILTERS: {
    TYPE: "multi",
    INCLUDE_ADULT: false,
    LANGUAGE: "en-US"
  }
} as const;

// ===============================
// ANIMATION CONFIGURATION
// ===============================

export const ANIMATION_CONFIG = {
  DURATIONS: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 800
  },
  EASING: {
    EASE_IN: "ease-in",
    EASE_OUT: "ease-out", 
    EASE_IN_OUT: "ease-in-out",
    BOUNCE: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
  },
  SPRING: {
    STIFF: { type: "spring", stiffness: 300, damping: 30 },
    BOUNCY: { type: "spring", stiffness: 400, damping: 25 },
    SMOOTH: { type: "spring", stiffness: 200, damping: 35 }
  }
} as const;

// ===============================
// STORAGE CONFIGURATION
// ===============================

export const STORAGE_CONFIG = {
  KEYS: {
    THEME: "moviehub_theme",
    USER_PREFERENCES: "moviehub_preferences",
    WATCHLIST: "moviehub_watchlist",
    FAVORITES: "moviehub_favorites",
    RECENTLY_VIEWED: "moviehub_recent",
    SEARCH_HISTORY: "moviehub_search_history"
  },
  MAX_ITEMS: {
    WATCHLIST: 100,
    FAVORITES: 100,
    RECENTLY_VIEWED: 50,
    SEARCH_HISTORY: 20
  }
} as const;

// ===============================
// SEO CONFIGURATION
// ===============================

export const SEO_CONFIG = {
  DEFAULT_TITLE: "MovieHub - Discover Movies & TV Shows",
  DEFAULT_DESCRIPTION: "Discover the latest movies and TV shows with MovieHub. Get detailed information, watch trailers, and create your personal watchlist.",
  DEFAULT_KEYWORDS: ["movies", "tv shows", "cinema", "entertainment", "streaming"],
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://moviehub.com",
  TWITTER_HANDLE: "@moviehub",
  OG_IMAGE: "/images/og-image.jpg"
} as const;

// ===============================
// ERROR MESSAGES
// ===============================

export const ERROR_MESSAGES = {
  NETWORK: "Network error. Please check your internet connection and try again.",
  NOT_FOUND: "The requested content was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  RATE_LIMIT: "Too many requests. Please wait a moment before trying again.",
  INVALID_QUERY: "Please enter a valid search query.",
  NO_RESULTS: "No results found for your search.",
  GENERIC: "Something went wrong. Please try again."
} as const;

// ===============================
// SUCCESS MESSAGES
// ===============================

export const SUCCESS_MESSAGES = {
  ADDED_TO_WATCHLIST: "Added to your watchlist!",
  REMOVED_FROM_WATCHLIST: "Removed from your watchlist.",
  ADDED_TO_FAVORITES: "Added to your favorites!",
  REMOVED_FROM_FAVORITES: "Removed from your favorites.",
  PROFILE_UPDATED: "Profile updated successfully!",
  PREFERENCES_SAVED: "Preferences saved successfully!"
} as const;

// ===============================
// THEME CONFIGURATION
// ===============================

export const THEME_CONFIG = {
  DARK: {
    PRIMARY: "bg-slate-900",
    SECONDARY: "bg-slate-800", 
    ACCENT: "bg-purple-600",
    TEXT_PRIMARY: "text-white",
    TEXT_SECONDARY: "text-gray-300",
    BORDER: "border-slate-700"
  },
  LIGHT: {
    PRIMARY: "bg-white",
    SECONDARY: "bg-gray-100",
    ACCENT: "bg-purple-600", 
    TEXT_PRIMARY: "text-gray-900",
    TEXT_SECONDARY: "text-gray-600",
    BORDER: "border-gray-300"
  }
} as const;

// ===============================
// ROUTE CONFIGURATION
// ===============================

export const ROUTES = {
  HOME: "/",
  MOVIES: "/movies",
  TV_SHOWS: "/tv-shows",
  TRENDING: "/trending",
  SEARCH: "/search",
  MOVIE_DETAILS: (id: string | number) => `/movie/${id}`,
  TV_DETAILS: (id: string | number) => `/tv/${id}`,
  GENRE: (type: "movie" | "tv", genre: string) => `/${type}/genre/${genre}`,
  WATCHLIST: "/watchlist",
  FAVORITES: "/favorites",
  PROFILE: "/profile",
  LOGIN: "/login",
  REGISTER: "/register"
} as const;

// ===============================
// VALIDATION CONFIGURATION  
// ===============================

export const VALIDATION_CONFIG = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: "Please enter a valid email address"
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    MESSAGE: "Password must be at least 8 characters with uppercase, lowercase, and number"
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
    MESSAGE: "Username must be 3-20 characters, letters, numbers, and underscores only"
  }
} as const;

// ===============================
// FEATURE FLAGS
// ===============================

export const FEATURE_FLAGS = {
  ENABLE_REVIEWS: true,
  ENABLE_WATCHLIST: true,
  ENABLE_FAVORITES: true,
  ENABLE_RECOMMENDATIONS: true,
  ENABLE_SOCIAL_FEATURES: false,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_ANALYTICS: true,
  ENABLE_PWA: false
} as const;

// ===============================
// ENVIRONMENT CHECKS
// ===============================

export const ENV = {
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_CLIENT: typeof window !== "undefined",
  IS_SERVER: typeof window === "undefined"
} as const;

// ===============================
// TYPE EXPORTS
// ===============================

export type ApiConfig = typeof API_CONFIG;
export type ImageConfig = typeof IMAGE_CONFIG;
export type UIConfig = typeof UI_CONFIG;
export type GenreConfig = typeof GENRE_CONFIG;
export type ThemeConfig = typeof THEME_CONFIG;
