/**
 * Genres Index Page
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NavBar, Footer } from "@/components";
import { getAllGenres } from "@/constants/genres";
import { Search, Flame } from "lucide-react";

const GenresIndexPage = () => {
  const allGenres = getAllGenres();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-netflix">
      <NavBar />

      {/* Hero Section */}
      <div className="pt-16">
        <div className="relative py-24 px-4 text-center bg-gradient-netflix glass shadow-netflix">
          <div className="absolute inset-0 bg-black/30 z-0" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto space-y-5"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-netflix-red">
              Explore by Genre
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Browse curated genres from action-packed blockbusters to gripping thrillers. Streamlined, sharp, and modern.
            </p>
            <div className="text-text-secondary text-sm">
              {allGenres.length} genres available
            </div>
          </motion.div>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {allGenres.map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link href={`/genres/${genre.id}`}>
                <div className={`glass-card p-5 h-44 flex flex-col justify-between hover:shadow-netflix transition-all duration-300 group cursor-pointer relative border-2 border-netflix-red/20 hover:border-netflix-red/50`}>                  
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 z-0 rounded-xl" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="text-3xl text-white group-hover:text-netflix-red group-hover:scale-110 transition-all duration-300">
                      {genre.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-netflix-red transition-colors duration-300">
                        {genre.name}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {genre.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Still undecided?
            </h2>
            <p className="text-text-muted mb-6">
              Search across genres or check what&apos;s trending globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/search">
                <button className="btn-netflix flex items-center gap-2">
                  <Search size={18} /> Search Content
                </button>
              </Link>
              <Link href="/trending">
                <button className="btn-glass flex items-center gap-4">
                  <Flame size={18} /> View Trending
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default GenresIndexPage;
