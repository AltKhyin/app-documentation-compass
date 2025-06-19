
// ABOUTME: Individual community post detail page with full content display and saving functionality.

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { PostDetailCard } from '../components/community/PostDetailCard';
import { useNavigate } from 'react-router-dom';
import type { CommunityPost } from '../../packages/hooks/useCommunityPageQuery';

/**
 * Fetches a single community post by ID with full details
 */
const fetchCommunityPost = async (postId: string): Promise<CommunityPost> => {
  console.log(`Fetching community post: ${postId}`);
  
  const { data, error } = await supabase.functions.invoke('get-community-post-detail', {
    body: { post_id: parseInt(postId) }
  });

  if (error) {
    console.error('Fetch community post error:', error);
    throw new Error(error.message || 'Failed to fetch community post');
  }

  return data;
};

export default function CommunityPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const {
    data: post,
    isLoading,
    error
  } = useQuery({
    queryKey: ['communityPost', postId],
    queryFn: () => fetchCommunityPost(postId!),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  if (!postId || isNaN(parseInt(postId))) {
    return <Navigate to="/comunidade" replace />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive mb-4">Erro ao carregar o post</p>
          <p className="text-muted-foreground text-sm mb-6">{error.message}</p>
          <Button onClick={() => navigate('/comunidade')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Comunidade
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-6">Post não encontrado</p>
          <Button onClick={() => navigate('/comunidade')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Comunidade
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Navigation header */}
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
      </div>

      {/* Post detail */}
      <PostDetailCard post={post} />
    </div>
  );
}
