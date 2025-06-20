
// ABOUTME: Voting buttons component with optimistic updates and visual feedback.

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
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "p-1 h-8 w-8 hover:bg-green-50",
          userVote === 'up' && "bg-green-50 text-green-600"
        )}
        onClick={() => handleVote('up')}
        disabled={castVoteMutation.isPending}
      >
        <ChevronUp className="w-4 h-4" />
      </Button>

      <span className={cn(
        "text-sm font-medium px-2 py-1 rounded min-w-[2rem] text-center",
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
          "p-1 h-8 w-8 hover:bg-red-50",
          userVote === 'down' && "bg-red-50 text-red-600"
        )}
        onClick={() => handleVote('down')}
        disabled={castVoteMutation.isPending}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
};
