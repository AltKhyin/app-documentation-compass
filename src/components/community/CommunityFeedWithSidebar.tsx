// ABOUTME: Unified two-column layout following standard container pattern - matches Homepage/Acervo.
// CORRECTED: Replaced Flexbox with a more robust CSS Grid layout to resolve page overflow issues.
// The sidebar will scroll with the content feed.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { PostCard } from './PostCard';
import { CommunitySidebar } from './CommunitySidebar';
import { CommunityErrorBoundary } from './CommunityErrorBoundary';
import { CommunityLoadingState } from './CommunityLoadingState';
import { NetworkAwareFallback, useNetworkStatus } from './NetworkAwareFallback';
import { useIsMobile } from '../../hooks/use-mobile';
import type { CommunityPost, SidebarData } from '../../types/community';

interface CommunityFeedWithSidebarProps {
  posts: CommunityPost[];
  sidebarData?: SidebarData;
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  lastSync?: Date;
  isLoading?: boolean;
  error?: Error | null;
}

export const CommunityFeedWithSidebar = ({
  posts,
  sidebarData,
  onLoadMore,
  hasMore,
  isLoadingMore,
  lastSync,
  isLoading = false,
  error = null
}: CommunityFeedWithSidebarProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isOnline } = useNetworkStatus();

  const handleCreatePost = () => {
    navigate('/comunidade/criar');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Show network-aware fallback for offline scenarios
  if (!isOnline && posts.length === 0) {
    return (
      <NetworkAwareFallback
        isOnline={isOnline}
        lastSync={lastSync}
        onRetry={handleRetry}
        context="comunidade"
      />
    );
  }

  // If on mobile, use a simpler flex-col layout.
  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-8">
          <div className="min-w-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Comunidade</h1>
              <Button onClick={handleCreatePost} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova
              </Button>
            </div>
            {/* Feed Content ... */}
            <FeedContent />
          </div>
        </div>
      </div>
    );
  }

  // For desktop, use a robust CSS Grid layout to manage columns.
  // This is more stable for this page structure than flexbox.
  // It creates a flexible main column and a fixed-width sidebar.
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-8">
        {/* Main Feed Column */}
        <div className="min-w-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Comunidade</h1>
            <Button onClick={handleCreatePost}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Discussão
            </Button>
          </div>
          <FeedContent />
        </div>

        {/* Sidebar Column - Scrolls with the feed */}
        {sidebarData && (
          <div className="w-full">
            <CommunityErrorBoundary context="sidebar da comunidade">
              <CommunitySidebar 
                rules={sidebarData.rules}
                links={sidebarData.links}
                trendingDiscussions={sidebarData.trendingDiscussions}
                featuredPoll={sidebarData.featuredPoll}
                recentActivity={sidebarData.recentActivity}
              />
            </CommunityErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );

  // Helper component to avoid duplicating the feed logic
  function FeedContent() {
    return (
      <>
        <NetworkAwareFallback
          isOnline={isOnline}
          lastSync={lastSync}
          showCachedBadge={posts.length > 0}
          context="discussões"
        />
        <CommunityErrorBoundary context="feed da comunidade" showDetails={false}>
          <div className="space-y-4">
            {posts.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Nenhuma discussão encontrada.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleCreatePost}
                >
                  Criar a primeira discussão
                </Button>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <CommunityErrorBoundary 
                    key={post.id} 
                    context={`post ${post.id}`}
                  >
                    <PostCard post={post} />
                  </CommunityErrorBoundary>
                ))}
                {hasMore && (
                  <div className="flex justify-center pt-6">
                    {isLoadingMore ? (
                      <CommunityLoadingState 
                        variant="minimal" 
                        description="Carregando mais discussões..."
                      />
                    ) : (
                      <Button
                        variant="outline"
                        onClick={onLoadMore}
                        disabled={!isOnline}
                      >
                        {!isOnline ? 'Sem conexão' : 'Carregar mais'}
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </CommunityErrorBoundary>
      </>
    );
  }
};