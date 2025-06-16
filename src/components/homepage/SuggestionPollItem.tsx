
// ABOUTME: Atomic component for displaying and voting on individual suggestions.

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Suggestion } from './NextEditionModule';
import { useCastVoteMutation } from '../../../packages/hooks/useCastVoteMutation';

interface SuggestionPollItemProps {
  suggestion: Suggestion;
}

const SuggestionPollItem: React.FC<SuggestionPollItemProps> = ({ suggestion }) => {
  // Initialize state from suggestion data if available
  const [hasVoted, setHasVoted] = useState(suggestion.user_has_voted || false);
  const [optimisticVoteCount, setOptimisticVoteCount] = useState(suggestion.upvotes);
  const castVoteMutation = useCastVoteMutation();

  // Update local state when suggestion prop changes (from server updates)
  useEffect(() => {
    setHasVoted(suggestion.user_has_voted || false);
    setOptimisticVoteCount(suggestion.upvotes);
  }, [suggestion.user_has_voted, suggestion.upvotes]);

  const handleVote = async () => {
    if (castVoteMutation.isPending) return;

    const action = hasVoted ? 'remove_vote' : 'upvote';
    
    // Store original state for rollback
    const originalHasVoted = hasVoted;
    const originalVoteCount = optimisticVoteCount;
    
    // Optimistic update
    const newVoteCount = hasVoted ? optimisticVoteCount - 1 : optimisticVoteCount + 1;
    const newHasVoted = !hasVoted;
    
    setOptimisticVoteCount(newVoteCount);
    setHasVoted(newHasVoted);

    try {
      const result = await castVoteMutation.mutateAsync({
        suggestion_id: suggestion.id,
        action
      });
      
      // Update with actual count from server
      setOptimisticVoteCount(result.new_vote_count);
      setHasVoted(result.user_has_voted);
    } catch (error) {
      console.error('Failed to vote:', error);
      // Revert optimistic update on error
      setOptimisticVoteCount(originalVoteCount);
      setHasVoted(originalHasVoted);
    }
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
          {optimisticVoteCount}
        </span>
        <Button
          variant={hasVoted ? "default" : "outline"}
          size="sm"
          onClick={handleVote}
          disabled={castVoteMutation.isPending}
          className="p-2 h-8 w-8"
        >
          <ChevronUp 
            size={14} 
            className={hasVoted ? "text-primary-foreground" : "text-secondary"} 
          />
        </Button>
      </div>
    </div>
  );
};

export default SuggestionPollItem;
