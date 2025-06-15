
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
      className="relative w-full h-96 bg-cover bg-center rounded-md overflow-hidden cursor-pointer group"
      style={{ 
        backgroundImage: review.cover_image_url ? `url(${review.cover_image_url})` : 'none',
        backgroundColor: review.cover_image_url ? 'transparent' : 'hsl(var(--muted))'
      }}
      onClick={() => window.location.href = `/reviews/${review.id}`}
    >
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      
      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-center max-w-2xl">
        {/* Edition tag */}
        <div className="mb-4">
          <span className="text-white/90 text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-md border border-white/20">
            Edição #{review.id}
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-white text-4xl font-bold mb-4 leading-tight font-serif">
          {review.title}
        </h1>
        
        {/* Description */}
        {review.description && (
          <p className="text-white/90 text-lg mb-6 leading-relaxed max-w-xl font-sans">
            {review.description}
          </p>
        )}
        
        {/* CTA Button */}
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors w-fit text-sm">
          Ler agora
        </button>
      </div>
    </div>
  );
};

export default FeaturedReview;
