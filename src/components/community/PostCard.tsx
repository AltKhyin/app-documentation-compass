
// ABOUTME: Reddit-style de-boxed post card with voting left, content right, and horizontal separators.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageCircle, Pin, Lock } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { VoteButtons } from './VoteButtons';
import { PostActionBar } from './PostActionBar';
import { PostActionMenu } from './PostActionMenu';
import type { CommunityPost } from '../../types/community';

interface PostCardProps {
  post: CommunityPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();

  const handlePostClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }
    navigate(`/comunidade/${post.id}`);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'general': 'Geral',
      'review_discussion': 'Discussão de Review',
      'question': 'Pergunta',
      'announcement': 'Anúncio'
    };
    return labels[category] || category;
  };

  const getFlairColor = (color?: string) => {
    if (!color) return 'bg-gray-100 text-gray-800';
    
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-100 text-blue-800',
      'green': 'bg-green-100 text-green-800',
      'red': 'bg-red-100 text-red-800',
      'yellow': 'bg-yellow-100 text-yellow-800',
      'purple': 'bg-purple-100 text-purple-800',
    };
    
    return colorMap[color] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="reddit-post-container reddit-post-hover px-4 py-3">
      <div className="flex gap-3">
        {/* Left side - Vote buttons */}
        <div className="flex-shrink-0 pt-1">
          <VoteButtons
            postId={post.id}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            userVote={post.user_vote}
          />
        </div>

        {/* Right side - Main content */}
        <div className="flex-1 min-w-0" onClick={handlePostClick}>
          {/* Header with badges and status indicators */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {getCategoryLabel(post.category)}
              </Badge>
              
              {post.flair_text && (
                <Badge className={`text-xs ${getFlairColor(post.flair_color)}`}>
                  {post.flair_text}
                </Badge>
              )}
              
              {post.is_pinned && (
                <div className="flex items-center text-green-600">
                  <Pin className="w-3 h-3 mr-1" />
                  <span className="text-xs">Fixado</span>
                </div>
              )}
              
              {post.is_locked && (
                <div className="flex items-center text-orange-600">
                  <Lock className="w-3 h-3 mr-1" />
                  <span className="text-xs">Bloqueado</span>
                </div>
              )}
            </div>

            <PostActionMenu post={post} />
          </div>

          {/* Author info */}
          <div className="flex items-center gap-2 mb-2">
            {post.author && (
              <>
                <Avatar className="w-5 h-5">
                  <AvatarImage src={post.author.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {post.author.full_name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <span className="reddit-metadata">
                  {post.author.full_name || 'Anônimo'}
                </span>
                <span className="reddit-metadata">•</span>
              </>
            )}
            <span className="reddit-metadata">
              {formatDistanceToNow(new Date(post.created_at), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
          </div>

          {/* Title */}
          {post.title && (
            <h3 className="post-title mb-2 cursor-pointer hover:text-primary transition-colors">
              {post.title}
            </h3>
          )}

          {/* Content preview */}
          <div 
            className="text-muted-foreground text-sm mb-3 line-clamp-3"
            dangerouslySetInnerHTML={{ 
              __html: post.content.length > 300 
                ? `${post.content.substring(0, 300)}...` 
                : post.content 
            }}
          />

          {/* Multimedia content indicators */}
          {post.post_type === 'image' && post.image_url && (
            <div className="mb-3">
              <img 
                src={post.image_url} 
                alt="Post image" 
                className="max-h-48 w-auto rounded border"
                loading="lazy"
              />
            </div>
          )}

          {post.post_type === 'poll' && post.poll_data && (
            <div className="mb-3 p-3 bg-blue-50 rounded border">
              <div className="text-sm font-medium text-blue-900">
                📊 Enquete: {post.poll_data.question || 'Clique para votar'}
              </div>
            </div>
          )}

          {/* Action bar */}
          <PostActionBar post={post} />
        </div>
      </div>
    </div>
  );
};
