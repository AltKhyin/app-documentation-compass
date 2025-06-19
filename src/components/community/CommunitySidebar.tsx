
// ABOUTME: Main community sidebar component that orchestrates all sidebar modules per Blueprint 06.

import React from 'react';
import { RulesModule } from './sidebar/RulesModule';
import { LinksModule } from './sidebar/LinksModule';
import { TrendingDiscussionsModule } from './sidebar/TrendingDiscussionsModule';
import { FeaturedPollModule } from './sidebar/FeaturedPollModule';
import { RecentActivityModule } from './sidebar/RecentActivityModule';
import type { CommunityPageResponse } from '../../../packages/hooks/useCommunityPageQuery';

interface CommunitySidebarProps {
  rules: string[];
  links: Array<{ title: string; url: string }>;
  trendingDiscussions: CommunityPageResponse['sidebarData']['trendingDiscussions'];
  featuredPoll?: any;
  recentActivity: CommunityPageResponse['sidebarData']['recentActivity'];
}

export const CommunitySidebar = ({
  rules,
  links,
  trendingDiscussions,
  featuredPoll,
  recentActivity
}: CommunitySidebarProps) => {
  return (
    <div className="space-y-4 sticky top-6">
      {/* Featured Poll Module - Priority display if available */}
      {featuredPoll && (
        <FeaturedPollModule poll={featuredPoll} />
      )}

      {/* Community Rules - Always show */}
      <RulesModule rules={rules} />

      {/* Trending Discussions - High engagement content */}
      <TrendingDiscussionsModule posts={trendingDiscussions} />

      {/* Recent Activity - Latest posts */}
      <RecentActivityModule activities={recentActivity} />

      {/* Useful Links - Static resources */}
      <LinksModule links={links} />
    </div>
  );
};
