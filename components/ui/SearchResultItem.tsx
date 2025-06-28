"use client"
import { motion } from "framer-motion";
import { Star, Heart, Calendar, Eye } from "lucide-react";
import Link from "next/link";

interface BaseItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity?: number;
  media_type?: "movie" | "tv";
}

interface SearchResultItemProps {
  item: BaseItem;
//   onSelect: (item: BaseItem) => void;
  onBookmark: (item: BaseItem) => void;
  isBookmarked: boolean;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item, onBookmark, isBookmarked }) => {
  // Determine the correct route based on media type
  const mediaRoute = item.media_type === 'tv' ? `/tv-shows/${item.id}` : `/movies/${item.id}`;
  
  return (
    <Link href={mediaRoute}>
      <motion.div
        whileHover={{ y: -2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-bg-secondary border border-bg-tertiary hover:border-netflix-red/30 rounded-lg overflow-hidden cursor-pointer transition-all duration-300"
      >
        <div className="relative w-full h-[340px] overflow-hidden bg-bg-tertiary">
          <img
            src={item.poster_path ? `https://image.tmdb.org/t/p/w400${item.poster_path}` : '/placeholder-poster.jpg'}
            alt={item.title || item.name || 'Media poster'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Bookmark button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBookmark(item);
            }}
            className="absolute top-2 right-2 p-2 bg-bg-primary/80 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Heart 
              size={14} 
              className={`transition-colors duration-300 ${
                isBookmarked 
                  ? 'text-netflix-red fill-current' 
                  : 'text-text-muted hover:text-netflix-red'
              }`} 
            />
          </button>

          {/* Rating badge */}
          {item.vote_average !== undefined && item.vote_average > 0 && (
            <div className="absolute top-2 left-2 flex items-center bg-bg-primary/80 px-2 py-1 rounded-md">
              <Star size={12} className="text-accent-gold fill-current mr-1" />
              <span className="text-white text-xs font-medium">{item.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Media type badge */}
          {item.media_type && (
            <div className="absolute bottom-2 left-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-md ${
                  item.media_type === 'movie'
                    ? 'bg-netflix-red text-white'
                    : 'bg-accent-blue text-white'
                }`}
              >
                {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
              </span>
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-4 space-y-3">
          <h3 className="font-medium text-base text-text-primary mb-1 line-clamp-1 group-hover:text-netflix-red transition-colors duration-200">
            {item.title || item.name || 'Untitled'}
          </h3>

          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{(item.release_date || item.first_air_date || '').slice(0, 4) || 'N/A'}</span>
            </div>
            {item.popularity !== undefined && (
              <div className="flex items-center space-x-1">
                <Eye size={12} />
                <span>{Math.round(item.popularity).toLocaleString()}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
            {item.overview || 'No description available.'}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default SearchResultItem;