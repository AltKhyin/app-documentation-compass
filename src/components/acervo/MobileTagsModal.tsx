
// ABOUTME: Bottom sheet modal for tag selection on mobile devices.

import React from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Filter } from 'lucide-react';
import { AcervoTag } from '../../../packages/hooks/useAcervoDataQuery';

interface MobileTagsModalProps {
  allTags: AcervoTag[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
}

const MobileTagsModal: React.FC<MobileTagsModalProps> = ({ allTags, selectedTags, onTagSelect }) => {
  const parentTags = allTags.filter(tag => tag.parent_id === null);
  const childTags = allTags.filter(tag => tag.parent_id !== null);

  const getTagVariant = (tagName: string): "default" | "outline" | "secondary" => {
    return selectedTags.includes(tagName) ? "default" : "outline";
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="mb-4">
          <Filter className="w-4 h-4 mr-2" />
          Categorias
          {selectedTags.length > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {selectedTags.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filtrar por Categoria</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 overflow-y-auto">
          {parentTags.map(parentTag => {
            const subtags = childTags.filter(child => child.parent_id === parentTag.id);
            
            return (
              <div key={parentTag.id} className="space-y-3">
                <div>
                  <Button
                    variant={getTagVariant(parentTag.tag_name)}
                    size="sm"
                    onClick={() => onTagSelect(parentTag.tag_name)}
                    className="rounded-full"
                  >
                    {parentTag.tag_name}
                  </Button>
                </div>
                {subtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-4">
                    {subtags.map(subtag => (
                      <Button
                        key={subtag.id}
                        variant={getTagVariant(subtag.tag_name)}
                        size="sm"
                        onClick={() => onTagSelect(subtag.tag_name)}
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileTagsModal;
