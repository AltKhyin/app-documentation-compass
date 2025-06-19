
// ABOUTME: Dropdown menu for post moderation actions with role-based visibility.

import React from 'react';
import { MoreHorizontal, Pin, Lock, Trash2, Unlock, PinOff } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
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
  const canDelete = post.author?.id === user?.id || canModerate;

  const handleAction = (action: 'delete' | 'pin' | 'unpin' | 'lock' | 'unlock') => {
    postActionMutation.mutate({
      postId: post.id,
      action
    });
  };

  // Don't render menu if user has no available actions
  if (!canDelete && !canModerate) {
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
        {canModerate && (
          <>
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
              onClick={() => handleAction(post.is_locked ? 'unlock' : 'lock')}
              disabled={postActionMutation.isPending}
            >
              {post.is_locked ? (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Desbloquear
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Bloquear comentários
                </>
              )}
            </DropdownMenuItem>
            {canDelete && <DropdownMenuSeparator />}
          </>
        )}
        {canDelete && (
          <DropdownMenuItem
            onClick={() => handleAction('delete')}
            disabled={postActionMutation.isPending}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir post
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
