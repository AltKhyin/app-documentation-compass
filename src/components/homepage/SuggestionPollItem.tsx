
// ABOUTME: Atomic component for displaying and voting on individual suggestions.

import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Suggestion } from './NextEditionModule';

interface SuggestionPollItemProps {
  suggestion: Suggestion;
}

const SuggestionPollItem: React.FC<SuggestionPollItemProps> = ({ suggestion }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(suggestion.upvotes);

  const handleVote = async () => {
    if (isVoting) return;

    setIsVoting(true);
    try {
      // TODO: Implement useCastVoteMutation hook when ready
      console.log('Voting on suggestion:', suggestion.id);
      
      // Optimistic update
      if (hasVoted) {
        setVoteCount(prev => prev - 1);
        setHasVoted(false);
      } else {
        setVoteCount(prev => prev + 1);
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      // Revert optimistic update on error
      if (hasVoted) {
        setVoteCount(prev => prev + 1);
        setHasVoted(true);
      } else {
        setVoteCount(prev => prev - 1);
        setHasVoted(false);
      }
    } finally {
      setIsVoting(false);
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
          {voteCount}
        </span>
        <Button
          variant={hasVoted ? "default" : "outline"}
          size="sm"
          onClick={handleVote}
          disabled={isVoting}
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
