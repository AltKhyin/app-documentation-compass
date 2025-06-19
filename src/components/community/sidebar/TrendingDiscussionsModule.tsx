
// ABOUTME: Trending discussions module showing popular community posts with engagement metrics.

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { TrendingUp, MessageCircle, ArrowUp, Pin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';

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
  discussions?: TrendingDiscussion[];
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'Geral',
  review_discussion: 'Review',
  question: 'Pergunta',
  announcement: 'Anúncio'
};

export const TrendingDiscussionsModule = ({ discussions = [] }: TrendingDiscussionsModuleProps) => {
  const navigate = useNavigate();

  const handleDiscussionClick = (discussionId: number) => {
    navigate(`/comunidade/${discussionId}`);
  };

  if (discussions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            Em Alta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhuma discussão em alta no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5" />
          Em Alta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {discussions.map((discussion, index) => (
          <div
            key={discussion.id}
            className={cn(
              "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm hover:border-primary/20",
              discussion.is_pinned && "bg-primary/5 border-primary/20"
            )}
            onClick={() => handleDiscussionClick(discussion.id)}
          >
            {/* Header with ranking and metadata */}
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">#{index + 1}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {discussion.is_pinned && <Pin className="w-3 h-3 text-primary" />}
                  <Badge variant="outline" className="text-xs">
                    {CATEGORY_LABELS[discussion.category] || discussion.category}
                  </Badge>
                  {discussion.flair_text && (
                    <Badge variant="secondary" className="text-xs">
                      {discussion.flair_text}
                    </Badge>
                  )}
                </div>
                
                <h4 className="font-medium text-sm line-clamp-2 leading-tight mb-1">
                  {discussion.title}
                </h4>
                
                {/* Author and timestamp */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>por {discussion.author?.full_name || 'Anônimo'}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(discussion.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Engagement metrics */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>{discussion.upvotes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{discussion.reply_count}</span>
                </div>
              </div>
              
              {/* Trending indicator */}
              <div className="flex items-center gap-1 text-orange-600">
                <TrendingUp className="w-3 h-3" />
                <span className="font-medium">Em alta</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
