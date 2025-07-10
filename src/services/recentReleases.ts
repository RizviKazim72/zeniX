/**
 * Recent Releases Service - Provides "What's New" Content
 */

import { TMDBService } from './tmdb-api';
import { Movie, TVShow } from '@/types/tmdb';

interface RecentRelease {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview: string;
  vote_average: number;
  genre_ids?: number[];
  media_type: 'movie' | 'tv';
}

export const recentReleasesService = {
  /**
   * Gets recent movie releases from the past 30 days
   */
  async getRecentMovies(limit = 10): Promise<Movie[]> {
    try {
      // Get current date and date 30 days ago
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const formattedToday = today.toISOString().split('T')[0];
      const formattedThirtyDaysAgo = thirtyDaysAgo.toISOString().split('T')[0];
      
      // Get movies released in the past 30 days
      const response = await TMDBService.getNowPlayingMovies();
      
      // Filter for movies from the last 30 days only
      const movies = response.results.filter(movie => {
        if (!movie.release_date) return false;
        const releaseDate = new Date(movie.release_date);
        return releaseDate >= thirtyDaysAgo && releaseDate <= today;
      });
      
      // Sort by release date, newest first
      const sorted = movies.sort((a, b) => {
        const dateA = new Date(a.release_date || '');
        const dateB = new Date(b.release_date || '');
        return dateB.getTime() - dateA.getTime();
      });
      
      // If we have enough movies, return them
      if (sorted.length >= limit) {
        return sorted.slice(0, limit);
      } 
      
      // If not, supplement with popular movies to reach the limit
      try {
        const popular = await TMDBService.getPopularMovies();
        const combined = [...sorted];
        
        // Add popular movies that aren't already in our results
        for (const movie of popular.results) {
          if (combined.length >= limit) break;
          if (!combined.some(m => m.id === movie.id)) {
            combined.push(movie);
          }
        }
        
        return combined;
      } catch (fallbackError) {
        // If the fallback also fails, return what we have
        console.error('Error fetching fallback movies:', fallbackError);
        return sorted;
      }
    } catch (error) {
      console.error('Error fetching recent releases:', error);
      return [];
    }
  },
  
  /**
   * Gets recent TV show releases from the past 30 days
   */
  async getRecentTVShows(limit = 10): Promise<TVShow[]> {
    try {
      // Get current date and date 30 days ago
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      // Get on-air TV shows
      const response = await TMDBService.getTVShowsOnTheAir();
      
      // Filter for shows from the last 30 days only
      const tvShows = response.results.filter((show: TVShow) => {
        if (!show.first_air_date) return false;
        const airDate = new Date(show.first_air_date);
        return airDate >= thirtyDaysAgo && airDate <= today;
      });
      
      // Sort by air date, newest first
      const sorted = tvShows.sort((a: TVShow, b: TVShow) => {
        const dateA = new Date(a.first_air_date || '');
        const dateB = new Date(b.first_air_date || '');
        return dateB.getTime() - dateA.getTime();
      });
      
      // If we have enough shows, return them
      if (sorted.length >= limit) {
        return sorted.slice(0, limit);
      } 
      
      // If not, supplement with popular shows to reach the limit
      try {
        const popular = await TMDBService.getPopularTVShows();
        const combined = [...sorted];
        
        // Add popular shows that aren't already in our results
        for (const show of popular.results) {
          if (combined.length >= limit) break;
          if (!combined.some(s => s.id === show.id)) {
            combined.push(show);
          }
        }
        
        return combined;
      } catch (fallbackError) {
        // If the fallback also fails, return what we have
        console.error('Error fetching fallback TV shows:', fallbackError);
        return sorted;
      }
    } catch (error) {
      console.error('Error fetching recent TV shows:', error);
      return [];
    }
  },
  
  /**
   * Gets a mix of recent movies and TV shows
   */
  async getRecentContent(limit = 20): Promise<RecentRelease[]> {
    try {
      const [movies, tvShows] = await Promise.all([
        this.getRecentMovies(Math.ceil(limit / 2)),
        this.getRecentTVShows(Math.ceil(limit / 2))
      ]);
      
      // Create properly typed movie releases
      const movieReleases: RecentRelease[] = movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids,
        media_type: 'movie' as const
      }));
      
      // Create properly typed TV show releases
      const tvReleases: RecentRelease[] = tvShows.map(show => ({
        id: show.id,
        name: show.name,
        overview: show.overview,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average || 0, // Provide default for possible undefined
        genre_ids: show.genre_ids,
        media_type: 'tv' as const
      }));
      
      // Combine and sort all content by date
      const allReleases = [...movieReleases, ...tvReleases].sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || '');
        const dateB = new Date(b.release_date || b.first_air_date || '');
        return dateB.getTime() - dateA.getTime();
      });
      
      return allReleases.slice(0, limit);
    } catch (error) {
      console.error('Error fetching mixed recent content:', error);
      return [];
    }
  }
};
