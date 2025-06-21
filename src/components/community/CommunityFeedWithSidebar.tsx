import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { PostCard } from './PostCard';
import { CommunitySidebar } from './CommunitySidebar';
import { CommunityErrorBoundary } from './CommunityErrorBoundary';
import { CommunityLoadingState } from './CommunityLoadingState';
import { NetworkAwareFallback, useNetworkStatus } from './NetworkAwareFallback';
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
  error = null,
}: CommunityFeedWithSidebarProps) => {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();

  const handleCreatePost = () => {
    navigate('/comunidade/criar');
  };

  const handleRetry = () => {
    window.location.reload();
  };

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

  return (
    // This `flex-1` class is the second part of the fix.
    // It tells this component to grow and fill the vertical space provided by its new
    // full-height parent in `CommunityPage.tsx`.
    <div className="container mx-auto px-4 py-6 flex-1">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main Feed Column */}
        <div className="min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Comunidade</h1>
            <Button onClick={handleCreatePost}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Discussão
            </Button>
          </div>

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
                  <Button variant="outline" onClick={handleCreatePost}>
                    Criar a primeira discussão
                  </Button>
                </div>
              ) : (
                <>
                  {posts.map(post => (
                    <CommunityErrorBoundary key={post.id} context={`post ${post.id}`}>
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
        </div>

        {/* Sidebar Column - Will now scroll correctly with the feed */}
        {sidebarData && (
          <div className="hidden lg:block w-full">
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
};