
// ABOUTME: Acervo page with enhanced filtering, search, and responsive design

import React, { useState } from 'react';
import { useAcervoDataQuery } from '../../packages/hooks/useAcervoDataQuery';
import { ClientSideSorter } from '../components/acervo/ClientSideSorter';
import { SearchInput } from '../components/acervo/SearchInput';
import { TagsPanel } from '../components/acervo/TagsPanel';
import { MasonryGrid } from '../components/acervo/MasonryGrid';
import { MobileTagsModal } from '../components/acervo/MobileTagsModal';
import { useIsMobile } from '../hooks/use-mobile';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Filter } from 'lucide-react';

const AcervoPage = () => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_viewed'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileTagsOpen, setIsMobileTagsOpen] = useState(false);
  
  const isMobile = useIsMobile();
  const { data, isLoading, error } = useAcervoDataQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert>
          <AlertDescription>
            Erro ao carregar o acervo: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-muted-foreground">Nenhum conteúdo disponível</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-l-4 border-primary bg-muted/50 p-6 rounded-r-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Acervo</h1>
          <p className="text-muted-foreground">
            Explore nossa coleção completa de reviews e análises científicas.
          </p>
        </div>

        {/* Search and Mobile Filter Button */}
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchInput 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar reviews, temas, assuntos..."
            />
          </div>
          {isMobile && (
            <Button
              variant="outline"
              onClick={() => setIsMobileTagsOpen(true)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          )}
        </div>

        {/* Main Content */}
        <ClientSideSorter
          reviews={data.reviews}
          selectedTags={selectedTags}
          sortBy={sortBy}
          searchQuery={searchQuery}
          allTags={data.tags}
        >
          {({ reviews, tags, stats }) => (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Desktop Tags Panel */}
              {!isMobile && (
                <div className="lg:col-span-1">
                  <TagsPanel
                    tags={tags}
                    selectedTags={selectedTags}
                    onTagToggle={(tagId) => {
                      setSelectedTags(prev => 
                        prev.includes(tagId) 
                          ? prev.filter(id => id !== tagId)
                          : [...prev, tagId]
                      );
                    }}
                    onClearAll={() => setSelectedTags([])}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    totalReviews={stats.totalReviews}
                  />
                </div>
              )}

              {/* Reviews Grid */}
              <div className={isMobile ? "col-span-1" : "lg:col-span-3"}>
                <MasonryGrid reviews={reviews} />
              </div>
            </div>
          )}
        </ClientSideSorter>

        {/* Mobile Tags Modal */}
        {isMobile && (
          <MobileTagsModal
            isOpen={isMobileTagsOpen}
            onClose={() => setIsMobileTagsOpen(false)}
            tags={data.tags}
            selectedTags={selectedTags}
            onTagToggle={(tagId) => {
              setSelectedTags(prev => 
                prev.includes(tagId) 
                  ? prev.filter(id => id !== tagId)
                  : [...prev, tagId]
              );
            }}
            onClearAll={() => setSelectedTags([])}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}
      </div>
    </div>
  );
};

export default AcervoPage;
