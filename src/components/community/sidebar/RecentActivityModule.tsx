
// ABOUTME: Enhanced recent activity module with corrected metric labels

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Users, MessageSquare, TrendingUp } from 'lucide-react';

interface RecentActivity {
  onlineUsers: number;
  todayPosts: number;
  totalDiscussions: number;
}

interface RecentActivityModuleProps {
  activity: RecentActivity;
}

export const RecentActivityModule = ({ activity }: RecentActivityModuleProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Autores ativos</span>
          </div>
          <span className="font-semibold">{activity.onlineUsers}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Contribuições nas últimas 24h
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Posts hoje</span>
          </div>
          <span className="font-semibold">{activity.todayPosts}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Total discussões</span>
          </div>
          <span className="font-semibold">{activity.totalDiscussions}</span>
        </div>
      </CardContent>
    </Card>
  );
};
