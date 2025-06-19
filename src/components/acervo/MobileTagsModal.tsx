
// ABOUTME: Bottom sheet modal for tag selection on mobile devices with intelligent priority sorting.

import React, { useMemo } from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Filter } from 'lucide-react';
import { AcervoTag } from '../../../packages/hooks/useAcervoDataQuery';

interface MobileTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: AcervoTag[];
  selectedTags: number[];
  onTagToggle: (tagId: number) => void;
  onClearAll: () => void;
  sortBy: 'newest' | 'oldest' | 'most_viewed';
  onSortChange: (sortBy: 'newest' | 'oldest' | 'most_viewed') => void;
}

const MobileTagsModal: React.FC<MobileTagsModalProps> = ({ 
  isOpen, 
  onClose, 
  tags, 
  selectedTags, 
  onTagToggle, 
  onClearAll,
  sortBy,
  onSortChange 
}) => {
  const parentTags = tags.filter(tag => tag.parent_id === null);
  const childTags = tags.filter(tag => tag.parent_id !== null);

  // Intelligent sorting for parent tags: selected first, then alphabetical
  const sortedParentTags = useMemo(() => {
    return [...parentTags].sort((a, b) => {
      const aSelected = selectedTags.includes(a.id);
      const bSelected = selectedTags.includes(b.id);
      
      // Selected tags first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      // If both selected or both unselected, maintain alphabetical order
      return a.tag_name.localeCompare(b.tag_name);
    });
  }, [parentTags, selectedTags]);

  // Function to sort subtags by priority: selected first, then alphabetical
  const getSortedSubtags = (parentId: number) => {
    const subtags = childTags.filter(child => child.parent_id === parentId);
    return subtags.sort((a, b) => {
      const aSelected = selectedTags.includes(a.id);
      const bSelected = selectedTags.includes(b.id);
      
      // Selected subtags first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      // If both selected or both unselected, maintain alphabetical order
      return a.tag_name.localeCompare(b.tag_name);
    });
  };

  const getTagVariant = (tagId: number): "default" | "outline" | "secondary" => {
    return selectedTags.includes(tagId) ? "default" : "outline";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="bg-background w-full h-[80vh] rounded-t-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Filtrar por Categoria</h2>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('newest')}
            >
              Mais Recentes
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('oldest')}
            >
              Mais Antigos
            </Button>
            <Button
              variant={sortBy === 'most_viewed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('most_viewed')}
            >
              Mais Vistos
            </Button>
          </div>
          
          {selectedTags.length > 0 && (
            <Button variant="outline" size="sm" onClick={onClearAll}>
              Limpar Filtros ({selectedTags.length})
            </Button>
          )}
        </div>
        
        <div className="space-y-6 overflow-y-auto">
          {sortedParentTags.map(parentTag => {
            const sortedSubtags = getSortedSubtags(parentTag.id);
            
            return (
              <div key={parentTag.id} className="space-y-3">
                <div>
                  <Button
                    variant={getTagVariant(parentTag.id)}
                    size="sm"
                    onClick={() => onTagToggle(parentTag.id)}
                    className="rounded-full"
                  >
                    {parentTag.tag_name}
                  </Button>
                </div>
                {sortedSubtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-4">
                    {sortedSubtags.map(subtag => (
                      <Button
                        key={subtag.id}
                        variant={getTagVariant(subtag.id)}
                        size="sm"
                        onClick={() => onTagToggle(subtag.id)}
                        className="rounded-full text-xs"
                      >
                        {subtag.tag_name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileTagsModal;
