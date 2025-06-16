
// ABOUTME: Horizontal tags panel for desktop view with categoria/subtag reveal logic.

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { AcervoTag } from '../../../packages/hooks/useAcervoDataQuery';

interface TagsPanelProps {
  allTags: AcervoTag[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
}

const TagsPanel: React.FC<TagsPanelProps> = ({ allTags, selectedTags, onTagSelect }) => {
  const [visibleSubtags, setVisibleSubtags] = useState<string[]>([]);

  // Build tag hierarchy
  const parentTags = allTags.filter(tag => tag.parent_id === null);
  const childTags = allTags.filter(tag => tag.parent_id !== null);

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

  const getTagVariant = (tagName: string): "default" | "outline" | "secondary" => {
    if (selectedTags.includes(tagName)) {
      return "default"; // Selected state: white background, dark text
    }
    if (visibleSubtags.includes(tagName)) {
      return "secondary"; // Highlighted state: dim outline, white text
    }
    return "outline"; // Unselected state: transparent background, dim white text
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-border">
      {/* Parent tags (categorias) */}
      {parentTags.map(tag => (
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
      
      {/* Visible subtags */}
      {visibleSubtags.map(subtagName => (
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
