"use client"
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Movie, TVShow } from "@/types";

interface TrendingItemProps {
  item: (Movie | TVShow) & { media_type?: "movie" | "tv" };
  onClick: (title: string) => void;
  index: number;
}

const TrendingItem: React.FC<TrendingItemProps> = ({ item, onClick, index }) => {
  let title: string = "";
  let year: string = "";
  let label: string = "";

  if (item.media_type === "movie") {
    const movie = item as Movie;
    title = movie.title;
    year = movie.release_date?.slice(0, 4) || "N/A";
    label = "Movie";
  } else if (item.media_type === "tv") {
    const tv = item as TVShow;
    title = tv.name;
    year = tv.first_air_date?.slice(0, 4) || "N/A";
    label = "TV Show";
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 4 }}
      onClick={() => onClick(title)}
      className="flex items-center space-x-4 p-4 glass-card hover:glass-card-hover rounded-xl cursor-pointer transition-all duration-300 group border border-glass-border/10 hover:border-netflix-red/30"
    >
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-netflix rounded-full text-white font-bold text-sm shadow-netflix group-hover:scale-110 transition-transform duration-300">
        {index + 1}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-text-primary font-medium text-sm group-hover:text-netflix-red transition-colors duration-300">
          {title}
        </p>
        <p className="text-text-muted text-xs">
          {label} • {year}
        </p>
      </div>
      <TrendingUp size={18} className="text-netflix-red group-hover:scale-110 transition-transform duration-300" />
    </motion.div>
  );
};

export default TrendingItem;
