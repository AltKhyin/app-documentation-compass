
// ABOUTME: Atomic component for displaying a single suggestion with vote count and upvote button.

import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';

export interface Suggestion {
  id: number;
  title: string;
  description: string;
  total_votes: number;
  created_at: string;
  Practitioners: {
    full_name: string;
  };
}

interface SuggestionPollItemProps {
  suggestion: Suggestion;
}

const SuggestionPollItem: React.FC<SuggestionPollItemProps> = ({ suggestion }) => {
  const [isVoted, setIsVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(suggestion.total_votes);

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic update
    if (isVoted) {
      setVoteCount(prev => prev - 1);
      setIsVoted(false);
    } else {
      setVoteCount(prev => prev + 1);
      setIsVoted(true);
    }
    
    // TODO: Wire up to useCastVoteMutation when available
    console.log('Vote toggled for suggestion:', suggestion.id);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-card rounded-md border border-border">
      <div className="flex-1 mr-4">
        <p className="text-foreground text-sm font-medium mb-1">
          {suggestion.title}
        </p>
        {suggestion.description && (
          <p className="text-muted-foreground text-xs mb-2">
            {suggestion.description}
          </p>
        )}
        <p className="text-muted-foreground text-xs">
          por {suggestion.Practitioners.full_name}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">
          {voteCount}
        </span>
        <button
          onClick={handleVote}
          className={`p-2 rounded-md transition-colors ${
            isVoted 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          <ChevronUp size={16} />
        </button>
      </div>
    </div>
  );
};

export default SuggestionPollItem;
