
// ABOUTME: Client-side sorting logic component for Acervo reviews based on selected tags.

import React, { useMemo } from 'react';
import { AcervoReview } from '../../../packages/hooks/useAcervoDataQuery';

interface ClientSideSorterProps {
  reviews: AcervoReview[];
  selectedTags: string[];
  children: (sortedReviews: AcervoReview[]) => React.ReactNode;
}

const ClientSideSorter: React.FC<ClientSideSorterProps> = ({ reviews, selectedTags, children }) => {
  const sortedReviews = useMemo(() => {
    if (selectedTags.length === 0) {
      // Default sort: chronological by published_at (newest first)
      return [...reviews].sort((a, b) => 
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    }

    // Score each review based on tag matches
    const scoredReviews = reviews.map(review => {
      let score = 0;
      
      // Check all tags associated with this review
      Object.keys(review.tags_json).forEach(categoria => {
        // Check if categoria is selected
        if (selectedTags.includes(categoria)) {
          score += 1;
        }
        
        // Check if any subtags are selected
        review.tags_json[categoria].forEach(subtag => {
          if (selectedTags.includes(subtag)) {
            score += 1;
          }
        });
      });

      return { review, score };
    });

    // Sort by score (highest first), then by publication date (newest first) for tie-breaking
    return scoredReviews
      .sort((a, b) => {
        if (a.score === b.score) {
          return new Date(b.review.published_at).getTime() - new Date(a.review.published_at).getTime();
        }
        return b.score - a.score;
      })
      .map(item => item.review);
  }, [reviews, selectedTags]);

  return <>{children(sortedReviews)}</>;
};

export default ClientSideSorter;
