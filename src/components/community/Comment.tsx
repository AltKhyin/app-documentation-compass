
// ABOUTME: Core UI component for displaying a single comment with nesting support and reward badges.

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VoteButtons } from './VoteButtons';
import { PostActionMenu } from './PostActionMenu';
import { CommentEditor } from './CommentEditor';
import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CommunityPost } from '../../types/community';

interface CommentProps {
  comment: CommunityPost;
  indentationLevel: number;
  onCommentPosted: () => void;
}

export const Comment = ({ comment, indentationLevel, onCommentPosted }: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);

  // Calculate left margin for nesting effect (max 6 levels to prevent UI overflow)
  const effectiveLevel = Math.min(indentationLevel, 6);
  const indentationStyle = { marginLeft: `${effectiveLevel * 1.5}rem` };

  const handleReplyPosted = () => {
    setIsReplying(false);
    onCommentPosted();
  };

  return (
    <div className="flex gap-3 mt-4" style={indentationStyle}>
      {/* Vertical connector line for nested comments */}
      {indentationLevel > 0 && (
        <div className="flex flex-col items-center">
          <div className="w-0.5 bg-border flex-grow min-h-[60px]"></div>
        </div>
      )}

      <div className="flex-1">
        <div className={cn(
          "bg-card p-3 rounded-lg border transition-colors",
          comment.is_rewarded && "border-yellow-500/50 ring-2 ring-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-950/20"
        )}>
          {/* Comment Header */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={comment.author?.avatar_url || ''} />
                <AvatarFallback>{comment.author?.full_name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{comment.author?.full_name}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}</span>
              {comment.is_rewarded && (
                <Badge variant="secondary" className="text-yellow-600 border-yellow-500/50 bg-yellow-100 dark:bg-yellow-900/30">
                  <Award className="w-3 h-3 mr-1" />
                  Recompensa
                </Badge>
              )}
            </div>
            <PostActionMenu post={comment} />
          </div>

          {/* Comment Body */}
          <div
            className="prose dark:prose-invert prose-sm max-w-none mb-3"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />

          {/* Comment Actions */}
          <div className="flex items-center gap-2">
            <VoteButtons
              postId={comment.id}
              upvotes={comment.upvotes || 0}
              downvotes={comment.downvotes || 0}
              userVote={comment.user_vote}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs"
            >
              {isReplying ? 'Cancelar' : 'Responder'}
            </Button>
          </div>
        </div>
        
        {/* Reply Editor */}
        {isReplying && (
          <div className="mt-2 ml-4">
            <CommentEditor
              parentPostId={comment.id}
              onCommentPosted={handleReplyPosted}
            />
          </div>
        )}
      </div>
    </div>
  );
};
