'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import UserAvatar from './UserAvatar';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  spoiler: boolean;
  likes: number;
  dislikes: number;
  createdAt: string;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface ReviewCardProps {
  review: Review;
  onLike?: (reviewId: string) => void;
  onDislike?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
}

export default function ReviewCard({ review, onLike, onDislike, onReport }: ReviewCardProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);

  const maxLength = 200;
  const shouldTruncate = review.comment.length > maxLength;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <UserAvatar 
            user={{ name: review.userName, profileImage: review.userAvatar }} 
            size="md" 
          />
          <div>
            <h4 className="text-white font-medium">{review.userName}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        {review.spoiler && !showSpoiler ? (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-center">
            <p className="text-yellow-400 font-medium mb-2">⚠️ Spoiler Alert</p>
            <button
              onClick={() => setShowSpoiler(true)}
              className="text-yellow-400 hover:text-yellow-300 underline text-sm"
            >
              Click to reveal spoiler
            </button>
          </div>
        ) : (
          <div className="text-gray-300 leading-relaxed">
            {shouldTruncate && !showFullReview ? (
              <>
                {review.comment.slice(0, maxLength)}...
                <button
                  onClick={() => setShowFullReview(true)}
                  className="text-netflix-red hover:text-netflix-red-light ml-2 font-medium"
                >
                  Read more
                </button>
              </>
            ) : (
              <>
                {review.comment}
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullReview(false)}
                    className="text-netflix-red hover:text-netflix-red-light ml-2 font-medium"
                  >
                    Show less
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike?.(review.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              review.isLiked
                ? 'bg-green-500/20 text-green-400'
                : 'hover:bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <ThumbsUp size={14} />
            <span className="text-sm">{review.likes}</span>
          </button>
          
          <button
            onClick={() => onDislike?.(review.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
              review.isDisliked
                ? 'bg-red-500/20 text-red-400'
                : 'hover:bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <ThumbsDown size={14} />
            <span className="text-sm">{review.dislikes}</span>
          </button>
        </div>
        
        <button
          onClick={() => onReport?.(review.id)}
          className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
        >
          Report
        </button>
      </div>
    </motion.div>
  );
}
