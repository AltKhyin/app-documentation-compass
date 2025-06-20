
// ABOUTME: Component for rendering the complete comment tree with recursive nesting support.

import React from 'react';
import { Comment } from './Comment';
import type { CommunityPost } from '../../types/community';

interface CommentThreadProps {
  comments: CommunityPost[];
  onCommentPosted: () => void;
}

// Enhanced comment type with replies
type EnhancedComment = CommunityPost & { replies: EnhancedComment[] };

export const CommentThread = ({ comments, onCommentPosted }: CommentThreadProps) => {
  // Build a hierarchical tree from the flat list of comments
  const commentMap = new Map<number, EnhancedComment>();
  const rootComments: EnhancedComment[] = [];

  // First pass: Create enhanced comment objects with replies array
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: Build the tree structure
  comments.forEach(comment => {
    const enhancedComment = commentMap.get(comment.id)!;
    
    if (comment.parent_post_id && commentMap.has(comment.parent_post_id)) {
      // This is a reply to another comment
      const parentComment = commentMap.get(comment.parent_post_id)!;
      parentComment.replies.push(enhancedComment);
    } else {
      // This is a top-level comment (direct reply to the post)
      rootComments.push(enhancedComment);
    }
  });

  // Recursive function to render comments and their replies
  const renderComments = (
    commentsToRender: EnhancedComment[],
    level: number
  ): React.ReactNode => {
    return commentsToRender.map(comment => (
      <div key={comment.id}>
        <Comment 
          comment={comment} 
          indentationLevel={level}
          onCommentPosted={onCommentPosted}
        />
        {comment.replies && comment.replies.length > 0 && (
          // Recursive call to render nested replies
          renderComments(comment.replies, level + 1)
        )}
      </div>
    ));
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Ainda não há comentários nesta discussão.</p>
        <p className="text-sm mt-1">Seja o primeiro a comentar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {renderComments(rootComments, 0)}
    </div>
  );
};
