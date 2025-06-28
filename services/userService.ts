/**
 * User Service
 * API service for user-related operations
 */

export interface WatchlistItem {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  addedAt: string;
}

export interface FavoriteItem {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  addedAt: string;
}

export interface RecentWatch {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  progress?: number;
  season?: number;
  episode?: number;
  watchedAt: string;
}

export interface MediaAction {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
}

export interface WatchProgress {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  progress?: number;
  season?: number;
  episode?: number;
}

/**
 * User Service Class
 */
export class UserService {
  private static baseUrl = '/api/user';

  // Helper method for making authenticated requests
  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    return data;
  }

  /**
   * Watchlist Operations
   */
  static async getWatchlist(page = 1, limit = 20) {
    return this.makeRequest(`/watchlist?page=${page}&limit=${limit}`);
  }

  static async addToWatchlist(item: MediaAction) {
    return this.makeRequest('/watchlist', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  static async removeFromWatchlist(mediaId: number, mediaType: 'movie' | 'tv') {
    return this.makeRequest(`/watchlist?mediaId=${mediaId}&mediaType=${mediaType}`, {
      method: 'DELETE',
    });
  }

  static async isInWatchlist(mediaId: number, mediaType: 'movie' | 'tv'): Promise<boolean> {
    try {
      const response = await this.getWatchlist(1, 1000); // Get all items for checking
      if (response.success) {
        return response.data.watchlist.some(
          (item: WatchlistItem) => item.mediaId === mediaId && item.mediaType === mediaType
        );
      }
      return false;
    } catch (error) {
      console.error('Error checking watchlist:', error);
      return false;
    }
  }

  /**
   * Favorites Operations
   */
  static async getFavorites(page = 1, limit = 20) {
    return this.makeRequest(`/favorites?page=${page}&limit=${limit}`);
  }

  static async addToFavorites(item: MediaAction) {
    return this.makeRequest('/favorites', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  static async removeFromFavorites(mediaId: number, mediaType: 'movie' | 'tv') {
    return this.makeRequest(`/favorites?mediaId=${mediaId}&mediaType=${mediaType}`, {
      method: 'DELETE',
    });
  }

  static async isInFavorites(mediaId: number, mediaType: 'movie' | 'tv'): Promise<boolean> {
    try {
      const response = await this.getFavorites(1, 1000); // Get all items for checking
      if (response.success) {
        return response.data.favorites.some(
          (item: FavoriteItem) => item.mediaId === mediaId && item.mediaType === mediaType
        );
      }
      return false;
    } catch (error) {
      console.error('Error checking favorites:', error);
      return false;
    }
  }

  /**
   * Recent Watches Operations
   */
  static async getRecentWatches(limit = 20) {
    return this.makeRequest(`/recent-watches?limit=${limit}`);
  }

  static async addRecentWatch(item: WatchProgress) {
    return this.makeRequest('/recent-watches', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  /**
   * Profile Operations
   */
  static async getProfile() {
    return this.makeRequest('/profile');
  }

  static async updateProfile(userData: any) {
    return this.makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    return this.makeRequest('/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  /**
   * Utility Methods
   */
  static async toggleWatchlist(item: MediaAction): Promise<{ success: boolean; message: string; action: 'added' | 'removed' }> {
    try {
      const isInWatchlist = await this.isInWatchlist(item.mediaId, item.mediaType);
      
      if (isInWatchlist) {
        const result = await this.removeFromWatchlist(item.mediaId, item.mediaType);
        return { 
          success: result.success, 
          message: result.message || 'Removed from watchlist', 
          action: 'removed' 
        };
      } else {
        const result = await this.addToWatchlist(item);
        return { 
          success: result.success, 
          message: result.message || 'Added to watchlist', 
          action: 'added' 
        };
      }
    } catch (error) {
      console.error('Toggle watchlist error:', error);
      return { 
        success: false, 
        message: 'Failed to update watchlist', 
        action: 'added' 
      };
    }
  }

  static async toggleFavorites(item: MediaAction): Promise<{ success: boolean; message: string; action: 'added' | 'removed' }> {
    try {
      const isInFavorites = await this.isInFavorites(item.mediaId, item.mediaType);
      
      if (isInFavorites) {
        const result = await this.removeFromFavorites(item.mediaId, item.mediaType);
        return { 
          success: result.success, 
          message: result.message || 'Removed from favorites', 
          action: 'removed' 
        };
      } else {
        const result = await this.addToFavorites(item);
        return { 
          success: result.success, 
          message: result.message || 'Added to favorites', 
          action: 'added' 
        };
      }
    } catch (error) {
      console.error('Toggle favorites error:', error);
      return { 
        success: false, 
        message: 'Failed to update favorites', 
        action: 'added' 
      };
    }
  }
}
