
// ABOUTME: Individual post card component with voting buttons and author information.

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CommunityPost } from '../../../packages/hooks/useCommunityFeedQuery';
import { VoteButtons } from './VoteButtons';
import { MessageCircle } from 'lucide-react';

interface PostCardProps {
  post: CommunityPost;
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'Discussão Geral',
  review_discussion: 'Review',
  question: 'Pergunta',
  announcement: 'Anúncio'
};

const CATEGORY_COLORS: Record<string, string> = {
  general: 'default',
  review_discussion: 'secondary',
  question: 'outline',
  announcement: 'destructive'
};

export const PostCard = ({ post }: PostCardProps) => {
  const categoryLabel = CATEGORY_LABELS[post.category] || post.category;
  const categoryColor = CATEGORY_COLORS[post.category] || 'default';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote buttons */}
          <div className="flex-shrink-0">
            <VoteButtons
              postId={post.id}
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              userVote={post.user_vote}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={post.author?.avatar_url || undefined} />
                  <AvatarFallback>
                    {post.author?.full_name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">
                      {post.author?.full_name || 'Usuário Anônimo'}
                    </span>
                    <span className="text-muted-foreground text-xs">•</span>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant={categoryColor as any} className="flex-shrink-0">
                {categoryLabel}
              </Badge>
            </div>

            {/* Title */}
            {post.title && (
              <h3 className="font-semibold text-foreground mb-2 leading-tight">
                {post.title}
              </h3>
            )}

            {/* Content */}
            <div className="text-muted-foreground text-sm leading-relaxed mb-3">
              <p className="line-clamp-3">{post.content}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {post.reply_count} {post.reply_count === 1 ? 'resposta' : 'respostas'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
