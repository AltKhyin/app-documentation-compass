
// ABOUTME: Individual community post detail page with comments and interactions.

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PostDetailCard } from '../components/community/PostDetailCard';
import { CommunityErrorBoundary } from '../components/community/CommunityErrorBoundary';
import { CommunityLoadingState } from '../components/community/CommunityLoadingState';
import { usePostDetailQuery } from '../../packages/hooks/usePostDetailQuery';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { CommunityPost } from '../types/community';

export default function CommunityPostPage() {
  const { postId } = useParams<{ postId: string }>();
  
  if (!postId || isNaN(Number(postId))) {
    return <Navigate to="/comunidade" replace />;
  }

  const {
    data: post,
    isLoading,
    error,
    refetch
  } = usePostDetailQuery(Number(postId));

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar o post: {error.message}
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <CommunityLoadingState variant="post" />
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/comunidade" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <CommunityErrorBoundary>
        <PostDetailCard post={post as CommunityPost} />
      </CommunityErrorBoundary>
    </div>
  );
}
