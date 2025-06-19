
// ABOUTME: Dropdown menu component for post-level actions with permission-based visibility

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { 
  MoreHorizontal, 
  MessageCircle, 
  Trash2, 
  Pin, 
  PinOff, 
  Lock, 
  Unlock,
  Flag
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePostActionMutation } from '../../../packages/hooks/usePostActionMutation';
import type { CommunityPost } from '../../../packages/hooks/useCommunityFeedQuery';

interface PostActionMenuProps {
  post: CommunityPost;
}

export const PostActionMenu = ({ post }: PostActionMenuProps) => {
  const { user } = useAuthStore();
  const postActionMutation = usePostActionMutation();

  // Check if user can moderate (editor or admin)
  const canModerate = user && (
    user.app_metadata?.role === 'editor' || 
    user.app_metadata?.role === 'admin'
  );

  // Check if user can delete (own post or moderator)
  const canDelete = user && (
    user.id === post.author?.id || canModerate
  );

  const handleAction = (action: 'delete' | 'pin' | 'unpin' | 'lock' | 'unlock') => {
    if (action === 'delete') {
      // Show confirmation for destructive action
      if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
        postActionMutation.mutate({ postId: post.id, action });
      }
    } else {
      postActionMutation.mutate({ postId: post.id, action });
    }
  };

  // Don't render menu for unauthenticated users
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Abrir menu de ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Always show reply for authenticated users */}
        <DropdownMenuItem>
          <MessageCircle className="w-4 h-4 mr-2" />
          Responder
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <Flag className="w-4 h-4 mr-2" />
          Reportar
        </DropdownMenuItem>

        {/* Moderation actions - only for editors/admins */}
        {canModerate && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction(post.is_pinned ? 'unpin' : 'pin')}>
              {post.is_pinned ? (
                <>
                  <PinOff className="w-4 h-4 mr-2" />
                  Desfixar
                </>
              ) : (
                <>
                  <Pin className="w-4 h-4 mr-2" />
                  Fixar
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => handleAction(post.is_locked ? 'unlock' : 'lock')}>
              {post.is_locked ? (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Desbloquear
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Bloquear
                </>
              )}
            </DropdownMenuItem>
          </>
        )}

        {/* Delete action - for post owner or moderators */}
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleAction('delete')}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
