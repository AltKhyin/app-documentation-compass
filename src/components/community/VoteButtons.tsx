
// ABOUTME: Reddit-style horizontal voting buttons with optimistic updates and EVIDENS color mapping.

import React from 'react';
import { Button } from '../ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCastCommunityVoteMutation } from '../../../packages/hooks/useCastCommunityVoteMutation';
import { useAuthStore } from '../../store/auth';
import { toast } from 'sonner';

interface VoteButtonsProps {
  postId: number;
  upvotes: number;
  downvotes: number;
  userVote: string | null;
}

export const VoteButtons = ({ postId, upvotes, downvotes, userVote }: VoteButtonsProps) => {
  const { user } = useAuthStore();
  const castVoteMutation = useCastCommunityVoteMutation();

  const netScore = upvotes - downvotes;

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('Você precisa estar logado para votar');
      return;
    }

    // If clicking the same vote type, remove the vote
    const newVoteType = userVote === voteType ? null : voteType;

    try {
      await castVoteMutation.mutateAsync({
        postId: postId,
        voteType: newVoteType
      });
    } catch (error) {
      toast.error('Erro ao votar. Tente novamente.');
    }
  };

  return (
    <div className="reddit-vote-buttons">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "reddit-vote-button",
          userVote === 'up' && "text-green-600 bg-green-50 hover:bg-green-100"
        )}
        onClick={() => handleVote('up')}
        disabled={castVoteMutation.isPending}
      >
        <ChevronUp className="w-4 h-4" />
      </Button>

      <span className={cn(
        "reddit-vote-score",
        netScore > 0 && "text-green-600",
        netScore < 0 && "text-red-600",
        netScore === 0 && "text-muted-foreground"
      )}>
        {Math.abs(netScore) > 999 
          ? `${Math.floor(Math.abs(netScore) / 1000)}k`
          : netScore.toString()
        }
      </span>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "reddit-vote-button",
          userVote === 'down' && "text-red-600 bg-red-50 hover:bg-red-100"
        )}
        onClick={() => handleVote('down')}
        disabled={castVoteMutation.isPending}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
};
