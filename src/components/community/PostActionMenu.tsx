
// ABOUTME: Dropdown menu for post moderation actions with role-based visibility.

import React from 'react';
import { MoreHorizontal, Pin, PinOff, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuthStore } from '../../store/auth';
import { usePostActionMutation } from '../../../packages/hooks/usePostActionMutation';
import type { CommunityPost } from '../../../packages/hooks/useCommunityFeedQuery';

interface PostActionMenuProps {
  post: CommunityPost;
}

export const PostActionMenu = ({ post }: PostActionMenuProps) => {
  const { user } = useAuthStore();
  const postActionMutation = usePostActionMutation();

  // Role-based permission logic following [SEC.2]
  const canModerate = user?.app_metadata?.role === 'editor' || user?.app_metadata?.role === 'admin';

  const handleAction = (action: 'pin' | 'unpin' | 'hide') => {
    postActionMutation.mutate({
      postId: post.id,
      action
    });
  };

  // Don't render menu if user has no moderation permissions
  if (!canModerate) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={postActionMutation.isPending}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Mais opções</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleAction(post.is_pinned ? 'unpin' : 'pin')}
          disabled={postActionMutation.isPending}
        >
          {post.is_pinned ? (
            <>
              <PinOff className="mr-2 h-4 w-4" />
              Desafixar post
            </>
          ) : (
            <>
              <Pin className="mr-2 h-4 w-4" />
              Fixar post
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAction('hide')}
          disabled={postActionMutation.isPending}
          className="text-destructive focus:text-destructive"
        >
          <EyeOff className="mr-2 h-4 w-4" />
          Ocultar post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
