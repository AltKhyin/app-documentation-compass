
// ABOUTME: Reddit-style horizontal voting buttons with optimistic updates and visual feedback.

import React from 'react';
import { Button } from '../ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
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
    <div className="reddit-vote-container">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "reddit-vote-button rounded-l-full px-2 py-1",
          userVote === 'up' && "text-vote-up bg-vote-up/10"
        )}
        onClick={() => handleVote('up')}
        disabled={castVoteMutation.isPending}
      >
        <ArrowUp className="w-4 h-4" />
      </Button>

      <span className={cn(
        "reddit-vote-score",
        netScore > 0 && "text-vote-up",
        netScore < 0 && "text-vote-down",
        netScore === 0 && "text-community-metadata"
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
          "reddit-vote-button rounded-r-full px-2 py-1",
          userVote === 'down' && "text-vote-down bg-vote-down/10"
        )}
        onClick={() => handleVote('down')}
        disabled={castVoteMutation.isPending}
      >
        <ArrowDown className="w-4 h-4" />
      </Button>
    </div>
  );
};
