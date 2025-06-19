
// ABOUTME: Trending discussions module displaying popular community posts in the sidebar.

import React from 'react';
import { MessageCircle, Pin } from 'lucide-react';
import { Badge } from '../../ui/badge';
import type { TrendingDiscussion } from '../../../../packages/hooks/useCommunitySidebarQuery';

interface TrendingDiscussionsModuleProps {
  discussions: TrendingDiscussion[];
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'Geral',
  review_discussion: 'Review',
  question: 'Pergunta',
  announcement: 'Anúncio'
};

export const TrendingDiscussionsModule = ({ discussions }: TrendingDiscussionsModuleProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-semibold mb-3 text-foreground">Discussões em Alta</h3>
      <div className="space-y-3">
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="group hover:bg-muted/50 p-3 rounded-md transition-colors cursor-pointer border border-transparent hover:border-border"
          >
            <div className="flex items-start gap-2 mb-2">
              {discussion.is_pinned && (
                <Pin className="w-3 h-3 text-primary flex-shrink-0 mt-1" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {discussion.title || 'Discussão sem título'}
                </h4>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {discussion.content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {CATEGORY_LABELS[discussion.category] || discussion.category}
                </Badge>
                {discussion.flair_text && (
                  <Badge variant="outline" className="text-xs">
                    {discussion.flair_text}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {discussion.reply_count}
                </span>
                <span>↑ {discussion.upvotes}</span>
              </div>
            </div>
            
            {discussion.author && (
              <p className="text-xs text-muted-foreground mt-1">
                por {discussion.author.full_name || 'Usuário Anônimo'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
