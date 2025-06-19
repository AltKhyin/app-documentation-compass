
// ABOUTME: Two-column layout component that renders community feed and sidebar with standardized error handling and mobile-first design.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { PostCard } from './PostCard';
import { CommunitySidebar } from './CommunitySidebar';
import { CommunityErrorBoundary } from './CommunityErrorBoundary';
import { CommunityLoadingState } from './CommunityLoadingState';
import { useIsMobile } from '../../hooks/use-mobile';
import type { CommunityPost, SidebarData } from '../../types/community';

interface CommunityFeedWithSidebarProps {
  posts: CommunityPost[];
  sidebarData?: SidebarData;
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
    navigate('/comunidade/criar');
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className={`flex gap-8 ${isMobile ? 'flex-col' : 'flex-row'}`}>
          {/* Main Feed Column - Mobile First */}
          <div className={`${isMobile ? 'w-full' : 'flex-1'} min-w-0`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Comunidade</h1>
              <Button onClick={handleCreatePost} size={isMobile ? "sm" : "default"}>
                <Plus className="w-4 h-4 mr-2" />
                {isMobile ? 'Nova' : 'Nova Discussão'}
              </Button>
            </div>

            {/* Posts feed with error boundary */}
            <CommunityErrorBoundary>
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

                    {/* Load more section */}
                    {hasMore && (
                      <div className="flex justify-center pt-6">
                        {isLoadingMore ? (
                          <CommunityLoadingState variant="minimal" />
                        ) : (
                          <Button
                            variant="outline"
                            onClick={onLoadMore}
                          >
                            Carregar mais
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </CommunityErrorBoundary>
          </div>

          {/* Sidebar Column - Desktop Only per [Blueprint 06] Mobile Adaptation */}
          {!isMobile && sidebarData && (
            <div className="w-80 flex-shrink-0">
              <CommunityErrorBoundary>
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
    </div>
  );
};
