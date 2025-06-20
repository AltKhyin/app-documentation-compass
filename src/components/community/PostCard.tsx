
// ABOUTME: Individual post card component for community feed display with voting, metadata, and actions.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageCircle, Pin, Lock } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { VoteButtons } from './VoteButtons';
import { PostActionMenu } from './PostActionMenu';
import type { CommunityPost } from '../../types/community';

interface PostCardProps {
  post: CommunityPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
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
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex gap-3">
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

            {/* Title */}
            {post.title && (
              <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2">
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

            {/* Footer with author and engagement stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {post.author && (
                  <>
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={post.author.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {post.author.full_name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{post.author.full_name || 'Anônimo'}</span>
                    <span>•</span>
                  </>
                )}
                <span>
                  {formatDistanceToNow(new Date(post.created_at), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{post.reply_count || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
