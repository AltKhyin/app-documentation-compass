
// ABOUTME: Enhanced comment tree node with integrated visual threading lines and expand/collapse functionality

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { Comment } from '../Comment';
import { cn } from '../../../lib/utils';
import type { CommunityPost } from '../../../types/community';

interface CommentTreeNodeProps {
  comment: CommunityPost;
  replies: CommunityPost[];
  depth: number;
  isLast: boolean;
  onCommentPosted: () => void;
}

export const CommentTreeNode = ({ 
  comment, 
  replies, 
  depth, 
  isLast, 
  onCommentPosted 
}: CommentTreeNodeProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasReplies = replies.length > 0;
  const maxDepth = 6; // Reddit-style max nesting
  const effectiveDepth = Math.min(depth, maxDepth);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="reddit-comment-node relative">
      {/* Threading line - extends full height when not collapsed */}
      {depth > 0 && (
        <div 
          className={cn(
            "reddit-thread-line absolute w-0.5 bg-comment-thread/40",
            "hover:bg-comment-thread/60 transition-colors duration-150",
            !isLast && !isCollapsed ? "bottom-0" : "bottom-1/2"
          )}
          style={{ 
            left: `${(effectiveDepth - 1) * 24 + 12}px`,
            top: 0
          }}
        />
      )}

      {/* Expand/collapse toggle button - positioned on threading line */}
      {hasReplies && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "reddit-thread-toggle absolute w-4 h-4 p-0",
            "bg-background border border-comment-thread/40 rounded-sm",
            "hover:bg-surface-muted hover:border-comment-thread/60",
            "transition-all duration-150 z-10"
          )}
          style={{ 
            left: `${effectiveDepth * 24 + 4}px`,
            top: '8px'
          }}
          onClick={handleToggle}
        >
          {isCollapsed ? (
            <ChevronRight className="w-2.5 h-2.5" />
          ) : (
            <ChevronDown className="w-2.5 h-2.5" />
          )}
        </Button>
      )}

      {/* Comment content with proper indentation */}
      <div 
        className={cn(
          "reddit-comment-content transition-all duration-200",
          isCollapsed && "opacity-60"
        )}
        style={{ 
          marginLeft: `${effectiveDepth * 24}px`,
          paddingLeft: effectiveDepth > 0 ? '16px' : '0'
        }}
      >
        <Comment
          comment={comment}
          indentationLevel={effectiveDepth}
          onCommentPosted={onCommentPosted}
        />

        {/* Collapsed indicator */}
        {isCollapsed && hasReplies && (
          <div className="ml-4 mt-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleToggle}
            >
              [{replies.length} {replies.length === 1 ? 'resposta oculta' : 'respostas ocultas'}]
            </Button>
          </div>
        )}
      </div>

      {/* Render nested replies */}
      {!isCollapsed && hasReplies && (
        <div className="reddit-comment-replies">
          {replies.map((reply, index) => (
            <CommentTreeNode
              key={reply.id}
              comment={reply}
              replies={[]} // Will be populated by parent component
              depth={effectiveDepth + 1}
              isLast={index === replies.length - 1}
              onCommentPosted={onCommentPosted}
            />
          ))}
        </div>
      )}
    </div>
  );
};
