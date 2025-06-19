
// ABOUTME: Client-side sorting and filtering logic for the Acervo page with corrected tag priority sorting

import React, { useMemo } from 'react';
import type { Review, Tag } from '../../types';

interface ClientSideSorterProps {
  reviews: Review[];
  selectedTags: number[];
  sortBy: 'newest' | 'oldest' | 'most_viewed';
  searchQuery: string;
  allTags: Tag[];
  children: (sortedData: { 
    reviews: Review[]; 
    tags: Tag[]; 
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
        const reviewTagIds = review.tags?.map(tag => tag.id) || [];
        const hasSelectedTag = selectedTags.some(tagId => reviewTagIds.includes(tagId));
        if (!hasSelectedTag) return false;
      }

      // Search filtering
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = review.title.toLowerCase().includes(query);
        const matchesDescription = review.description?.toLowerCase().includes(query);
        const matchesTags = review.tags?.some(tag => 
          tag.tag_name.toLowerCase().includes(query)
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
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'most_viewed':
          return (b.view_count || 0) - (a.view_count || 0);
        default:
          return 0;
      }
    });

    // Enhanced tag sorting with corrected priority algorithm
    const getTagPriority = (tag: Tag): number => {
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
