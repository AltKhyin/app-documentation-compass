
// ABOUTME: Individual post page with Reddit-style layout and comment integration.

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { PostDetailCard } from '../components/community/PostDetailCard';
import { CommentThread } from '../components/community/CommentThread';
import { CommunitySidebar } from '../components/community/CommunitySidebar';
import { CommunityErrorBoundary } from '../components/community/CommunityErrorBoundary';
import { usePostWithCommentsQuery } from '../../packages/hooks/usePostWithCommentsQuery';
import { useIsMobile } from '../hooks/use-mobile';

const CommunityPostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const isMobile = useIsMobile();
  const { data, isLoading, error } = usePostWithCommentsQuery(
    postId ? parseInt(postId) : 0
  );

  if (!postId || isNaN(parseInt(postId))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Post não encontrado</h1>
          <p className="text-muted-foreground mb-4">
            O post que você está procurando não existe ou foi removido.
          </p>
          <Link to="/comunidade">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Comunidade
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <CommunityErrorBoundary 
        error={error} 
        resetErrorBoundary={() => window.location.reload()} 
      />
    );
  }

  if (!data?.post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Post não encontrado</h1>
          <p className="text-muted-foreground mb-4">
            O post que você está procurando não existe ou foi removido.
          </p>
          <Link to="/comunidade">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Comunidade
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Mobile navigation */}
        {isMobile && (
          <div className="sticky top-0 z-10 bg-background border-b border-community-separator px-4 py-3">
            <div className="flex items-center gap-3">
              <Link to="/comunidade">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-sm font-medium truncate">
                  {data.post.title || 'Post da Comunidade'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  r/EVIDENS
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Desktop navigation */}
        {!isMobile && (
          <div className="px-6 py-4 border-b border-community-separator">
            <div className="max-w-4xl">
              <Link to="/comunidade">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar à Comunidade
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Main content with Reddit-style two-column layout */}
        <div className="flex gap-6 px-0 md:px-6">
          {/* Left column - Post and comments */}
          <div className="flex-1 max-w-4xl">
            {/* Post detail with Reddit-style de-boxed layout */}
            <PostDetailCard post={data.post} />
            
            {/* Comments separator */}
            <Separator className="reddit-separator" />
            
            {/* Comments section */}
            <div className="px-4 py-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">Comentários</h2>
                <p className="text-sm text-muted-foreground">
                  {data.comments.length > 0 
                    ? `${data.comments.length} ${data.comments.length === 1 ? 'comentário' : 'comentários'}`
                    : 'Nenhum comentário ainda'
                  }
                </p>
              </div>
              
              {data.comments.length > 0 ? (
                <CommentThread 
                  comments={data.comments} 
                  postId={data.post.id}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Seja o primeiro a comentar neste post!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Compartilhe suas ideias e contribua para a discussão.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Sidebar (desktop only) */}
          {!isMobile && (
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-6">
                <CommunitySidebar />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPostPage;
