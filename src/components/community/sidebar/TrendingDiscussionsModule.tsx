// ABOUTME: Trending discussions module showing the most engaging community posts.

import React from 'react';
import { MessageCircle, TrendingUp, Pin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define local types for trending discussions
interface TrendingDiscussion {
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
}

interface TrendingDiscussionsModuleProps {
  discussions: TrendingDiscussion[];
}

export const TrendingDiscussionsModule = ({ discussions }: TrendingDiscussionsModuleProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-orange-500" />
        <h3 className="font-semibold text-foreground">Discussões em Alta</h3>
      </div>
      
      <div className="space-y-4">
        {discussions.map((discussion, index) => (
          <div key={discussion.id} className="group cursor-pointer">
            <div className="flex items-start gap-3">
              {/* Trending indicator */}
              <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full flex-shrink-0 mt-1">
                <span className="text-xs font-bold text-orange-600">{index + 1}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Post title or content preview */}
                <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {discussion.title || discussion.content}
                </h4>
                
                {/* Post metadata */}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  {discussion.is_pinned && (
                    <div className="flex items-center gap-1 text-primary">
                      <Pin className="w-3 h-3" />
                      <span>Fixado</span>
                    </div>
                  )}
                  
                  {discussion.flair_text && (
                    <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">
                      {discussion.flair_text}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{discussion.upvotes} votos</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{discussion.reply_count}</span>
                  </div>
                </div>
                
                {/* Author info */}
                {discussion.author?.full_name && (
                  <p className="text-xs text-muted-foreground mt-1">
                    por {discussion.author.full_name}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {discussions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma discussão em alta no momento
          </p>
        )}
      </div>
    </div>
  );
};
