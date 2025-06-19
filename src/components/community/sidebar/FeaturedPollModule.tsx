
// ABOUTME: Featured poll module for community sidebar showing highlighted polls with voting interface.

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { BarChart3, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../../lib/utils';

interface PollOption {
  id: number;
  option_text: string;
  vote_count: number;
}

interface FeaturedPoll {
  id: number;
  question: string;
  options: PollOption[];
  total_votes: number;
  expires_at: string | null;
  created_at: string;
  user_vote?: number | null;
}

interface FeaturedPollModuleProps {
  poll?: FeaturedPoll | null;
  onVote?: (pollId: number, optionId: number) => void;
  isVoting?: boolean;
}

export const FeaturedPollModule = ({ poll, onVote, isVoting = false }: FeaturedPollModuleProps) => {
  if (!poll) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5" />
            Enquete em Destaque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhuma enquete em destaque no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
  const hasVoted = poll.user_vote !== null && poll.user_vote !== undefined;

  const handleVote = (optionId: number) => {
    if (!hasVoted && !isExpired && onVote) {
      onVote(poll.id, optionId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5" />
          Enquete em Destaque
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Poll Question */}
        <div>
          <h4 className="font-medium mb-2">{poll.question}</h4>
          
          {/* Poll Metadata */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {poll.total_votes} votos
            </div>
            {poll.expires_at && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {isExpired ? 'Expirada' : `Expira ${formatDistanceToNow(new Date(poll.expires_at), { addSuffix: true, locale: ptBR })}`}
              </div>
            )}
          </div>

          {isExpired && (
            <Badge variant="secondary" className="mb-3">
              Enquete Encerrada
            </Badge>
          )}
        </div>

        {/* Poll Options */}
        <div className="space-y-2">
          {poll.options.map((option) => {
            const percentage = poll.total_votes > 0 ? (option.vote_count / poll.total_votes) * 100 : 0;
            const isSelected = poll.user_vote === option.id;

            return (
              <div key={option.id} className="space-y-1">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "w-full justify-start text-left h-auto p-3 relative overflow-hidden",
                    hasVoted && "cursor-default",
                    isExpired && "cursor-not-allowed opacity-60"
                  )}
                  onClick={() => handleVote(option.id)}
                  disabled={hasVoted || isExpired || isVoting}
                >
                  {/* Background progress bar for voted options */}
                  {hasVoted && (
                    <div 
                      className="absolute inset-0 bg-primary/10 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  
                  <div className="relative z-10 flex justify-between items-center w-full">
                    <span className="flex-1">{option.option_text}</span>
                    {hasVoted && (
                      <div className="flex items-center gap-2 text-xs">
                        <span>{option.vote_count}</span>
                        <span>({percentage.toFixed(0)}%)</span>
                      </div>
                    )}
                  </div>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Voting Status */}
        {hasVoted && (
          <p className="text-xs text-muted-foreground text-center">
            ✓ Você já votou nesta enquete
          </p>
        )}
      </CardContent>
    </Card>
  );
};
