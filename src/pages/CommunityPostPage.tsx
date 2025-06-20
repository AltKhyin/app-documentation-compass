
// ABOUTME: Community post detail page with integrated commenting system.

import React from 'react';
import { useParams } from 'react-router-dom';
import { usePostWithCommentsQuery } from '../../packages/hooks/usePostWithCommentsQuery';
import { PostDetailCard } from '@/components/community/PostDetailCard';
import { CommentThread } from '@/components/community/CommentThread';
import { CommentEditor } from '@/components/community/CommentEditor';
import { CommunityErrorBoundary } from '@/components/community/CommunityErrorBoundary';
import { CommunityLoadingState } from '@/components/community/CommunityLoadingState';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CommunityPost } from '../types/community';

export default function CommunityPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  // Validate postId
  const numericPostId = postId ? parseInt(postId, 10) : 0;
  if (!numericPostId || isNaN(numericPostId)) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive mb-4">Post não encontrado</h1>
          <p className="text-muted-foreground mb-6">O post que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => navigate('/comunidade')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Comunidade
          </Button>
        </div>
      </div>
    );
  }

  // Fetch post with comments using the new hook
  const { data, isLoading, error, refetch } = usePostWithCommentsQuery(numericPostId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <CommunityLoadingState 
          variant="post" 
          description="Carregando discussão e comentários..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive mb-4">Erro ao carregar</h1>
          <p className="text-muted-foreground mb-6">
            Não foi possível carregar esta discussão. Tente novamente.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
            <Button onClick={() => navigate('/comunidade')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Comunidade
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.post) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive mb-4">Post não encontrado</h1>
          <p className="text-muted-foreground mb-6">Este post não existe ou foi removido.</p>
          <Button onClick={() => navigate('/comunidade')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Comunidade
          </Button>
        </div>
      </div>
    );
  }

  const { post, comments } = data;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/comunidade')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Comunidade
        </Button>
      </div>

      {/* Main post */}
      <CommunityErrorBoundary context="post principal">
        <PostDetailCard post={post as CommunityPost} />
      </CommunityErrorBoundary>

      {/* Comments section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-5 h-5" />
          <h2 className="text-xl font-bold">
            Comentários ({comments.length})
          </h2>
        </div>

        {/* Comment editor for new top-level comments */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Adicionar comentário
          </h3>
          <CommunityErrorBoundary context="editor de comentários">
            <CommentEditor 
              parentPostId={numericPostId} 
              onCommentPosted={() => refetch()} 
            />
          </CommunityErrorBoundary>
        </div>

        {/* Comment thread */}
        <CommunityErrorBoundary context="thread de comentários">
          <CommentThread 
            comments={comments} 
            onCommentPosted={() => refetch()}
          />
        </CommunityErrorBoundary>
      </div>
    </div>
  );
}
