
// ABOUTME: Community feed component with infinite scroll and post creation integration

import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { PostCard } from './PostCard';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommunityPost {
  id: number;
  title: string | null;
  content: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  upvotes: number;
  downvotes: number;
  created_at: string;
  category: string;
  user_vote: string | null;
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  flair_text: string | null;
  flair_color: string | null;
  post_type: string;
  structured_content: Record<string, any> | null;
}

const fetchCommunityFeed = async ({ pageParam = 0 }) => {
  // Use the edge function instead of RPC to avoid type issues
  const { data, error } = await supabase.functions.invoke('get-community-feed', {
    body: {
      page: pageParam,
      limit: 10
    }
  });

  if (error) {
    console.error('Community feed fetch error:', error);
    throw new Error(error.message);
  }

  return {
    posts: data?.posts || [],
    nextCursor: data?.pagination?.hasMore ? pageParam + 1 : null
  };
};

export const CommunityFeed = () => {
  const navigate = useNavigate();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['community-feed'],
    queryFn: fetchCommunityFeed,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });

  if (status === 'pending') {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex gap-4">
              <Skeleton className="w-12 h-20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <Alert>
        <AlertDescription>
          Erro ao carregar o feed da comunidade: {error?.message}
        </AlertDescription>
      </Alert>
    );
  }

  const allPosts = data?.pages.flatMap(page => page.posts) || [];

  return (
    <div className="space-y-6">
      {/* Feed Header with Sort and Create Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Discussões Recentes</h2>
        </div>
        <Button onClick={() => navigate('/community/submit')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Discussão
        </Button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {allPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhuma discussão encontrada. Seja o primeiro a iniciar uma conversa!
            </p>
            <Button onClick={() => navigate('/community/submit')}>
              Criar Primeira Discussão
            </Button>
          </div>
        ) : (
          allPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar Mais'}
          </Button>
        </div>
      )}
    </div>
  );
};
