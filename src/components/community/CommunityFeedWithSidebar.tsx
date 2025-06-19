// ABOUTME: Two-column layout component that renders community feed and sidebar with data passed as props.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Loader2, Plus } from 'lucide-react';
import { PostCard } from './PostCard';
import { CommunitySidebar } from './CommunitySidebar';
import { useIsMobile } from '../../hooks/use-mobile';
import type { CommunityPost, CommunityPageResponse } from '../../../packages/hooks/useCommunityPageQuery';

interface CommunityFeedWithSidebarProps {
  posts: CommunityPost[];
  sidebarData?: CommunityPageResponse['sidebarData'];
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const CommunityFeedWithSidebar = ({
  posts,
  sidebarData,
  onLoadMore,
  hasMore,
  isLoadingMore
}: CommunityFeedWithSidebarProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCreatePost = () => {
    navigate('/community/submit');
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className={`flex gap-8 ${isMobile ? 'flex-col' : 'flex-row'}`}>
          {/* Main Feed Column */}
          <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Comunidade</h1>
              <Button onClick={handleCreatePost}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Discussão
              </Button>
            </div>

            {/* Posts feed */}
            <div className="space-y-4">
              {posts.length === 0 ? (
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
                    <PostCard key={post.id} post={post} />
                  ))}

                  {/* Load more button */}
                  {hasMore && (
                    <div className="flex justify-center pt-6">
                      <Button
                        variant="outline"
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                      >
                        {isLoadingMore ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        {isLoadingMore ? 'Carregando...' : 'Carregar mais'}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar Column - Only render on desktop */}
          {!isMobile && sidebarData && (
            <div className="w-80 flex-shrink-0">
              <CommunitySidebar 
                rules={sidebarData.rules}
                links={sidebarData.links}
                trendingDiscussions={sidebarData.trendingDiscussions}
                featuredPoll={sidebarData.featuredPoll}
                recentActivity={sidebarData.recentActivity}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
