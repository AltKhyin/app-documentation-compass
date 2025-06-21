
// ABOUTME: Hook for managing comment tree state with expand/collapse functionality and hierarchical organization

import { useState, useMemo } from 'react';
import type { CommunityPost } from '../../../types/community';

interface CommentTreeNode {
  comment: CommunityPost;
  replies: CommentTreeNode[];
  depth: number;
  hasReplies: boolean;
}

interface CommentTreeState {
  collapsedComments: Set<number>;
  expandedPaths: Map<number, boolean>;
}

export const useCommentTree = (comments: CommunityPost[]) => {
  const [treeState, setTreeState] = useState<CommentTreeState>({
    collapsedComments: new Set(),
    expandedPaths: new Map()
  });

  // Build hierarchical tree structure
  const commentTree = useMemo(() => {
    const commentMap = new Map<number, CommentTreeNode>();
    const rootComments: CommentTreeNode[] = [];

    // First pass: Create node objects
    comments.forEach(comment => {
      commentMap.set(comment.id, {
        comment,
        replies: [],
        depth: 0,
        hasReplies: false
      });
    });

    // Second pass: Build hierarchy and calculate depth
    comments.forEach(comment => {
      const node = commentMap.get(comment.id)!;
      
      if (comment.parent_post_id && commentMap.has(comment.parent_post_id)) {
        const parentNode = commentMap.get(comment.parent_post_id)!;
        node.depth = parentNode.depth + 1;
        parentNode.replies.push(node);
        parentNode.hasReplies = true;
      } else {
        rootComments.push(node);
      }
    });

    // Sort by creation date (newest first for root, oldest first for replies)
    const sortComments = (nodes: CommentTreeNode[], isRoot = false) => {
      return nodes.sort((a, b) => {
        const dateA = new Date(a.comment.created_at).getTime();
        const dateB = new Date(b.comment.created_at).getTime();
        return isRoot ? dateB - dateA : dateA - dateB;
      });
    };

    // Apply sorting recursively
    const applySorting = (nodes: CommentTreeNode[], isRoot = false): CommentTreeNode[] => {
      const sorted = sortComments([...nodes], isRoot);
      return sorted.map(node => ({
        ...node,
        replies: applySorting(node.replies, false)
      }));
    };

    return applySorting(rootComments, true);
  }, [comments]);

  const toggleComment = (commentId: number) => {
    setTreeState(prev => {
      const newCollapsed = new Set(prev.collapsedComments);
      
      if (newCollapsed.has(commentId)) {
        newCollapsed.delete(commentId);
      } else {
        newCollapsed.add(commentId);
      }
      
      return {
        ...prev,
        collapsedComments: newCollapsed
      };
    });
  };

  const expandAll = () => {
    setTreeState({
      collapsedComments: new Set(),
      expandedPaths: new Map()
    });
  };

  const collapseAll = () => {
    const allCommentIds = new Set(comments.map(c => c.id));
    setTreeState({
      collapsedComments: allCommentIds,
      expandedPaths: new Map()
    });
  };

  const isCollapsed = (commentId: number) => {
    return treeState.collapsedComments.has(commentId);
  };

  const getStats = () => {
    const totalComments = comments.length;
    const collapsedCount = treeState.collapsedComments.size;
    const visibleComments = totalComments - collapsedCount;
    
    return {
      total: totalComments,
      collapsed: collapsedCount,
      visible: visibleComments
    };
  };

  return {
    commentTree,
    toggleComment,
    expandAll,
    collapseAll,
    isCollapsed,
    getStats,
    treeState
  };
};
