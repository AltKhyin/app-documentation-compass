
// ABOUTME: Individual post card component for community feed display with voting, engagement metrics and mobile-first design.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ArrowUp, ArrowDown, MessageCircle, Share2, Bookmark, Pin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useIsMobile } from '../../hooks/use-mobile';
import type { CommunityPost } from '../../../packages/hooks/useCommunityPageQuery';

interface PostCardProps {
  post: CommunityPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handlePostClick = () => {
    navigate(`/comunidade/${post.id}`);
  };

  const handleVote = (voteType: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement voting functionality in next milestone
    console.log(`Vote ${voteType} on post ${post.id}`);
  };

  const netScore = (post.upvotes || 0) - (post.downvotes || 0);

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handlePostClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Vote buttons - Desktop: Left side, Mobile: Integrated */}
          {!isMobile && (
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                onClick={(e) => handleVote('up', e)}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                {netScore}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                onClick={(e) => handleVote('down', e)}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header with author and metadata */}
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={post.author?.avatar_url || ''} />
                <AvatarFallback className="text-xs">
                  {post.author?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <span className="text-sm text-muted-foreground">
                {post.author?.full_name || 'Usuário'}
              </span>
              
              <span className="text-sm text-muted-foreground">•</span>
              
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>

              {/* Post status badges */}
              {post.is_pinned && (
                <Badge variant="secondary" className="text-xs">
                  <Pin className="w-3 h-3 mr-1" />
                  Fixado
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
              {post.title || 'Post sem título'}
            </h3>

            {/* Content preview */}
            {post.content && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {post.content}
              </p>
            )}

            {/* Category and flair */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {post.category || 'geral'}
              </Badge>
              
              {post.flair_text && (
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: post.flair_color || undefined }}
                >
                  {post.flair_text}
                </Badge>
              )}
            </div>

            {/* Engagement bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile vote buttons */}
                {isMobile && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 hover:bg-orange-50 hover:text-orange-600"
                      onClick={(e) => handleVote('up', e)}
                    >
                      <ArrowUp className="w-4 h-4 mr-1" />
                      {netScore}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      onClick={(e) => handleVote('down', e)}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Comments count */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.reply_count || 0}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement share functionality
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement save functionality
                  }}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
