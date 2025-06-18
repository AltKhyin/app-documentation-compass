
// ABOUTME: Recent community activity statistics module for sidebar.

import React from 'react';
import { RecentActivity } from '../../../../packages/hooks/useCommunitySidebarQuery';
import { Users, MessageSquare, TrendingUp } from 'lucide-react';

interface RecentActivityModuleProps {
  activity: RecentActivity;
}

export const RecentActivityModule = ({ activity }: RecentActivityModuleProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-semibold mb-3 text-foreground">Atividade Recente</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Online agora</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {activity.onlineUsers || 'Em breve'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Discussões hoje</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {activity.todayPosts}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">Total de discussões</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {activity.totalDiscussions}
          </span>
        </div>
      </div>
    </div>
  );
};
