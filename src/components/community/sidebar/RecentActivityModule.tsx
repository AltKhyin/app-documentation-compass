
// ABOUTME: Community sidebar module showing recent activity metrics with corrected labels.

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Users, MessageCircle, TrendingUp } from 'lucide-react';

// Updated interface to match the actual data structure from useCommunitySidebarQuery
interface RecentActivityModuleProps {
  activity: {
    onlineUsers: number;
    todayPosts: number;
    totalDiscussions: number;
  };
}

export const RecentActivityModule = ({ activity }: RecentActivityModuleProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* **TASK 3.2 FIX: Corrected Labels** */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Autores ativos</span>
          </div>
          <span className="text-sm font-bold">{activity.onlineUsers}</span>
        </div>
        
        <div className="text-xs text-muted-foreground border-t pt-2">
          Últimas 24 horas
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Posts hoje</span>
          </div>
          <span className="text-sm font-bold">{activity.todayPosts}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total discussões</span>
          </div>
          <span className="text-sm font-bold">{activity.totalDiscussions}</span>
        </div>
      </CardContent>
    </Card>
  );
};
