
// ABOUTME: Individual community post page with Reddit-style two-column layout including persistent sidebar.

import React from 'react';
import { useParams } from 'react-router-dom';
import { PostDetail } from '../components/community/PostDetail';
import { CommunitySidebar } from '../components/community/CommunitySidebar';
import { CommunityErrorBoundary } from '../components/community/CommunityErrorBoundary';
import { CommunityLoadingState } from '../components/community/CommunityLoadingState';
import { usePostWithCommentsQuery } from '../../packages/hooks/usePostWithCommentsQuery';
import { useCommunityPageQuery } from '../../packages/hooks/useCommunityPageQuery';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunityPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const postId = parseInt(id || '0', 10);

  console.log('CommunityPostPage rendered with ID:', id, 'parsed as:', postId);

  // Fetch post and comments
  const { 
    data: postData, 
    isLoading: postLoading, 
    error: postError 
  } = usePostWithCommentsQuery(postId);

  // Fetch sidebar data (reuse community page query for consistency)
  const { 
    data: communityData,
    isLoading: sidebarLoading 
  } = useCommunityPageQuery();

  const handleBackToFeed = () => {
    navigate('/comunidade');
  };

  if (postLoading) {
    return (
      <div className="min-h-screen overflow-hidden">
        <div className="h-screen overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <CommunityLoadingState description="Carregando discussão..." />
          </div>
        </div>
      </div>
    );
  }

  if (postError || !postData) {
    console.error('Post error or no data:', postError, postData);
    return (
      <div className="min-h-screen overflow-hidden">
        <div className="h-screen overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Post não encontrado</h2>
              <p className="text-muted-foreground mb-6">
                Este post pode ter sido removido ou você pode não ter permissão para visualizá-lo.
              </p>
              <Button onClick={handleBackToFeed} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para a comunidade
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { post, comments } = postData;
  const sidebarData = communityData?.sidebarData;

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="h-screen overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {/* Back to feed button */}
          <div className="mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToFeed}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para a comunidade
            </Button>
          </div>

          {/* Two-column layout (Reddit-style) */}
          <div className={`flex gap-8 ${isMobile ? 'flex-col' : 'flex-row'}`}>
            {/* Main Content Column */}
            <div className={`${isMobile ? 'w-full' : 'flex-1'} min-w-0`}>
              <CommunityErrorBoundary context="post detail">
                <PostDetail post={post} comments={comments} />
              </CommunityErrorBoundary>
            </div>

            {/* Sidebar Column - Desktop Only per Blueprint 06 */}
            {!isMobile && sidebarData && (
              <div className="w-80 flex-shrink-0">
                <div className="sticky top-6">
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
              </div>
            )}

            {/* Mobile Sidebar Content Integration */}
            {isMobile && sidebarData && (
              <div className="w-full mt-8">
                <div className="space-y-6">
                  {/* Featured content as horizontal cards */}
                  {sidebarData.featuredPoll && (
                    <div className="p-4 bg-surface/50 rounded-lg">
                      <h3 className="font-medium mb-2">Enquete em Destaque</h3>
                      <p className="text-sm text-muted-foreground">
                        {sidebarData.featuredPoll.question}
                      </p>
                    </div>
                  )}

                  {/* Trending discussions */}
                  {sidebarData.trendingDiscussions.length > 0 && (
                    <div className="p-4 bg-surface/50 rounded-lg">
                      <h3 className="font-medium mb-3">Em Alta</h3>
                      <div className="space-y-2">
                        {sidebarData.trendingDiscussions.slice(0, 3).map((discussion) => (
                          <div key={discussion.id} className="text-sm">
                            <div className="font-medium line-clamp-1">{discussion.title}</div>
                            <div className="text-muted-foreground text-xs">
                              {discussion.upvotes} votos • {discussion.reply_count} respostas
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostPage;
