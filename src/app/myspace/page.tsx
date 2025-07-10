/**
 * MySpace Page - Personal dashboard for user content management
 * Features: favorites, watchlist, recent watches with stats
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Heart, 
  Bookmark, 
  Clock, 
  Calendar,
  MapPin,
  Mail,
  Edit,
  Trash2,
  Film,
  Tv,
  Eye
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserMediaItem } from '@/context/AuthContext';
import { useMediaList } from '@/hooks/useMediaList';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import ZeniXLoader from '@/components/ui/ZeniXLoader';
import { MediaItem } from '@/services/mediaService';

// Helper function to convert MediaItem to UserMediaItem
const convertToUserMediaItem = (item: MediaItem): UserMediaItem => ({
  id: item.mediaId,
  mediaId: item.mediaId,
  type: item.mediaType,
  mediaType: item.mediaType,
  title: item.title,
  name: item.title,
  poster_path: item.posterPath,
  overview: '',
  addedAt: item.addedAt,
  watchedAt: item.watchedAt
});

/**
 * Tab types for MySpace page
 */
type TabType = 'overview' | 'favorites' | 'watchlist' | 'recent';

/**
 * Tab navigation component styled like movie details page
 */
const TabNavigation: React.FC<{
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: {
    favorites: number;
    watchlist: number;
    recent: number;
  };
}> = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: Eye },
    { id: "favorites" as TabType, label: `Favorites (${counts.favorites})`, icon: Heart },
    { id: "watchlist" as TabType, label: `Watchlist (${counts.watchlist})`, icon: Bookmark },
    { id: "recent" as TabType, label: `Recent (${counts.recent})`, icon: Clock },
  ];

  return (
    <div className="border-b border-white/10">
      <div className="flex overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer hover:scale-105 ${
                activeTab === tab.id
                  ? "text-red-500 border-b-2 border-red-500 bg-red-500/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * MySpace - Personal dashboard for user content management
 * Features: favorites, watchlist, recent watches with stats
 */
export default function MySpacePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Handle URL tab parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['overview', 'favorites', 'watchlist', 'recent'].includes(tab)) {
      setActiveTab(tab as TabType);
    }
  }, []);

  // Redirect to profile page for editing
  const handleEditProfile = () => {
    router.push('/profile');
  };

  // Initialize media lists
  const favorites = useMediaList('favorites');
  const watchlist = useMediaList('watchlist');
  const recentWatches = useMediaList('recent');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <ZeniXLoader isLoading={true} loadingText="Loading your personal space..." variant="page" />;
  }

  if (!user) {
    return null;
  }

  // Calculate dynamic stats
  const stats = [
    { 
      label: 'Movies Watched', 
      value: (recentWatches.items || []).filter(w => w.mediaType === 'movie').length.toString(), 
      icon: Film 
    },
    { 
      label: 'TV Shows', 
      value: (recentWatches.items || []).filter(w => w.mediaType === 'tv').length.toString(), 
      icon: Tv 
    },
    { 
      label: 'Hours Watched', 
      value: Math.floor((recentWatches.items || []).length * 1.8).toString(), // Estimated 1.8h per item
      icon: Clock 
    },
    { 
      label: 'Favorites', 
      value: (favorites.count || 0).toString(), 
      icon: Heart 
    },
  ];

  const counts = {
    favorites: favorites.count || 0,
    watchlist: watchlist.count || 0,
    recent: recentWatches.count || 0,
  };

  const handleClearRecentWatches = async () => {
    if (window.confirm('Are you sure you want to clear all recent watches?')) {
      await recentWatches.clearAll();
    }
  };

  const renderMediaGrid = (items: UserMediaItem[], emptyMessage: string, emptyIcon: React.ReactNode) => {
    if (!items || items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-full bg-bg-card border border-glass-border flex items-center justify-center">
            {emptyIcon}
          </div>
          <p className="text-text-muted text-center">{emptyMessage}</p>
        </div>
      );
    }

    // Only list view - removed grid view
    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={`${item.mediaId || item.id}-${item.mediaType || item.type}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="glass-card p-4 flex items-center gap-4 hover:shadow-netflix/20 hover:border-netflix-red/20 transition-all duration-300"
          >
            <div className="w-16 h-24 flex-shrink-0 bg-bg-tertiary border border-glass-border rounded-lg overflow-hidden">
              {item.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w154${item.poster_path}`}
                  alt={item.title || item.name || 'Media item'}
                  width={64}
                  height={96}
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {(item.type || item.mediaType) === 'movie' ? (
                    <Film className="w-6 h-6 text-text-disabled" />
                  ) : (
                    <Tv className="w-6 h-6 text-text-disabled" />
                  )}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-text-primary font-semibold truncate">{item.title || item.name}</h4>
              <p className="text-text-muted text-sm capitalize">{item.type || item.mediaType}</p>
              {item.addedAt && (
                <p className="text-text-disabled text-xs">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                const mediaId = item.mediaId || item.id;
                const mediaType = item.mediaType || item.type;
                if (activeTab === 'favorites') {
                  favorites.removeItem(mediaId, mediaType);
                } else if (activeTab === 'watchlist') {
                  watchlist.removeItem(mediaId, mediaType);
                } else if (activeTab === 'recent') {
                  recentWatches.removeItem(mediaId, mediaType);
                }
              }}
              className="p-2 text-text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative bg-bg-primary text-text-primary min-h-screen overflow-hidden font-netflix">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background with gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/10 via-purple-600/10 to-blue-600/10">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center pt-5 md:pt-16 lg:pt-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
              {/* Profile Image */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-shrink-0 text-center lg:text-left"
              >
              </motion.div>
              
              {/* Profile Information */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left"
              >
                {/* Title */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-lg leading-tight">
                    {user.fullName}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 italic font-light max-w-3xl mx-auto lg:mx-0">
                    &ldquo;Movie Enthusiast&rdquo;
                  </p>
                </div>

                {/* Meta Information */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 text-sm sm:text-base text-gray-300 justify-center lg:justify-start">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Mail className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="truncate max-w-48">{user.email}</span>
                  </div>
                  {user.country && (
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>{user.country}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                </div>

                {/* Bio Section */}
                {user.bio ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/20 max-w-3xl mx-auto lg:mx-0">
                    <p className="text-gray-300 text-base lg:text-lg leading-relaxed">{user.bio}</p>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/10 border-dashed max-w-3xl mx-auto lg:mx-0">
                    <p className="text-gray-400 text-sm lg:text-base italic mb-2">Add a bio to tell others about yourself</p>
                    <button 
                      onClick={handleEditProfile}
                      className="flex items-center space-x-2 text-netflix-red hover:text-netflix-red-light transition-colors cursor-pointer mx-auto lg:mx-0"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Add Bio</span>
                    </button>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto lg:mx-0">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 sm:p-4 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105"
                    >
                      <stat.icon className="mx-auto mb-2 text-netflix-red" size={18} />
                      <div className="text-base sm:text-lg md:text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 justify-center lg:justify-start">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Button
                      variant="netflix"
                      size="lg"
                      icon={<Edit className="w-4 h-4 lg:w-5 lg:h-5" />}
                      className="flex-1 sm:flex-initial"
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section with Glass Morphism */}
      <div className="relative">
        {/* Background with gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-secondary/80 to-bg-primary" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/5 via-transparent to-netflix-red/5" />
        
        <div className="relative backdrop-blur-medium">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16">
            {/* Tab Navigation */}
            <div className="mb-8 lg:mb-12">
              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={counts}
              />
            </div>

            {/* Tab Content */}
            <div className="min-h-[60vh]">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {/* Profile Information */}
                      <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                            Profile Information
                          </h3>
                          <button 
                            onClick={handleEditProfile}
                            className="flex items-center space-x-2 text-netflix-red hover:text-netflix-red-light transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-text-muted">Full Name</label>
                            <p className="text-text-primary font-medium">{user.fullName}</p>
                          </div>
                          <div>
                            <label className="text-sm text-text-muted">Email</label>
                            <p className="text-text-primary font-medium">{user.email}</p>
                          </div>
                          {user.country && (
                            <div>
                              <label className="text-sm text-text-muted">Country</label>
                              <p className="text-text-primary font-medium">{user.country}</p>
                            </div>
                          )}
                          <div>
                            <label className="text-sm text-text-muted">Member Since</label>
                            <p className="text-text-primary font-medium">
                              {new Date(user.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Activity Summary */}
                      <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                          Activity Summary
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-bg-tertiary/50 rounded-lg border border-glass-border">
                            <div className="flex items-center space-x-3">
                              <Heart className="w-5 h-5 text-red-500" />
                              <span className="text-text-primary">Favorites</span>
                            </div>
                            <span className="text-netflix-red font-bold">{favorites.count || 0}</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-bg-tertiary/50 rounded-lg border border-glass-border">
                            <div className="flex items-center space-x-3">
                              <Bookmark className="w-5 h-5 text-blue-500" />
                              <span className="text-text-primary">Watchlist</span>
                            </div>
                            <span className="text-netflix-red font-bold">{watchlist.count || 0}</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-bg-tertiary/50 rounded-lg border border-glass-border">
                            <div className="flex items-center space-x-3">
                              <Clock className="w-5 h-5 text-green-500" />
                              <span className="text-text-primary">Recent Watches</span>
                            </div>
                            <span className="text-netflix-red font-bold">{recentWatches.count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === "favorites" && (
                  <motion.div
                    key="favorites"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-6 lg:space-y-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                        My Favorites
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-text-muted bg-netflix-red/10 border border-netflix-red/20 px-3 py-1 rounded-full backdrop-blur-sm">
                          {favorites.count || 0} items
                        </div>
                      </div>
                    </div>
                    
                    {renderMediaGrid(
                      (favorites.items || []).map(convertToUserMediaItem),
                      "No favorites yet. Start adding movies and TV shows you love!",
                      <Heart className="w-8 h-8 text-text-disabled" />
                    )}
                  </motion.div>
                )}
                
                {activeTab === "watchlist" && (
                  <motion.div
                    key="watchlist"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-6 lg:space-y-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                        My Watchlist
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-text-muted bg-netflix-red/10 border border-netflix-red/20 px-3 py-1 rounded-full backdrop-blur-sm">
                          {watchlist.count || 0} items
                        </div>
                      </div>
                    </div>
                    
                    {renderMediaGrid(
                      (watchlist.items || []).map(convertToUserMediaItem),
                      "Your watchlist is empty. Add movies and TV shows to watch later!",
                      <Bookmark className="w-8 h-8 text-text-disabled" />
                    )}
                  </motion.div>
                )}
                
                {activeTab === "recent" && (
                  <motion.div
                    key="recent"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-6 lg:space-y-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                        Recent Watches
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-text-muted bg-netflix-red/10 border border-netflix-red/20 px-3 py-1 rounded-full backdrop-blur-sm">
                          {recentWatches.count || 0} items
                        </div>
                        {recentWatches.count > 0 && (
                          <button
                            onClick={handleClearRecentWatches}
                            className="flex items-center space-x-1 px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors text-sm cursor-pointer hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear All</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {renderMediaGrid(
                      (recentWatches.items || []).map(convertToUserMediaItem),
                      "No recent watches yet. Start exploring movies and TV shows!",
                      <Clock className="w-8 h-8 text-text-disabled" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
