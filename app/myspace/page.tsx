'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Heart, 
  Bookmark, 
  Clock, 
  Star, 
  Calendar,
  MapPin,
  Mail,
  Camera,
  Edit,
  Plus,
  Trash2,
  Grid,
  List
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useMediaList } from '@/hooks/useMediaList';
import UserAvatar from '@/components/ui/UserAvatar';
import MediaCard from '@/components/ui/MediaCard';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import ZeniXLoader from '@/components/ui/ZeniXLoader';
import ScrollAnimationWrapper from '@/components/ui/ScrollAnimationWrapper';

/**
 * MySpace - Personal dashboard for user content management
 * Features: favorites, watchlist, recent watches with stats
 */
export default function MySpacePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const { info, success } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Handle URL tab parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['overview', 'favorites', 'watchlist', 'recent'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
    { id: 'recent', label: 'Recent Watches', icon: Clock },
  ];

  // Calculate dynamic stats
  const stats = [
    { 
      label: 'Movies Watched', 
      value: (recentWatches.items || []).filter(w => w.mediaType === 'movie').length.toString(), 
      icon: Star 
    },
    { 
      label: 'TV Shows', 
      value: (recentWatches.items || []).filter(w => w.mediaType === 'tv').length.toString(), 
      icon: Star 
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

  const handleClearRecentWatches = async () => {
    if (window.confirm('Are you sure you want to clear all recent watches?')) {
      await recentWatches.clearAll();
    }
  };

  const addSampleData = async () => {
    const sampleMovies = [
      { mediaId: 550, mediaType: 'movie' as const, title: 'Fight Club', posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
      { mediaId: 13, mediaType: 'movie' as const, title: 'Forrest Gump', posterPath: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg' },
      { mediaId: 1399, mediaType: 'tv' as const, title: 'Game of Thrones', posterPath: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg' },
      { mediaId: 155, mediaType: 'movie' as const, title: 'The Dark Knight', posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
      { mediaId: 1396, mediaType: 'tv' as const, title: 'Breaking Bad', posterPath: '/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg' },
      { mediaId: 508442, mediaType: 'movie' as const, title: 'Soul', posterPath: '/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg' },
    ];

    // Add different items to different lists for better demo
    switch (activeTab) {
      case 'favorites':
        for (const movie of sampleMovies.slice(0, 3)) {
          await favorites.addItem(movie);
        }
        success('Sample favorites added!');
        break;
      case 'watchlist':
        for (const movie of sampleMovies.slice(2, 5)) {
          await watchlist.addItem(movie);
        }
        success('Sample watchlist items added!');
        break;
      case 'recent':
        for (const movie of sampleMovies.slice(1, 4)) {
          await recentWatches.addItem(movie);
        }
        success('Sample recent watches added!');
        break;
      default:
        // Add to all lists
        for (const movie of sampleMovies) {
          await favorites.addItem(movie);
          await watchlist.addItem(movie);
          await recentWatches.addItem(movie);
        }
        success('Sample data added to all lists!');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary font-netflix">
      <NavBar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <ScrollAnimationWrapper>
          <div className="relative h-64 sm:h-72 md:h-80 bg-gradient-to-r from-netflix-red/20 to-blue-600/20">
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 w-full">
                <div className="relative flex-shrink-0">
                  <UserAvatar user={user} size="xl" className="ring-4 ring-white/20" />
                  <button className="absolute bottom-0 right-0 p-2 bg-netflix-red rounded-full hover:bg-netflix-red-dark transition-colors cursor-pointer">
                    <Camera size={16} className="text-white" />
                  </button>
                </div>
                
                <div className="text-white flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{user.fullName}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Mail size={14} />
                      <span className="break-all">{user.email}</span>
                    </div>
                    {user.country && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{user.country}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {user.bio && (
                    <p className="mt-2 text-gray-300 text-sm sm:text-base">{user.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>

        {/* Stats Section */}
        <ScrollAnimationWrapper>
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 sm:p-4 text-center hover:bg-black/80 transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <stat.icon className="mx-auto mb-2 text-netflix-red" size={20} />
                  <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollAnimationWrapper>

        {/* Tabs Section */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
            <div className="flex overflow-x-auto space-x-1 bg-black/40 rounded-lg p-1 scroll-smooth">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-netflix-red text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm sm:text-base">{tab.label}</span>
                    {/* Count badges */}
                    {tab.id === 'favorites' && favorites.count > 0 && (
                      <span className="px-2 py-1 bg-netflix-red text-white text-xs rounded-full">
                        {favorites.count}
                      </span>
                    )}
                    {tab.id === 'watchlist' && watchlist.count > 0 && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        {watchlist.count}
                      </span>
                    )}
                    {tab.id === 'recent' && recentWatches.count > 0 && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        {recentWatches.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* View mode toggle and actions */}
            {(activeTab === 'favorites' || activeTab === 'watchlist' || activeTab === 'recent') && (
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                {activeTab === 'recent' && recentWatches.count > 0 && (
                  <button
                    onClick={handleClearRecentWatches}
                    className="flex items-center space-x-1 px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors text-sm cursor-pointer hover:scale-105"
                  >
                    <Trash2 size={14} />
                    <span>Clear All</span>
                  </button>
                )}
                
                <button
                  onClick={addSampleData}
                  className="flex items-center space-x-1 px-3 py-2 bg-netflix-red/20 text-netflix-red hover:bg-netflix-red/30 rounded-lg transition-colors text-sm cursor-pointer hover:scale-105"
                >
                  <Plus size={14} />
                  <span>Add Sample</span>
                </button>

                <div className="flex bg-black/40 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors cursor-pointer hover:scale-105 ${
                      viewMode === 'grid' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors cursor-pointer hover:scale-105 ${
                      viewMode === 'list' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="min-h-96">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">Profile Information</h3>
                      <button 
                        onClick={() => info('Profile editing coming soon!')}
                        className="flex items-center space-x-1 text-netflix-red hover:text-netflix-red-light transition-colors"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Full Name</label>
                        <p className="text-white">{user.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <p className="text-white">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Subscription</label>
                        <p className="text-white capitalize">{user.subscription.type}</p>
                      </div>
                      {user.bio && (
                        <div>
                          <label className="text-sm text-gray-400">Bio</label>
                          <p className="text-white">{user.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Favorite Genres</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {user.preferences.favoriteGenres.length > 0 ? (
                            user.preferences.favoriteGenres.map((genre) => (
                              <span
                                key={genre}
                                className="px-2 py-1 bg-netflix-red/20 text-netflix-red rounded text-sm"
                              >
                                {genre}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">No favorite genres set</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Language</label>
                        <p className="text-white">{user.preferences.preferredLanguage}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('favorites')}
                        className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <Heart size={20} className="text-netflix-red" />
                        <span className="text-white">View Favorites</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('watchlist')}
                        className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <Bookmark size={20} className="text-blue-500" />
                        <span className="text-white">View Watchlist</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('recent')}
                        className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <Clock size={20} className="text-green-500" />
                        <span className="text-white">Recent Watches</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'favorites' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {favorites.loading ? (
                  <div className="flex items-center justify-center py-12">
                    <ZeniXLoader isLoading={true} loadingText="Loading your favorites..." variant="component" />
                  </div>
                ) : favorites.count > 0 ? (
                  <div className={`grid gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    <AnimatePresence>
                      {(favorites.items || []).map((item) => (
                        <MediaCard
                          key={`${item.mediaId}-${item.mediaType}`}
                          item={item}
                          onRemove={favorites.removeItem}
                          type="favorites"
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-8 text-center">
                    <Heart size={48} className="mx-auto mb-4 text-netflix-red" />
                    <h3 className="text-xl font-semibold text-white mb-2">Your Favorites</h3>
                    <p className="text-gray-400 mb-2">Movies and shows you love will appear here</p>
                    <p className="text-gray-500 text-sm mb-4">Start adding movies and TV shows to your favorites!</p>
                    <button 
                      onClick={addSampleData}
                      className="flex items-center space-x-2 mx-auto px-4 py-2 bg-netflix-red hover:bg-netflix-red-dark rounded-lg transition-colors text-white cursor-pointer hover:scale-105"
                    >
                      <Plus size={16} />
                      <span>Add Sample Data</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'watchlist' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {watchlist.loading ? (
                  <div className="flex items-center justify-center py-12">
                    <ZeniXLoader isLoading={true} loadingText="Loading your watchlist..." variant="component" />
                  </div>
                ) : watchlist.count > 0 ? (
                  <div className={`grid gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    <AnimatePresence>
                      {(watchlist.items || []).map((item) => (
                        <MediaCard
                          key={`${item.mediaId}-${item.mediaType}`}
                          item={item}
                          onRemove={watchlist.removeItem}
                          type="watchlist"
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-8 text-center">
                    <Bookmark size={48} className="mx-auto mb-4 text-blue-500" />
                    <h3 className="text-xl font-semibold text-white mb-2">Your Watchlist</h3>
                    <p className="text-gray-400 mb-2">Save movies and shows to watch later</p>
                    <p className="text-gray-500 text-sm mb-4">Build your perfect watch queue!</p>
                    <button 
                      onClick={addSampleData}
                      className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-white cursor-pointer hover:scale-105"
                    >
                      <Plus size={16} />
                      <span>Add Sample Data</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'recent' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {recentWatches.loading ? (
                  <div className="flex items-center justify-center py-12">
                    <ZeniXLoader isLoading={true} loadingText="Loading your watch history..." variant="component" />
                  </div>
                ) : recentWatches.count > 0 ? (
                  <div className={`grid gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    <AnimatePresence>
                      {(recentWatches.items || []).map((item) => (
                        <MediaCard
                          key={`${item.mediaId}-${item.mediaType}-${item.watchedAt}`}
                          item={item}
                          showRemoveButton={false}
                          showWatchProgress={true}
                          type="recent"
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-8 text-center">
                    <Clock size={48} className="mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-semibold text-white mb-2">Recent Watches</h3>
                    <p className="text-gray-400 mb-2">Your viewing history will appear here</p>
                    <p className="text-gray-500 text-sm mb-4">Keep track of what you've been watching!</p>
                    <button 
                      onClick={addSampleData}
                      className="flex items-center space-x-2 mx-auto px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-white cursor-pointer hover:scale-105"
                    >
                      <Plus size={16} />
                      <span>Add Sample Data</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
