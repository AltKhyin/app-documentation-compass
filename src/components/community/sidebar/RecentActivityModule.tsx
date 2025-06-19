
// ABOUTME: Recent activity module displaying community statistics in the sidebar.

import React from 'react';
import { Users, MessageSquare, TrendingUp } from 'lucide-react';
import type { RecentActivity } from '../../../../packages/hooks/useCommunitySidebarQuery';

interface RecentActivityModuleProps {
  activity: RecentActivity;
}

export const RecentActivityModule = ({ activity }: RecentActivityModuleProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-semibold mb-3 text-foreground">Atividade Recente</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {activity.onlineUsers} usuários ativos
            </p>
            <p className="text-xs text-muted-foreground">nas últimas 24h</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {activity.todayPosts} posts hoje
            </p>
            <p className="text-xs text-muted-foreground">publicados hoje</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {activity.totalDiscussions} discussões
            </p>
            <p className="text-xs text-muted-foreground">total na comunidade</p>
          </div>
        </div>
      </div>
    </div>
  );
};
