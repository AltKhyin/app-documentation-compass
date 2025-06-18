
// ABOUTME: Featured poll module for community sidebar with voting functionality.

import React from 'react';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { useCastPollVoteMutation } from '../../../../packages/hooks/useCastPollVoteMutation';
import { FeaturedPoll } from '../../../../packages/hooks/useCommunitySidebarQuery';

interface FeaturedPollModuleProps {
  poll: FeaturedPoll;
}

export const FeaturedPollModule = ({ poll }: FeaturedPollModuleProps) => {
  const castVoteMutation = useCastPollVoteMutation();

  const handleVote = (optionId: number) => {
    if (poll.user_vote === optionId) return; // Already voted for this option
    
    castVoteMutation.mutate({
      poll_id: poll.id,
      option_id: optionId
    });
  };

  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
  const hasVoted = poll.user_vote !== null;

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-semibold mb-3 text-foreground">Enquete da Semana</h3>
      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">{poll.question}</p>
        
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = poll.total_votes > 0 
              ? Math.round((option.vote_count / poll.total_votes) * 100) 
              : 0;
            const isSelected = poll.user_vote === option.id;
            
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground">{option.text}</span>
                  {hasVoted && (
                    <span className="text-xs text-muted-foreground">
                      {percentage}% ({option.vote_count})
                    </span>
                  )}
                </div>
                
                {hasVoted ? (
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${isSelected ? 'bg-primary/20' : ''}`}
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleVote(option.id)}
                    disabled={isExpired || castVoteMutation.isPending}
                  >
                    {castVoteMutation.isPending ? 'Votando...' : 'Votar'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-xs text-muted-foreground pt-2 border-t">
          {poll.total_votes} voto{poll.total_votes !== 1 ? 's' : ''} total
          {isExpired && ' • Enquete encerrada'}
        </div>
      </div>
    </div>
  );
};
