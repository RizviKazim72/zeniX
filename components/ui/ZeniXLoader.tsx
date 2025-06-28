'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Play, Sparkles } from 'lucide-react';

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

  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

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

  const shimmerVariants = {
    animate: {
      x: [-100, 100],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear" as any
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
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
            
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-netflix-red rounded-full"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0
                  }}
                  animate={{
                    y: [null, -20],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
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
                <div className="relative">
                  <h1 className="text-6xl md:text-8xl font-heading font-black text-white tracking-wider">
                    zeni<span className="text-netflix-red">X</span>
                  </h1>
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }}
                  />
                </div>
                
                <div className="text-lg md:text-xl text-gray-400 font-body mt-4 tracking-wide">
                  Cinematic Entertainment Hub
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="animate-spin text-netflix-red" size={24} />
                  <span className="text-white font-body">{loadingText}{dots}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    className="h-full bg-gradient-to-r from-netflix-red to-red-600"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
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
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center"
            >
              <div className="relative mb-4">
                <h2 className="text-3xl font-heading font-bold text-white">
                  zeni<span className="text-netflix-red">X</span>
                </h2>
              </div>
              
              <div className="flex items-center space-x-3 text-white">
                <Loader2 className="animate-spin text-netflix-red" size={20} />
                <span className="font-body">{loadingText}{dots}</span>
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
          className="flex flex-col items-center justify-center p-8 space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} border-4 border-gray-700 border-t-netflix-red rounded-full`}
          />
          
          <div className="text-center space-y-2">
            <p className="text-white font-body text-lg">{loadingText}{dots}</p>
            <div className="flex items-center justify-center space-x-1">
              <Sparkles className="text-netflix-red" size={16} />
              <span className="text-gray-400 text-sm font-body">ZeniX Experience</span>
              <Sparkles className="text-netflix-red" size={16} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZeniXLoader;
