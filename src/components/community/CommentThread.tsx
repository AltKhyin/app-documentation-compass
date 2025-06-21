
// ABOUTME: Enhanced comment tree with Reddit-style expand/collapse threading and visual hierarchy.

import React from 'react';
import { Button } from '../ui/button';
import { CommentTreeNode } from './threading/CommentTreeNode';
import { useCommentTree } from './threading/useCommentTree';
import type { CommunityPost } from '../../types/community';

interface CommentThreadProps {
  comments: CommunityPost[];
  onCommentPosted: () => void;
}

export const CommentThread = ({ comments, onCommentPosted }: CommentThreadProps) => {
  const { commentTree, expandAll, collapseAll, getStats } = useCommentTree(comments);

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="space-y-2">
          <p className="text-base">Ainda não há comentários nesta discussão.</p>
          <p className="text-sm">Seja o primeiro a comentar!</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="reddit-comment-thread space-y-1">
      {/* Thread statistics and controls */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/30">
        <div className="text-sm text-muted-foreground">
          {stats.total} {stats.total === 1 ? 'comentário' : 'comentários'}
          {stats.collapsed > 0 && (
            <span className="ml-2 text-tertiary">
              ({stats.collapsed} {stats.collapsed === 1 ? 'thread oculta' : 'threads ocultas'})
            </span>
          )}
        </div>
        
        {stats.collapsed > 0 && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={expandAll}
            >
              Expandir todas
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={collapseAll}
            >
              Recolher todas
            </Button>
          </div>
        )}
      </div>

      {/* Comment tree rendering */}
      <div className="space-y-0">
        {commentTree.map((node, index) => (
          <CommentTreeNode
            key={node.comment.id}
            comment={node.comment}
            replies={node.replies.map(r => r.comment)}
            depth={0}
            isLast={index === commentTree.length - 1}
            onCommentPosted={onCommentPosted}
          />
        ))}
      </div>
    </div>
  );
};
