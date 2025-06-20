
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
  
  // Validate postId parameter
  if (!postId || isNaN(Number(postId))) {
    console.error('Invalid postId parameter:', postId);
    return <Navigate to="/comunidade" replace />;
  }

  const numericPostId = Number(postId);
  console.log('CommunityPostPage: Loading post with ID:', numericPostId);

  const {
    data: post,
    isLoading,
    error,
    refetch
  } = usePostDetailQuery(numericPostId);

  if (error) {
    console.error('Error loading post:', error);
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || 'Erro ao carregar o post'}
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
    console.error('No post data received');
    return <Navigate to="/comunidade" replace />;
  }

  console.log('CommunityPostPage: Rendering post:', post);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <CommunityErrorBoundary>
        <PostDetailCard post={post as CommunityPost} />
      </CommunityErrorBoundary>
    </div>
  );
}
