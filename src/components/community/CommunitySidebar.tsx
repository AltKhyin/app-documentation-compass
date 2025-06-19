
// ABOUTME: Main community sidebar component that orchestrates all sidebar modules with proper data flow.

import React from 'react';
import { FeaturedPollModule } from './sidebar/FeaturedPollModule';
import { TrendingDiscussionsModule } from './sidebar/TrendingDiscussionsModule';
import { RulesModule } from './sidebar/RulesModule';
import { LinksModule } from './sidebar/LinksModule';
import { RecentActivityModule } from './sidebar/RecentActivityModule';

interface CommunitySidebarProps {
  rules?: string[];
  links?: Array<{ title: string; url: string }>;
  trendingDiscussions?: Array<{
    id: number;
    title: string;
    content: string;
    category: string;
    reply_count: number;
    upvotes: number;
    created_at: string;
    author: {
      full_name: string | null;
    } | null;
    flair_text?: string;
    is_pinned?: boolean;
  }>;
  featuredPoll?: any;
  recentActivity?: Array<{
    id: number;
    title: string;
    created_at: string;
    Practitioners: { full_name: string };
  }>;
}

export const CommunitySidebar = ({
  rules,
  links,
  trendingDiscussions,
  featuredPoll,
  recentActivity
}: CommunitySidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Featured Poll Module */}
      <FeaturedPollModule poll={featuredPoll} />
      
      {/* Trending Discussions Module */}
      <TrendingDiscussionsModule discussions={trendingDiscussions} />
      
      {/* Community Rules Module */}
      <RulesModule rules={rules} />
      
      {/* Useful Links Module */}
      <LinksModule links={links} />
      
      {/* Recent Activity Module */}
      <RecentActivityModule activities={recentActivity} />
    </div>
  );
};
