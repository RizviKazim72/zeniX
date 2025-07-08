/**
 * 🎬 Media Service - User Content Management
 * Favorites, watchlist, recent watches sab handle karta hai
 * Clean API calls with proper error handling
 */

// Media item interface
export interface MediaItem {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  addedAt?: string;
  watchedAt?: string;
  progress?: number;
  episodeNumber?: number;
  seasonNumber?: number;
}

// Standard API response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

class MediaService {
  private baseUrl = '/api/user';

  // ❤️ Favorites Management
  async addToFavorites(mediaItem: Omit<MediaItem, 'addedAt'>): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mediaItem),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to add to favorites' };
    }
  }

  async removeFromFavorites(mediaId: number, mediaType: 'movie' | 'tv'): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/favorites?mediaId=${mediaId}&mediaType=${mediaType}`, 
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to remove from favorites' };
    }
  }

  async getFavorites(): Promise<ApiResponse<MediaItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/favorites`, {
        method: 'GET',
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to fetch favorites', data: [] };
    }
  }

  // 📚 Watchlist Management
  async addToWatchlist(mediaItem: Omit<MediaItem, 'addedAt'>): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mediaItem),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to add to watchlist' };
    }
  }

  async removeFromWatchlist(mediaId: number, mediaType: 'movie' | 'tv'): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/watchlist?mediaId=${mediaId}&mediaType=${mediaType}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to remove from watchlist' };
    }
  }

  async getWatchlist(): Promise<ApiResponse<MediaItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/watchlist`, {
        method: 'GET',
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to fetch watchlist', data: [] };
    }
  }

  // 🕐 Recent Watches Management
  async addToRecentWatches(mediaItem: Omit<MediaItem, 'watchedAt'>): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/recent-watches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mediaItem),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to add to recent watches' };
    }
  }

  async getRecentWatches(): Promise<ApiResponse<MediaItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/recent-watches`, {
        method: 'GET',
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to fetch recent watches', data: [] };
    }
  }

  async clearRecentWatches(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/recent-watches`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to clear recent watches' };
    }
  }
}

// Export singleton instance
export const mediaService = new MediaService();
