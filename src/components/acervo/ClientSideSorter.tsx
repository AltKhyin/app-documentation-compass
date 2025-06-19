
// ABOUTME: Client-side sorting and filtering logic for Acervo reviews with search and tag filtering.
import React, { useMemo } from 'react';
import { AcervoReview } from '../../../packages/hooks/useAcervoDataQuery';

interface ClientSideSorterProps {
  reviews: AcervoReview[];
  selectedTags: string[];
  searchQuery: string;
  children: (sortedReviews: AcervoReview[]) => React.ReactNode;
}

const ClientSideSorter: React.FC<ClientSideSorterProps> = ({ 
  reviews, 
  selectedTags, 
  searchQuery,
  children 
}) => {
  const sortedAndFilteredReviews = useMemo(() => {
    let filteredReviews = [...reviews];

    // Apply search filter first
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredReviews = filteredReviews.filter(review => 
        review.title.toLowerCase().includes(query) ||
        (review.description && review.description.toLowerCase().includes(query))
      );
    }

    // If no tags selected, return reviews sorted by date (newest first)
    if (selectedTags.length === 0) {
      return filteredReviews.sort((a, b) => 
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    }

    // Calculate relevance score for each review based on matching tags
    const reviewsWithScores = filteredReviews.map(review => {
      let score = 0;
      
      // Check each selected tag against review's tags
      selectedTags.forEach(selectedTag => {
        // Check if tag matches any categoria
        if (Object.keys(review.tags_json).includes(selectedTag)) {
          score += 1;
        }
        
        // Check if tag matches any subtag
        Object.values(review.tags_json).forEach(subtags => {
          if (subtags && subtags.includes(selectedTag)) {
            score += 1;
          }
        });
      });
      
      return { review, score };
    });

    // Sort by score (highest first), then by date (newest first) for ties
    return reviewsWithScores
      .sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        return new Date(b.review.published_at).getTime() - new Date(a.review.published_at).getTime();
      })
      .map(item => item.review);
  }, [reviews, selectedTags, searchQuery]);

  return <>{children(sortedAndFilteredReviews)}</>;
};

export default ClientSideSorter;
