
// ABOUTME: Responsive masonry grid component for displaying review cards with mobile optimization.

import React from 'react';
import ReviewCard from './ReviewCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { AcervoReview } from '../../../packages/hooks/useAcervoDataQuery';

interface MasonryGridProps {
  reviews: AcervoReview[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ reviews }) => {
  const isMobile = useIsMobile();

  return (
    <div className={`${
      isMobile 
        ? 'grid grid-cols-2 gap-4' // Mobile: 2 columns per DOC_8 RULE 6
        : 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'
    }`}>
      {reviews.map((review) => (
        <div 
          key={review.review_id} 
          className={`${
            isMobile 
              ? 'w-full' // Mobile: use full width of grid column
              : 'break-inside-avoid mb-4'
          }`}
        >
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
