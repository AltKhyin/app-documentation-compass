
// ABOUTME: Community sidebar module showing recent activity metrics with proper data handling.

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Users, MessageCircle, TrendingUp } from 'lucide-react';

// Interface matching the actual data structure from useCommunitySidebarQuery
interface ActivityData {
  onlineUsers: number;
  todayPosts: number;
  totalDiscussions: number;
}

interface RecentActivityModuleProps {
  activity?: ActivityData;
}

export const RecentActivityModule = ({ activity }: RecentActivityModuleProps) => {
  // Provide default values if activity is undefined
  const activityData = activity || {
    onlineUsers: 0,
    todayPosts: 0,
    totalDiscussions: 0
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Autores ativos</span>
          </div>
          <span className="text-sm font-bold">{activityData.onlineUsers}</span>
        </div>
        
        <div className="text-xs text-muted-foreground border-t pt-2">
          Últimas 24 horas
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Posts hoje</span>
          </div>
          <span className="text-sm font-bold">{activityData.todayPosts}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total discussões</span>
          </div>
          <span className="text-sm font-bold">{activityData.totalDiscussions}</span>
        </div>
      </CardContent>
    </Card>
  );
};
