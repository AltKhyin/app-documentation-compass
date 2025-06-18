
// ABOUTME: Horizontal tags panel for desktop view with categoria/subtag reveal logic and intelligent priority sorting.

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '../ui/button';
import { AcervoTag } from '../../../packages/hooks/useAcervoDataQuery';

interface TagsPanelProps {
  allTags: AcervoTag[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
}

const TagsPanel: React.FC<TagsPanelProps> = ({ allTags, selectedTags, onTagSelect }) => {
  const [visibleSubtags, setVisibleSubtags] = useState<string[]>([]);

  // Memoize tag hierarchy computation
  const { parentTags, childTags } = useMemo(() => {
    const parentTags = allTags.filter(tag => tag.parent_id === null);
    const childTags = allTags.filter(tag => tag.parent_id !== null);
    return { parentTags, childTags };
  }, [allTags]);

  // Update visible subtags when selected tags change
  useEffect(() => {
    const newVisibleSubtags: string[] = [];
    
    selectedTags.forEach(selectedTag => {
      const parentTag = parentTags.find(tag => tag.tag_name === selectedTag);
      if (parentTag) {
        // Show all subtags for this parent
        const subtags = childTags
          .filter(child => child.parent_id === parentTag.id)
          .map(child => child.tag_name);
        newVisibleSubtags.push(...subtags);
      }
    });
    
    setVisibleSubtags(newVisibleSubtags);
  }, [selectedTags, parentTags, childTags]);

  // Intelligent tag sorting with priority: selected → highlighted → unselected
  const sortedParentTags = useMemo(() => {
    return [...parentTags].sort((a, b) => {
      const aSelected = selectedTags.includes(a.tag_name);
      const bSelected = selectedTags.includes(b.tag_name);
      
      // Selected tags first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      // If both selected or both unselected, maintain alphabetical order
      return a.tag_name.localeCompare(b.tag_name);
    });
  }, [parentTags, selectedTags]);

  const sortedVisibleSubtags = useMemo(() => {
    return [...visibleSubtags].sort((a, b) => {
      const aSelected = selectedTags.includes(a);
      const bSelected = selectedTags.includes(b);
      
      // Selected subtags first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      // If both selected or both unselected, maintain alphabetical order
      return a.localeCompare(b);
    });
  }, [visibleSubtags, selectedTags]);

  const getTagVariant = useCallback((tagName: string): "default" | "outline" | "secondary" => {
    if (selectedTags.includes(tagName)) {
      return "default"; // Selected state: white background, dark text
    }
    if (visibleSubtags.includes(tagName)) {
      return "secondary"; // Highlighted state: dim outline, white text
    }
    return "outline"; // Unselected state: transparent background, dim white text
  }, [selectedTags, visibleSubtags]);

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-border">
      {/* Parent tags (categorias) - sorted by priority */}
      {sortedParentTags.map(tag => (
        <Button
          key={tag.id}
          variant={getTagVariant(tag.tag_name)}
          size="sm"
          onClick={() => onTagSelect(tag.tag_name)}
          className="rounded-full"
        >
          {tag.tag_name}
        </Button>
      ))}
      
      {/* Visible subtags - sorted by priority */}
      {sortedVisibleSubtags.map(subtagName => (
        <Button
          key={subtagName}
          variant={getTagVariant(subtagName)}
          size="sm"
          onClick={() => onTagSelect(subtagName)}
          className="rounded-full"
        >
          {subtagName}
        </Button>
      ))}
    </div>
  );
};

export default TagsPanel;
