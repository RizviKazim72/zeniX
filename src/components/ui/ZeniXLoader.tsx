'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, Sparkles } from 'lucide-react';

interface ZeniXLoaderProps {
  isLoading: boolean;
  loadingText?: string;
  variant?: 'page' | 'navigation' | 'component' | 'splash';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ZeniXLoader = ({ 
  isLoading, 
  loadingText = "Loading ZeniX Experience...", 
  variant = 'page',
  size = 'lg'
}: ZeniXLoaderProps) => {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  // Animation for loading dots
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Animation for progress bar
  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }
    
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    return () => clearInterval(interval);
  }, [isLoading]);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  // Simple component variant (for embedded use)
  if (variant === 'component') {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 space-y-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className={`${sizeClasses[size]} border-4 border-gray-700/30 border-t-netflix-red rounded-full`}
              />
              
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Film size={size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : 40} className="text-netflix-red" />
              </motion.div>
            </div>
            
            <p className="text-white font-body">{loadingText}{dots}</p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Navigation variant (for page transitions)
  if (variant === 'navigation') {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-lg flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center p-8 max-w-sm"
            >
              <div className="relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="relative mx-auto w-16 h-16 flex items-center justify-center"
                >
                  <Film size={48} className="text-netflix-red drop-shadow-lg" />
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mt-4 tracking-wider">
                  zeni<span className="text-netflix-red">X</span>
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="text-white text-lg">
                  {loadingText}{dots}
                </div>
                
                <div className="w-64 mx-auto">
                  <div className="h-2 bg-gray-800/80 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-netflix-red to-netflix-red-light relative"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Default page variant
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative mx-auto w-24 h-24"
            >
              <Film size={64} className="text-netflix-red" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-white mt-6 mb-2">
              zeni<span className="text-netflix-red">X</span>
            </h1>
            
            <p className="text-gray-300 mb-6">{loadingText}{dots}</p>
            
            <div className="w-64 mx-auto">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-netflix-red"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Loading</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZeniXLoader;
