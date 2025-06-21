
// ABOUTME: Horizontal Reddit-style vote buttons with consistent styling for posts and comments

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useCastCommunityVoteMutation } from '../../../packages/hooks/useCastCommunityVoteMutation';
import { useAuthStore } from '../../store/auth';
import { toast } from 'sonner';

interface VoteButtonsProps {
  postId: number;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  variant?: 'post' | 'comment';
  size?: 'sm' | 'md';
}

export const VoteButtons = ({ 
  postId, 
  upvotes, 
  downvotes, 
  userVote, 
  variant = 'post',
  size = 'md'
}: VoteButtonsProps) => {
  const { user } = useAuthStore();
  const castVoteMutation = useCastCommunityVoteMutation();

  const netScore = (upvotes || 0) - (downvotes || 0);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('Você precisa estar logado para votar');
      return;
    }

    const newVoteType = userVote === voteType ? null : voteType;

    try {
      await castVoteMutation.mutateAsync({
        postId,
        voteType: newVoteType
      });
    } catch (error) {
      toast.error('Erro ao votar. Tente novamente.');
    }
  };

  const buttonSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="reddit-vote-buttons flex flex-row items-center gap-1">
      {/* Upvote Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "reddit-vote-button p-1 rounded transition-all duration-150",
          buttonSize,
          "hover:bg-action-hover border-0 shadow-none bg-transparent",
          userVote === 'up' && "text-green-600 bg-green-50/50 hover:bg-green-100/50"
        )}
        onClick={() => handleVote('up')}
        disabled={castVoteMutation.isPending}
      >
        <ChevronUp className={iconSize} />
      </Button>

      {/* Score Display */}
      <span className={cn(
        "reddit-vote-score font-semibold min-w-[2rem] text-center transition-colors",
        textSize,
        "text-foreground",
        userVote === 'up' && "text-green-600",
        userVote === 'down' && "text-red-600"
      )}>
        {netScore}
      </span>

      {/* Downvote Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "reddit-vote-button p-1 rounded transition-all duration-150",
          buttonSize,
          "hover:bg-action-hover border-0 shadow-none bg-transparent",
          userVote === 'down' && "text-red-600 bg-red-50/50 hover:bg-red-100/50"
        )}
        onClick={() => handleVote('down')}
        disabled={castVoteMutation.isPending}
      >
        <ChevronDown className={iconSize} />
      </Button>
    </div>
  );
};
