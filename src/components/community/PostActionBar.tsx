
// ABOUTME: Horizontal action bar for post interactions (comment, share, save) with mobile-optimized touch targets.

import React from 'react';
import { MessageCircle, Share, Bookmark } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import type { CommunityPost } from '../../../packages/hooks/useCommunityFeedQuery';

interface PostActionBarProps {
  post: CommunityPost;
}

export const PostActionBar = ({ post }: PostActionBarProps) => {
  // Placeholder handler for save functionality as per audit instructions
  const handleSave = () => {
    toast.info('Funcionalidade em breve');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title || 'Discussão da comunidade',
        text: post.content,
        url: window.location.origin + `/community/posts/${post.id}`
      }).catch(() => {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.origin + `/community/posts/${post.id}`);
        toast.success('Link copiado para a área de transferência');
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.origin + `/community/posts/${post.id}`);
      toast.success('Link copiado para a área de transferência');
    }
  };

  const handleComment = () => {
    // Navigation to post detail page - placeholder for now
    toast.info('Página de comentários em breve');
  };

  return (
    <div className="flex items-center gap-1">
      {/* Comment Button - Mobile optimized ≥44px touch target [AD.2] */}
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-muted-foreground hover:text-foreground"
        onClick={handleComment}
      >
        <MessageCircle className="w-4 h-4 mr-1" />
        <span className="text-sm">{post.reply_count}</span>
      </Button>

      {/* Share Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-muted-foreground hover:text-foreground"
        onClick={handleShare}
      >
        <Share className="w-4 h-4 mr-1" />
        <span className="text-sm sr-only">Compartilhar</span>
      </Button>

      {/* Save Button - Placeholder as per audit instructions */}
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-muted-foreground hover:text-foreground"
        onClick={handleSave}
      >
        <Bookmark className="w-4 h-4 mr-1" />
        <span className="text-sm sr-only">Salvar</span>
      </Button>
    </div>
  );
};
