
// ABOUTME: Atomic component for displaying and voting on individual suggestions with simplified state management.

import React from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Suggestion } from './NextEditionModule';
import { useCastVoteMutation } from '../../../packages/hooks/useCastVoteMutation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SuggestionPollItemProps {
  suggestion: Suggestion;
}

const SuggestionPollItem: React.FC<SuggestionPollItemProps> = ({ suggestion }) => {
  const queryClient = useQueryClient();
  const castVoteMutation = useCastVoteMutation();

  const handleVote = () => {
    if (castVoteMutation.isPending) return;

    // Determine action based on current suggestion state (single source of truth)
    const currentHasVoted = suggestion.user_has_voted || false;
    const action = currentHasVoted ? 'remove_vote' : 'upvote';

    console.log(`Voting action: ${action} for suggestion ${suggestion.id}, current state: hasVoted=${currentHasVoted}`);

    // Use TanStack Query's recommended pattern for mutations
    castVoteMutation.mutate(
      { suggestion_id: suggestion.id, action },
      {
        onSuccess: (result) => {
          console.log('Vote successful:', result);
          toast.success(action === 'upvote' ? 'Voto registrado!' : 'Voto removido!');
          // Invalidate query to get fresh data from server
          queryClient.invalidateQueries({ queryKey: ['consolidated-homepage-feed'] });
        },
        onError: (error) => {
          console.error('Vote failed:', error);
          toast.error('Erro ao votar', { 
            description: error.message 
          });
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-between p-3 bg-surface rounded-md border border-border hover:bg-surface-muted transition-colors">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-foreground line-clamp-1">
          {suggestion.title}
        </h4>
        {suggestion.description && (
          <p className="text-xs text-secondary mt-1 line-clamp-2">
            {suggestion.description}
          </p>
        )}
        <p className="text-xs text-secondary mt-1">
          Por {suggestion.Practitioners?.full_name || 'Anônimo'}
        </p>
      </div>
      
      <div className="flex items-center gap-2 ml-3">
        <span className="text-sm font-medium text-foreground min-w-[2rem] text-right">
          {suggestion.upvotes}
        </span>
        <Button
          variant={suggestion.user_has_voted ? "default" : "outline"}
          size="sm"
          onClick={handleVote}
          disabled={castVoteMutation.isPending}
          className="p-2 h-8 w-8"
        >
          <ChevronUp 
            size={14} 
            className={suggestion.user_has_voted ? "text-primary-foreground" : "text-secondary"} 
          />
        </Button>
      </div>
    </div>
  );
};

export default SuggestionPollItem;
