
// ABOUTME: Masonry grid layout for displaying review cards using CSS columns.

import React from 'react';
import ReviewCard from './ReviewCard';
import { AcervoReview } from '../../../packages/hooks/useAcervoDataQuery';

interface MasonryGridProps {
  reviews: AcervoReview[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ reviews }) => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 p-4">
      {reviews.map(review => (
        <ReviewCard key={review.review_id} review={review} />
      ))}
    </div>
  );
};

export default MasonryGrid;
