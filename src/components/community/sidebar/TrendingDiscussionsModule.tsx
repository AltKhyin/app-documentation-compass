
// ABOUTME: Trending discussions module for community sidebar.

import React from 'react';
import { TrendingDiscussion } from '../../../../packages/hooks/useCommunitySidebarQuery';
import { Badge } from '../../ui/badge';
import { MessageSquare, ChevronUp } from 'lucide-react';

interface TrendingDiscussionsModuleProps {
  discussions: TrendingDiscussion[];
}

export const TrendingDiscussionsModule = ({ discussions }: TrendingDiscussionsModuleProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-semibold mb-3 text-foreground">Discussões em Alta</h3>
      <div className="space-y-4">
        {discussions.map((discussion, index) => (
          <div key={discussion.id} className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {discussion.title || 'Discussão sem título'}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {discussion.content}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {discussion.category}
                </Badge>
                {discussion.author?.full_name && (
                  <span className="text-xs text-muted-foreground">
                    por {discussion.author.full_name}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <ChevronUp className="w-3 h-3" />
                  <span>{discussion.upvotes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{discussion.reply_count}</span>
                </div>
              </div>
            </div>
            
            {index < discussions.length - 1 && (
              <div className="border-b border-border/50 pt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
