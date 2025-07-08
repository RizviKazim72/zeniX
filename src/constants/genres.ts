/**
 * Genre Constants for Dynamic Genre Pages
 * Maps genre names to TMDB genre IDs for movies and TV shows
 */

export interface GenreConfig {
  id: string;
  name: string;
  movieGenreId: number;
  tvGenreId: number;
  description: string;
  backgroundColor: string;
  icon: string;
}

export const GENRE_MAPPINGS: Record<string, GenreConfig> = {
  action: {
    id: 'action',
    name: 'Action',
    movieGenreId: 28,
    tvGenreId: 10759,
    description: 'High-octane thrills, explosive sequences, and adrenaline-pumping adventures.',
    backgroundColor: 'from-red-900/20 to-orange-900/20',
    icon: '💥'
  },
  adventure: {
    id: 'adventure',
    name: 'Adventure',
    movieGenreId: 12,
    tvGenreId: 10759,
    description: 'Epic journeys, exciting quests, and extraordinary discoveries await.',
    backgroundColor: 'from-green-900/20 to-emerald-900/20',
    icon: '🗺️'
  },
  animation: {
    id: 'animation',
    name: 'Animation',
    movieGenreId: 16,
    tvGenreId: 16,
    description: 'Imaginative worlds brought to life through stunning animated storytelling.',
    backgroundColor: 'from-purple-900/20 to-pink-900/20',
    icon: '🎨'
  },
  comedy: {
    id: 'comedy',
    name: 'Comedy',
    movieGenreId: 35,
    tvGenreId: 35,
    description: 'Laugh-out-loud moments and hilarious stories to brighten your day.',
    backgroundColor: 'from-yellow-900/20 to-amber-900/20',
    icon: '😂'
  },
  crime: {
    id: 'crime',
    name: 'Crime',
    movieGenreId: 80,
    tvGenreId: 80,
    description: 'Gripping tales of mystery, investigation, and criminal underworld.',
    backgroundColor: 'from-gray-900/20 to-slate-900/20',
    icon: '🕵️'
  },
  drama: {
    id: 'drama',
    name: 'Drama',
    movieGenreId: 18,
    tvGenreId: 18,
    description: 'Powerful emotions, compelling characters, and thought-provoking narratives.',
    backgroundColor: 'from-blue-900/20 to-indigo-900/20',
    icon: '🎭'
  },
  horror: {
    id: 'horror',
    name: 'Horror',
    movieGenreId: 27,
    tvGenreId: 9648,
    description: 'Spine-chilling thrills, supernatural scares, and heart-pounding suspense.',
    backgroundColor: 'from-black/40 to-red-950/40',
    icon: '👻'
  },
  'sci-fi': {
    id: 'sci-fi',
    name: 'Science Fiction',
    movieGenreId: 878,
    tvGenreId: 10765,
    description: 'Futuristic worlds, advanced technology, and mind-bending possibilities.',
    backgroundColor: 'from-cyan-900/20 to-blue-900/20',
    icon: '🚀'
  },
  fantasy: {
    id: 'fantasy',
    name: 'Fantasy',
    movieGenreId: 14,
    tvGenreId: 10765,
    description: 'Magical realms, mythical creatures, and supernatural adventures.',
    backgroundColor: 'from-violet-900/20 to-purple-900/20',
    icon: '🧙‍♂️'
  },
  family: {
    id: 'family',
    name: 'Family',
    movieGenreId: 10751,
    tvGenreId: 10751,
    description: 'Wholesome entertainment perfect for viewers of all ages.',
    backgroundColor: 'from-emerald-900/20 to-teal-900/20',
    icon: '👨‍👩‍👧‍👦'
  },
  documentary: {
    id: 'documentary',
    name: 'Documentary',
    movieGenreId: 99,
    tvGenreId: 99,
    description: 'Real stories, compelling facts, and eye-opening investigations.',
    backgroundColor: 'from-stone-900/20 to-gray-900/20',
    icon: '📚'
  },
  music: {
    id: 'music',
    name: 'Music',
    movieGenreId: 10402,
    tvGenreId: 10402,
    description: 'Musical performances, artist stories, and rhythm-filled adventures.',
    backgroundColor: 'from-fuchsia-900/20 to-pink-900/20',
    icon: '🎵'
  },
  mystery: {
    id: 'mystery',
    name: 'Mystery',
    movieGenreId: 9648,
    tvGenreId: 9648,
    description: 'Puzzling enigmas, detective work, and suspenseful investigations.',
    backgroundColor: 'from-indigo-900/20 to-purple-900/20',
    icon: '🔍'
  },
  history: {
    id: 'history',
    name: 'History',
    movieGenreId: 36,
    tvGenreId: 99,
    description: 'Historical events, period pieces, and stories from the past.',
    backgroundColor: 'from-amber-900/20 to-orange-900/20',
    icon: '🏛️'
  },
  war: {
    id: 'war',
    name: 'War',
    movieGenreId: 10752,
    tvGenreId: 10768,
    description: 'Military conflicts, heroic battles, and wartime stories.',
    backgroundColor: 'from-red-950/20 to-gray-900/20',
    icon: '⚔️'
  },
  thriller: {
    id: 'thriller',
    name: 'Thriller',
    movieGenreId: 53,
    tvGenreId: 9648,
    description: 'Edge-of-your-seat suspense, psychological tension, and unexpected twists.',
    backgroundColor: 'from-slate-900/20 to-zinc-900/20',
    icon: '⚡'
  },
  western: {
    id: 'western',
    name: 'Western',
    movieGenreId: 37,
    tvGenreId: 37,
    description: 'Classic frontier tales, cowboys, outlaws, and the untamed American West.',
    backgroundColor: 'from-orange-900/20 to-yellow-900/20',
    icon: '🤠'
  }
};

export const AVAILABLE_GENRES = Object.keys(GENRE_MAPPINGS);

export const getGenreConfig = (genreSlug: string): GenreConfig | null => {
  return GENRE_MAPPINGS[genreSlug.toLowerCase()] || null;
};

export const getAllGenres = (): GenreConfig[] => {
  return Object.values(GENRE_MAPPINGS);
};
