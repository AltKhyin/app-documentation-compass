
// ABOUTME: Module component for displaying the featured review hero section.

import React from 'react';
import { Review } from './ReviewCard';

interface FeaturedReviewProps {
  review: Review | null;
}

const FeaturedReview: React.FC<FeaturedReviewProps> = ({ review }) => {
  if (!review) {
    return (
      <div className="w-full h-96 bg-muted rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">Nenhuma edição em destaque</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-96 bg-cover bg-center rounded-md overflow-hidden cursor-pointer"
      style={{ 
        backgroundImage: review.cover_image_url ? `url(${review.cover_image_url})` : 'none',
        backgroundColor: review.cover_image_url ? 'transparent' : 'hsl(var(--muted))'
      }}
      onClick={() => window.location.href = `/reviews/${review.id}`}
    >
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      
      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-center max-w-2xl">
        {/* Edition tag */}
        <div className="mb-4">
          <span className="text-white/80 text-sm font-medium bg-black/30 px-3 py-1 rounded-md">
            Edição #{review.id}
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
          {review.title}
        </h1>
        
        {/* Description */}
        {review.description && (
          <p className="text-white/90 text-lg mb-6 leading-relaxed max-w-xl">
            {review.description}
          </p>
        )}
        
        {/* CTA Button */}
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors w-fit">
          Ler agora
        </button>
      </div>
    </div>
  );
};

export default FeaturedReview;
