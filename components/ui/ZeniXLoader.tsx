'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, Sparkles, Zap } from 'lucide-react';

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

  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

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

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as any
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1] as any
      }
    }
  };

  const filmReelVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear" as any
      }
    }
  };

  const playButtonVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as any
      }
    }
  };

  if (variant === 'splash') {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-netflix-red/30 rounded-full"
                  initial={{ 
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                    opacity: 0
                  }}
                  animate={{
                    y: [null, -50],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
              <motion.div
                variants={logoVariants}
                initial="initial"
                animate={["animate", "pulse"]}
                className="mb-8"
              >
                <div className="relative mb-4">
                  {/* Film Reel Background */}
                  <motion.div
                    variants={filmReelVariants}
                    animate="animate"
                    className="absolute -inset-8 opacity-20"
                  >
                    <Film size={120} className="text-netflix-red" />
                  </motion.div>
                  
                  <h1 className="text-6xl md:text-8xl font-heading font-black text-white tracking-wider relative z-10">
                    zeni<span className="text-netflix-red">X</span>
                  </h1>
                  
                  {/* Central Play Button */}
                  <motion.div
                    variants={playButtonVariants}
                    animate="animate"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-netflix-red/20 backdrop-blur-sm rounded-full p-6 border border-netflix-red/30">
                      <Play size={32} className="text-netflix-red" fill="currentColor" />
                    </div>
                  </motion.div>
                </div>
                
                <div className="text-lg md:text-xl text-gray-300 font-body mt-6 tracking-wide">
                  Cinematic Entertainment Hub
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-6"
              >
                <div className="text-white font-body text-lg">
                  {loadingText}{dots}
                </div>
                
                {/* Custom Progress Bar */}
                <div className="w-80 mx-auto">
                  <div className="h-1 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/30">
                    <motion.div
                      className="h-full bg-gradient-to-r from-netflix-red via-red-500 to-netflix-red-light relative"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: [-100, 100] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ width: '50px' }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Loading</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (variant === 'navigation') {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-black/90 backdrop-blur-md border border-netflix-red/20 rounded-2xl p-8 text-center shadow-2xl"
            >
              <div className="relative mb-6">
                {/* Animated Film Icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 opacity-30"
                >
                  <Film size={40} className="text-netflix-red" />
                </motion.div>
                
                <h2 className="text-3xl font-heading font-bold text-white relative z-10">
                  zeni<span className="text-netflix-red">X</span>
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 text-white">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Play size={20} className="text-netflix-red" />
                  </motion.div>
                  <span className="font-body">{loadingText}{dots}</span>
                </div>
                
                {/* Mini Progress Bar */}
                <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    className="h-full bg-netflix-red"
                    animate={{ x: [-48, 48] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{ width: '50%' }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Component/Page variant
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
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className={`${sizeClasses[size]} border-4 border-gray-700/30 border-t-netflix-red rounded-full`}
            />
            
            {/* Inner Film Icon */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Film size={size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : 40} className="text-netflix-red" />
            </motion.div>
          </div>
          
          <div className="text-center space-y-3">
            <p className="text-white font-body text-lg">{loadingText}{dots}</p>
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="text-netflix-red animate-pulse" size={16} />
              <span className="text-gray-400 text-sm font-body">Premium Entertainment</span>
              <Sparkles className="text-netflix-red animate-pulse" size={16} />
            </div>
            
            {/* Small progress indicator */}
            <div className="w-32 h-0.5 bg-gray-800 rounded-full overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-netflix-red"
                animate={{ x: [-32, 32] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: '40%' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZeniXLoader;
