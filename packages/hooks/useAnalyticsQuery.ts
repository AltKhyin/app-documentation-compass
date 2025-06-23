
// ABOUTME: TanStack Query hooks for admin analytics data fetching

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  userStats: {
    totalUsers: number;
    activeToday: number;
    newThisWeek: number;
    premiumUsers: number;
  };
  contentStats: {
    totalReviews: number;
    publishedReviews: number;
    draftReviews: number;
    totalPosts: number;
  };
  engagementStats: {
    totalViews: number;
    totalVotes: number;
    avgEngagement: number;
    topContent: Array<{
      id: number;
      title: string;
      views: number;
      type: 'review' | 'post';
    }>;
  };
  systemStats: {
    dbSize: string;
    apiCalls: number;
    errorRate: number;
    uptime: string;
  };
}

export const useAnalyticsQuery = () => {
  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async (): Promise<AnalyticsData> => {
      console.log('Fetching analytics data...');
      
      // Fetch user statistics
      const { data: userStats, error: userError } = await supabase.rpc('get_user_analytics');
      if (userError) {
        console.error('Error fetching user analytics:', userError);
        throw userError;
      }

      // Fetch content statistics
      const { data: contentStats, error: contentError } = await supabase.rpc('get_content_analytics');
      if (contentError) {
        console.error('Error fetching content analytics:', contentError);
        throw contentError;
      }

      // Fetch engagement statistics
      const { data: engagementStats, error: engagementError } = await supabase.rpc('get_engagement_analytics');
      if (engagementError) {
        console.error('Error fetching engagement analytics:', engagementError);
        throw engagementError;
      }

      // Mock system stats for now - would be replaced with actual monitoring
      const systemStats = {
        dbSize: '2.4 GB',
        apiCalls: 15420,
        errorRate: 0.02,
        uptime: '99.9%'
      };

      return {
        userStats: userStats || {
          totalUsers: 0,
          activeToday: 0,
          newThisWeek: 0,
          premiumUsers: 0
        },
        contentStats: contentStats || {
          totalReviews: 0,
          publishedReviews: 0,
          draftReviews: 0,
          totalPosts: 0
        },
        engagementStats: engagementStats || {
          totalViews: 0,
          totalVotes: 0,
          avgEngagement: 0,
          topContent: []
        },
        systemStats
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      console.error('Analytics query failed:', error);
      return failureCount < 2;
    }
  });
};

export const useAnalyticsExportMutation = () => {
  return useQuery({
    queryKey: ['analytics-export'],
    queryFn: async () => {
      console.log('Exporting analytics data...');
      
      const { data, error } = await supabase.rpc('export_analytics_data');
      if (error) {
        console.error('Error exporting analytics:', error);
        throw error;
      }
      
      return data;
    },
    enabled: false, // Only run when explicitly called
    staleTime: 0, // Always fresh for exports
  });
};
