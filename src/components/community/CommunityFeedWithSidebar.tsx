
// ABOUTME: Enhanced community feed that includes sidebar modules as pinned cards on mobile.

import React, { useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { CommunityFeed } from './CommunityFeed';
import { useCommunitySidebarQuery } from '../../../packages/hooks/useCommunitySidebarQuery';
import { FeaturedPollModule } from './sidebar/FeaturedPollModule';
import { TrendingDiscussionsModule } from './sidebar/TrendingDiscussionsModule';
import { Skeleton } from '../ui/skeleton';

export const CommunityFeedWithSidebar = () => {
  const isMobile = useIsMobile();
  const { data: sidebarData, isLoading: sidebarLoading } = useCommunitySidebarQuery();

  // On desktop, render just the regular feed (sidebar is separate)
  if (!isMobile) {
    return <CommunityFeed />;
  }

  // On mobile, render feed with pinned sidebar cards at top
  return (
    <div className="space-y-6">
      {/* Mobile: Pinned sidebar modules */}
      <div className="space-y-4">
        {sidebarLoading ? (
          // Loading skeletons for mobile pinned cards
          <div className="space-y-4">
            <div className="bg-card border rounded-lg p-4">
              <Skeleton className="h-5 w-32 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <Skeleton className="h-5 w-32 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Poll - Critical module */}
            {sidebarData?.featuredPoll && (
              <div className="bg-muted/30 border-l-4 border-primary rounded-r-lg">
                <FeaturedPollModule poll={sidebarData.featuredPoll} />
              </div>
            )}
            
            {/* Trending Discussions - Critical module */}
            {sidebarData?.trendingDiscussions && sidebarData.trendingDiscussions.length > 0 && (
              <div className="bg-muted/30 border-l-4 border-secondary rounded-r-lg">
                <TrendingDiscussionsModule discussions={sidebarData.trendingDiscussions} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Main feed content */}
      <CommunityFeed />
    </div>
  );
};
