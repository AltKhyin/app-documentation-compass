
// ABOUTME: Community sidebar component that displays rules, trending posts, and other community information via props.

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RulesModule } from './sidebar/RulesModule';
import { LinksModule } from './sidebar/LinksModule';
import { TrendingDiscussionsModule } from './sidebar/TrendingDiscussionsModule';
import { FeaturedPollModule } from './sidebar/FeaturedPollModule';
import { RecentActivityModule } from './sidebar/RecentActivityModule';

interface CommunitySidebarProps {
  rules: string[];
  links: Array<{ title: string; url: string }>;
  trendingDiscussions: Array<{
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
  recentActivity: Array<{
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
    <div className="sticky top-6 space-y-6">
      {/* Featured Poll */}
      {featuredPoll && (
        <FeaturedPollModule poll={featuredPoll} />
      )}

      {/* Trending Discussions */}
      {trendingDiscussions.length > 0 && (
        <TrendingDiscussionsModule discussions={trendingDiscussions} />
      )}

      {/* Community Rules */}
      <RulesModule rules={rules} />

      {/* Useful Links */}
      {links.length > 0 && (
        <LinksModule links={links} />
      )}

      {/* Recent Activity - Fix the prop name from activities to activity */}
      {recentActivity.length > 0 && (
        <RecentActivityModule activity={{
          onlineUsers: recentActivity.length, // Use array length as active authors proxy
          todayPosts: recentActivity.filter(post => 
            new Date(post.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
          ).length,
          totalDiscussions: recentActivity.length
        }} />
      )}
    </div>
  );
};
