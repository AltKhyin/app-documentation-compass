
// ABOUTME: Atomic component for displaying a single review card with cover image and metadata.

import React from 'react';
import { Eye } from 'lucide-react';

export interface Review {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  published_at: string;
  view_count: number;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div 
      className="relative bg-background rounded-md overflow-hidden cursor-pointer group transition-transform duration-200 hover:scale-105 border border-border shadow-md"
      onClick={() => window.location.href = `/reviews/${review.id}`}
    >
      {/* Cover Image Background */}
      <div 
        className="w-full h-48 bg-cover bg-center"
        style={{ 
          backgroundImage: review.cover_image_url ? `url(${review.cover_image_url})` : 'none',
          backgroundColor: review.cover_image_url ? 'transparent' : 'hsl(var(--surface))'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 leading-tight">
            {review.title}
          </h3>
          
          {/* View count with eye icon */}
          <div className="flex items-center text-white/90 text-xs">
            <Eye size={12} className="mr-1" />
            <span>{review.view_count.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
