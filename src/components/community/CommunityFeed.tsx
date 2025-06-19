
// ABOUTME: Main community feed component with infinite scroll and category filtering.

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Loader2, Plus } from 'lucide-react';
import { useCommunityFeedQuery } from '../../../packages/hooks/useCommunityFeedQuery';
import { PostCard } from './PostCard';
import { CreatePostDialog } from './CreatePostDialog';

const CATEGORIES = [
  { value: 'all', label: 'Todas as Categorias' },
  { value: 'general', label: 'Discussão Geral' },
  { value: 'review_discussion', label: 'Discussão de Review' },
  { value: 'question', label: 'Perguntas' },
  { value: 'announcement', label: 'Anúncios' }
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recentes' },
  { value: 'popular', label: 'Populares' },
  { value: 'trending', label: 'Em Alta' }
];

export const CommunityFeed = () => {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useCommunityFeedQuery({ category, sort });

  const allPosts = data?.pages.flatMap(page => page.posts) || [];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-destructive mb-4">Erro ao carregar discussões da comunidade</p>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters and create button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs value={sort} onValueChange={(value) => setSort(value as any)}>
            <TabsList>
              {SORT_OPTIONS.map(option => (
                <TabsTrigger key={option.value} value={option.value}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Discussão
        </Button>
      </div>

      {/* Posts feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : allPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma discussão encontrada nesta categoria.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Criar a primeira discussão
            </Button>
          </div>
        ) : (
          <>
            {allPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Load more button */}
            {hasNextPage && (
              <div className="flex justify-center pt-6">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create post dialog */}
      <CreatePostDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        defaultCategory={category === 'all' ? 'general' : category}
      />
    </div>
  );
};
