
// ABOUTME: Enhanced Community page with new CommunityHeader and layered background styling per v2.0 design

import React from 'react';
import { CommunityFeed } from '../components/community/CommunityFeed';
import { CommunityFeedWithSidebar } from '../components/community/CommunityFeedWithSidebar';
import { CommunitySidebar } from '../components/community/CommunitySidebar';
import { CommunityHeader } from '../components/community/CommunityHeader';
import { useIsMobile } from '../hooks/use-mobile';
import { useCommunitySidebarQuery } from '../../packages/hooks/useCommunitySidebarQuery';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';

const ComunidadePage = () => {
  const isMobile = useIsMobile();
  const { data: sidebarData, isLoading, error } = useCommunitySidebarQuery();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Alert>
          <AlertDescription>
            Erro ao carregar dados da comunidade. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isMobile ? (
          // Mobile: Single column layout with pinned sidebar cards
          <div className="space-y-6">
            {/* Community Header */}
            {isLoading ? (
              <div className="bg-surface rounded-lg p-6">
                <Skeleton className="h-32 w-full mb-4" />
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </div>
            ) : sidebarData?.communityDetails ? (
              <div className="bg-surface rounded-lg overflow-hidden">
                <CommunityHeader community={sidebarData.communityDetails} />
              </div>
            ) : null}
            
            <CommunityFeedWithSidebar />
          </div>
        ) : (
          // Desktop: Two column layout with enhanced header
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - Left column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Enhanced Community Header */}
              {isLoading ? (
                <div className="bg-surface rounded-lg p-6">
                  <Skeleton className="h-40 w-full mb-4" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-7 w-56" />
                      <Skeleton className="h-5 w-80" />
                    </div>
                  </div>
                </div>
              ) : sidebarData?.communityDetails ? (
                <div className="bg-surface rounded-lg overflow-hidden">
                  <CommunityHeader community={sidebarData.communityDetails} />
                </div>
              ) : null}
              
              {/* Community Feed */}
              <div className="bg-surface rounded-lg overflow-hidden">
                <CommunityFeed />
              </div>
            </div>

            {/* Sidebar - Right column (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <CommunitySidebar />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComunidadePage;
