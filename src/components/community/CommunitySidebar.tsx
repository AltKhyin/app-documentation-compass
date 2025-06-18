
// ABOUTME: Main community sidebar component with multiple modules for desktop layout per Blueprint 06.

import React from 'react';
import { useCommunitySidebarQuery } from '../../../packages/hooks/useCommunitySidebarQuery';
import { RulesModule } from './sidebar/RulesModule';
import { FeaturedPollModule } from './sidebar/FeaturedPollModule';
import { TrendingDiscussionsModule } from './sidebar/TrendingDiscussionsModule';
import { RecentActivityModule } from './sidebar/RecentActivityModule';
import { LinksModule } from './sidebar/LinksModule';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';

export const CommunitySidebar = () => {
  const { data, isLoading, error } = useCommunitySidebarQuery();

  if (error) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            Erro ao carregar informações da comunidade. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeletons for each module */}
        <div className="bg-card border rounded-lg p-6">
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <Skeleton className="h-5 w-24 mb-3" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Community Rules */}
      <RulesModule rules={data.rules} />
      
      {/* Featured Poll */}
      {data.featuredPoll && (
        <FeaturedPollModule poll={data.featuredPoll} />
      )}
      
      {/* Trending Discussions */}
      {data.trendingDiscussions.length > 0 && (
        <TrendingDiscussionsModule discussions={data.trendingDiscussions} />
      )}
      
      {/* Recent Activity */}
      <RecentActivityModule activity={data.recentActivity} />
      
      {/* Useful Links */}
      <LinksModule links={data.links} />
    </div>
  );
};
