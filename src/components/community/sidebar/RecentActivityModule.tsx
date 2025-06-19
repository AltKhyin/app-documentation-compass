
// ABOUTME: Recent activity module displaying community statistics and online presence.

import React from 'react';
import { Users, MessageCircle, TrendingUp } from 'lucide-react';
import type { RecentActivity } from '../../../../packages/hooks/useCommunitySidebarQuery';

interface RecentActivityModuleProps {
  activity: RecentActivity;
}

export const RecentActivityModule = ({ activity }: RecentActivityModuleProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-semibold mb-4 text-foreground">Atividade Recente</h3>
      
      <div className="space-y-4">
        {/* Online Users */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{activity.onlineUsers} online agora</p>
            <p className="text-xs text-muted-foreground">Membros ativos</p>
          </div>
        </div>

        {/* Today's Posts */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
            <MessageCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{activity.todayPosts} publicações hoje</p>
            <p className="text-xs text-muted-foreground">Atividade diária</p>
          </div>
        </div>

        {/* Total Discussions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{activity.totalDiscussions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Discussões totais</p>
          </div>
        </div>
      </div>
    </div>
  );
};
