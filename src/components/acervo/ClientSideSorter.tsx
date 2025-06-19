
// ABOUTME: Client-side sorting and filtering logic for the Acervo page with AcervoReview types

import React, { useMemo } from 'react';
import type { AcervoReview, AcervoTag } from '../../../packages/hooks/useAcervoDataQuery';

interface ClientSideSorterProps {
  reviews: AcervoReview[];
  selectedTags: number[];
  sortBy: 'newest' | 'oldest' | 'most_viewed';
  searchQuery: string;
  allTags: AcervoTag[];
  children: (sortedData: { 
    reviews: AcervoReview[]; 
    tags: AcervoTag[]; 
    stats: { totalReviews: number; totalTags: number } 
  }) => React.ReactNode;
}

export const ClientSideSorter = ({
  reviews,
  selectedTags,
  sortBy,
  searchQuery,
  allTags,
  children
}: ClientSideSorterProps) => {
  const sortedData = useMemo(() => {
    // Filter reviews based on selected tags and search query
    let filteredReviews = reviews.filter(review => {
      // Tag filtering
      if (selectedTags.length > 0) {
        const reviewTagNames = Object.keys(review.tags_json).concat(
          Object.values(review.tags_json).flat()
        );
        const hasSelectedTag = selectedTags.some(tagId => {
          const tag = allTags.find(t => t.id === tagId);
          return tag && reviewTagNames.includes(tag.tag_name);
        });
        if (!hasSelectedTag) return false;
      }

      // Search filtering
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = review.title.toLowerCase().includes(query);
        const matchesDescription = review.description?.toLowerCase().includes(query);
        const matchesTags = Object.keys(review.tags_json).some(tag => 
          tag.toLowerCase().includes(query)
        ) || Object.values(review.tags_json).flat().some(tag =>
          tag.toLowerCase().includes(query)
        );
        
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      return true;
    });

    // Sort reviews
    filteredReviews.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        case 'oldest':
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        case 'most_viewed':
          // For AcervoReview, we don't have view_count, so maintain order
          return 0;
        default:
          return 0;
      }
    });

    // Enhanced tag sorting with corrected priority algorithm
    const getTagPriority = (tag: AcervoTag): number => {
      // Priority 1: Selected tags (highest priority)
      if (selectedTags.includes(tag.id)) {
        return 1;
      }
      
      // Priority 2: Highlighted tags (children of selected parent tags)
      const isHighlighted = selectedTags.some(selectedTagId => {
        const selectedTag = allTags.find(t => t.id === selectedTagId);
        return selectedTag && tag.parent_id === selectedTag.id;
      });
      
      if (isHighlighted) {
        return 2;
      }
      
      // Priority 3: All other tags (lowest priority)
      return 3;
    };

    const sortedTags = [...allTags].sort((a, b) => {
      const priorityA = getTagPriority(a);
      const priorityB = getTagPriority(b);
      
      // First, sort by priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort alphabetically
      return a.tag_name.localeCompare(b.tag_name, 'pt-BR');
    });

    return {
      reviews: filteredReviews,
      tags: sortedTags,
      stats: {
        totalReviews: filteredReviews.length,
        totalTags: sortedTags.length
      }
    };
  }, [reviews, selectedTags, sortBy, searchQuery, allTags]);

  return <>{children(sortedData)}</>;
};
