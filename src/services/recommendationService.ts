/**
 * Recommendation Engine - AI-powered content discovery
 * Analyzes user behavior to suggest personalized movies and TV shows
 */

import { mediaService } from './mediaService';
import { TMDBService } from './tmdb-api';
import { UserMediaItem } from '@/context/AuthContext';

interface UserBehavior {
  favorites: UserMediaItem[];
  watchlist: UserMediaItem[];
  recentWatches: UserMediaItem[];
  ratings: { mediaId: number; rating: number; type: 'movie' | 'tv' }[];
  preferences: {
    favoriteGenres: string[];
    preferredLanguage: string;
  };
}

interface RecommendationItem {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  score: number;
  reason: string;
  genres: string[];
}

class RecommendationService {
  private genreWeights: { [key: string]: number } = {};
  private actorWeights: { [key: string]: number } = {};
  private directorWeights: { [key: string]: number } = {};

  /**
   * Main recommendation engine - returns personalized suggestions
   */
  async getPersonalizedRecommendations(userBehavior: UserBehavior, limit = 20): Promise<RecommendationItem[]> {
    try {
      // Analyze user preferences
      this.analyzeUserPreferences(userBehavior);
      
      const recommendations: RecommendationItem[] = [];
      
      // Get recommendations based on different strategies
      const genreBasedRecs = await this.getGenreBasedRecommendations(userBehavior, 8);
      const similarContentRecs = await this.getSimilarContentRecommendations(userBehavior, 6);
      const trendingRecs = await this.getTrendingRecommendations(userBehavior, 6);
      
      recommendations.push(...genreBasedRecs, ...similarContentRecs, ...trendingRecs);
      
      // Remove duplicates and items already in user's lists
      const filteredRecs = this.filterAndDeduplicateRecommendations(recommendations, userBehavior);
      
      // Sort by score and return top results
      return filteredRecs
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
        
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  /**
   * Analyze user preferences to build weights
   */
  private analyzeUserPreferences(userBehavior: UserBehavior) {
    // Reset weights
    this.genreWeights = {};
    
    // Weight from explicit preferences
    userBehavior.preferences.favoriteGenres.forEach(genre => {
      this.genreWeights[genre] = (this.genreWeights[genre] || 0) + 3;
    });
    
    // Weight from favorites (high weight)
    userBehavior.favorites.forEach(item => {
      if (item.genres) {
        item.genres.forEach((genre: string) => {
          this.genreWeights[genre] = (this.genreWeights[genre] || 0) + 2;
        });
      }
    });
    
    // Weight from watchlist (medium weight)
    userBehavior.watchlist.forEach(item => {
      if (item.genres) {
        item.genres.forEach((genre: string) => {
          this.genreWeights[genre] = (this.genreWeights[genre] || 0) + 1.5;
        });
      }
    });
    
    // Weight from recent watches (lower weight)
    userBehavior.recentWatches.forEach(item => {
      if (item.genres) {
        item.genres.forEach((genre: string) => {
          this.genreWeights[genre] = (this.genreWeights[genre] || 0) + 1;
        });
      }
    });
  }

  /**
   * Get recommendations based on user's preferred genres
   */
  private async getGenreBasedRecommendations(userBehavior: UserBehavior, limit: number): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    const topGenres = Object.entries(this.genreWeights)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);
    
    for (const genre of topGenres) {
      try {
        const genreId = this.getGenreId(genre);
        if (genreId) {
          // Get movies for this genre
          const movieResults = await TMDBService.discover('movie', { with_genres: genreId.toString() });
          const tvResults = await TMDBService.discover('tv', { with_genres: genreId.toString() });
          
          // Process movie results
          movieResults.results?.slice(0, Math.ceil(limit / 6)).forEach((movie: any) => {
            recommendations.push({
              mediaId: movie.id,
              mediaType: 'movie',
              title: movie.title,
              posterPath: movie.poster_path,
              score: this.calculateGenreScore([genre]),
              reason: `Because you like ${genre} movies`,
              genres: [genre]
            });
          });
          
          // Process TV results
          tvResults.results?.slice(0, Math.ceil(limit / 6)).forEach((show: any) => {
            recommendations.push({
              mediaId: show.id,
              mediaType: 'tv',
              title: show.name,
              posterPath: show.poster_path,
              score: this.calculateGenreScore([genre]),
              reason: `Because you like ${genre} shows`,
              genres: [genre]
            });
          });
        }
      } catch (error) {
        console.error(`Error fetching recommendations for genre ${genre}:`, error);
      }
    }
    
    return recommendations;
  }

  /**
   * Get recommendations based on similar content
   */
  private async getSimilarContentRecommendations(userBehavior: UserBehavior, limit: number): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    
    // Get similar content based on favorites
    const topFavorites = userBehavior.favorites.slice(0, 3);
    
    for (const favorite of topFavorites) {
      try {
        const similar = await TMDBService.getSimilar(favorite.mediaId || favorite.id, favorite.mediaType || favorite.type);
        
        similar.slice(0, Math.ceil(limit / 3)).forEach((item: any) => {
          recommendations.push({
            mediaId: item.id,
            mediaType: favorite.mediaType || favorite.type,
            title: item.title || item.name,
            posterPath: item.poster_path,
            score: 8.5,
            reason: `Because you liked ${favorite.title || favorite.name}`,
            genres: []
          });
        });
      } catch (error) {
        console.error(`Error fetching similar content for ${favorite.title}:`, error);
      }
    }
    
    return recommendations;
  }

  /**
   * Get trending recommendations filtered by user preferences
   */
  private async getTrendingRecommendations(userBehavior: UserBehavior, limit: number): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    
    try {
      const trendingMovies = await TMDBService.getTrending('movie', 'week');
      const trendingTV = await TMDBService.getTrending('tv', 'week');
      
      // Filter and score trending content
      trendingMovies.results?.slice(0, Math.ceil(limit / 2)).forEach((movie: any) => {
        recommendations.push({
          mediaId: movie.id,
          mediaType: 'movie',
          title: movie.title,
          posterPath: movie.poster_path,
          score: 7.0 + (movie.vote_average / 10 * 2), // Base score + quality boost
          reason: 'Trending now',
          genres: []
        });
      });
      
      trendingTV.results?.slice(0, Math.ceil(limit / 2)).forEach((show: any) => {
        recommendations.push({
          mediaId: show.id,
          mediaType: 'tv',
          title: show.name,
          posterPath: show.poster_path,
          score: 7.0 + (show.vote_average / 10 * 2),
          reason: 'Trending now',
          genres: []
        });
      });
    } catch (error) {
      console.error('Error fetching trending recommendations:', error);
    }
    
    return recommendations;
  }

  /**
   * Calculate score based on genre preferences
   */
  private calculateGenreScore(genres: string[]): number {
    let score = 6.0; // Base score
    
    genres.forEach(genre => {
      const weight = this.genreWeights[genre] || 0;
      score += weight * 0.5;
    });
    
    return Math.min(score, 10); // Cap at 10
  }

  /**
   * Remove duplicates and filter out content user already has
   */
  private filterAndDeduplicateRecommendations(
    recommendations: RecommendationItem[], 
    userBehavior: UserBehavior
  ): RecommendationItem[] {
    const seen = new Set<string>();
    const userContentIds = new Set<string>();
    
    // Track user's existing content
    [...userBehavior.favorites, ...userBehavior.watchlist, ...userBehavior.recentWatches]
      .forEach(item => {
        userContentIds.add(`${item.mediaType || item.type}-${item.mediaId || item.id}`);
      });
    
    return recommendations.filter(rec => {
      const key = `${rec.mediaType}-${rec.mediaId}`;
      
      // Skip if already seen or user already has this content
      if (seen.has(key) || userContentIds.has(key)) {
        return false;
      }
      
      seen.add(key);
      return true;
    });
  }

  /**
   * Get TMDB genre ID from genre name
   */
  private getGenreId(genreName: string): number | null {
    const genreMap: { [key: string]: number } = {
      'Action': 28,
      'Adventure': 12,
      'Animation': 16,
      'Comedy': 35,
      'Crime': 80,
      'Documentary': 99,
      'Drama': 18,
      'Family': 10751,
      'Fantasy': 14,
      'History': 36,
      'Horror': 27,
      'Music': 10402,
      'Mystery': 9648,
      'Science Fiction': 878,
      'Thriller': 53,
      'War': 10752,
      'Western': 37
    };
    
    return genreMap[genreName] || null;
  }
}

export const recommendationService = new RecommendationService();
