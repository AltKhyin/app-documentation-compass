
// ABOUTME: Dedicated page for managing saved community posts with search, filters, and bulk actions.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, ArrowLeft, Search, Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { useSavedPostsQuery } from '../../packages/hooks/useSavedPostsQuery';
import { useSavePostMutation } from '../../packages/hooks/useSavePostMutation';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const CATEGORY_LABELS: Record<string, string> = {
  general: 'Discussão Geral',
  review_discussion: 'Review',
  question: 'Pergunta',
  announcement: 'Anúncio'
};

export default function SavedPostsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<Set<number>>(new Set());
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useSavedPostsQuery();

  const savePostMutation = useSavePostMutation();

  const savedPosts = data?.posts || [];

  // Filter posts based on search query
  const filteredPosts = savedPosts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePostClick = (postId: number) => {
    navigate(`/comunidade/${postId}`);
  };

  const handleUnsavePost = async (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await savePostMutation.mutateAsync({
        post_id: postId,
        is_saved: false
      });
      
      toast.success('Post removido dos salvos');
    } catch (error) {
      toast.error('Erro ao remover post. Tente novamente.');
    }
  };

  const handleSelectPost = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedPosts);
    
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    
    setSelectedPosts(newSelected);
  };

  const handleBulkUnsave = async () => {
    if (selectedPosts.size === 0) return;
    
    try {
      const promises = Array.from(selectedPosts).map(postId => 
        savePostMutation.mutateAsync({
          post_id: postId,
          is_saved: false
        })
      );
      
      await Promise.all(promises);
      setSelectedPosts(new Set());
      toast.success(`${selectedPosts.size} posts removidos dos salvos`);
    } catch (error) {
      toast.error('Erro ao remover posts. Tente novamente.');
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive mb-4">Erro ao carregar posts salvos</p>
          <p className="text-muted-foreground text-sm mb-6">{error.message}</p>
          <Button onClick={() => navigate('/comunidade')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Comunidade
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          onClick={() => navigate('/comunidade')} 
          variant="ghost" 
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Comunidade
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-primary" />
              Posts Salvos
            </h1>
            <p className="text-muted-foreground">
              {savedPosts.length > 0 
                ? `${savedPosts.length} ${savedPosts.length === 1 ? 'post salvo' : 'posts salvos'}`
                : 'Nenhum post salvo ainda'
              }
            </p>
          </div>
          
          {/* Bulk actions */}
          {selectedPosts.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedPosts.size} selecionados
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkUnsave}
                disabled={savePostMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover Selecionados
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      {savedPosts.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar nos posts salvos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && savedPosts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum post salvo</h3>
            <p className="text-muted-foreground mb-6">
              Comece salvando posts interessantes da comunidade para acessá-los facilmente depois.
            </p>
            <Button onClick={() => navigate('/comunidade')}>
              Explorar Comunidade
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Saved Posts List */}
      {!isLoading && filteredPosts.length > 0 && (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className={cn(
                "cursor-pointer hover:shadow-md transition-all",
                selectedPosts.has(post.id) && "ring-2 ring-primary/50 bg-primary/5"
              )}
              onClick={() => handlePostClick(post.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Selection checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post.id)}
                      onChange={(e) => handleSelectPost(post.id, e)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>

                  {/* Post content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.category && (
                          <Badge variant="secondary" className="text-xs">
                            {CATEGORY_LABELS[post.category] || post.category}
                          </Badge>
                        )}
                        <span className="text-muted-foreground text-xs">
                          Salvo {formatDistanceToNow(new Date(post.saved_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleUnsavePost(post.id, e)}
                          disabled={savePostMutation.isPending}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          title="Remover dos salvos"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePostClick(post.id);
                          }}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          title="Abrir post"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {post.title && (
                      <h3 className="font-semibold text-foreground mb-2 leading-tight">
                        {post.title}
                      </h3>
                    )}

                    {post.content && (
                      <div 
                        className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
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
        </div>
      )}

      {/* No search results */}
      {!isLoading && savedPosts.length > 0 && filteredPosts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar sua busca ou limpar o filtro.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
