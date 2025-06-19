
// ABOUTME: Action bar component for post interactions (comment, share, save)

import React from 'react';
import { Button } from '../ui/button';
import { MessageCircle, Share2, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PostActionBarProps {
  replyCount: number;
  onReply?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  className?: string;
}

export const PostActionBar = ({ 
  replyCount, 
  onReply, 
  onShare, 
  onSave,
  className 
}: PostActionBarProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onReply}
        className="text-muted-foreground hover:text-foreground"
      >
        <MessageCircle className="w-4 h-4 mr-1" />
        <span className="text-sm">{replyCount}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onShare}
        className="text-muted-foreground hover:text-foreground"
      >
        <Share2 className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onSave}
        className="text-muted-foreground hover:text-foreground"
      >
        <Bookmark className="w-4 h-4" />
      </Button>
    </div>
  );
};
