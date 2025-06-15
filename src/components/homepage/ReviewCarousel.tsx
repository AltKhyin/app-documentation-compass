
// ABOUTME: Module component for displaying a horizontal carousel of review cards.

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewCard, { Review } from './ReviewCard';

interface ReviewCarouselProps {
  title: string;
  reviews: Review[];
}

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({ title, reviews }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-foreground text-2xl font-bold mb-4">{title}</h2>
        <div className="bg-muted rounded-md p-8 text-center">
          <p className="text-muted-foreground">Nenhuma edição disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground text-2xl font-bold">{title}</h2>
        
        {/* Desktop Navigation Arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-accent transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-accent transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Scrollable Reviews Container */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review) => (
          <div key={review.id} className="flex-shrink-0 w-64">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCarousel;
