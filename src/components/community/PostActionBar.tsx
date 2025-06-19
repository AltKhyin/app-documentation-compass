
// ABOUTME: Action bar component for community posts with reply count and interactive buttons.

import React from 'react';
import { MessageCircle, Bookmark, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import type { CommunityPost } from '../../../packages/hooks/useCommunityFeedQuery';

interface PostActionBarProps {
  post: CommunityPost;
}

export const PostActionBar = ({ post }: PostActionBarProps) => {
  // TASK 2.3: Provide clear placeholder feedback for unimplemented features
  const handleComment = () => {
    toast.info('Sistema de comentários em breve!');
  };

  const handleSave = () => {
    toast.info('Salvar posts em breve!');
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleComment}
          className="text-muted-foreground hover:text-foreground h-8 px-2"
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          <span className="text-xs">
            {post.reply_count > 0 ? `${post.reply_count} respostas` : 'Responder'}
          </span>
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
        >
          <Bookmark className="w-4 h-4" />
        </Button>
        
        {/* TASK 2.3: Share button removed as per plan - no longer needed in closed community */}
      </div>
    </div>
  );
};
