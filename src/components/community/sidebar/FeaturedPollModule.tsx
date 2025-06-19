
// ABOUTME: Featured poll module for displaying and interacting with community polls.

import React from 'react';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { BarChart3, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { FeaturedPoll } from '../../../../packages/hooks/useCommunitySidebarQuery';
import { useCastPollVoteMutation } from '../../../../packages/hooks/useCastPollVoteMutation';
import { useAuthStore } from '../../../store/auth';
import { toast } from 'sonner';

interface FeaturedPollModuleProps {
  poll: FeaturedPoll;
}

export const FeaturedPollModule = ({ poll }: FeaturedPollModuleProps) => {
  const { user } = useAuthStore();
  const castVoteMutation = useCastPollVoteMutation();

  const handleVote = async (optionId: number) => {
    if (!user) {
      toast.error('Você precisa estar logado para votar');
      return;
    }

    try {
      await castVoteMutation.mutateAsync({
        poll_id: poll.id,
        option_id: optionId
      });
      toast.success('Voto registrado com sucesso!');
    } catch (error) {
      toast.error('Erro ao votar. Tente novamente.');
    }
  };

  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
  const userHasVoted = poll.user_vote !== null;

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-blue-500" />
        <h3 className="font-semibold text-foreground">Enquête da Semana</h3>
      </div>
      
      <div className="space-y-4">
        {/* Poll question */}
        <h4 className="font-medium text-foreground leading-tight">
          {poll.question}
        </h4>
        
        {/* Poll options */}
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = poll.total_votes > 0 
              ? Math.round((option.vote_count / poll.total_votes) * 100) 
              : 0;
            const isUserChoice = poll.user_vote === option.id;
            
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {option.text}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {percentage}%
                  </span>
                </div>
                
                {/* Progress bar */}
                <Progress 
                  value={percentage} 
                  className={`h-2 ${isUserChoice ? 'bg-primary/20' : ''}`}
                />
                
                {/* Vote button or result display */}
                {!userHasVoted && !isExpired ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => handleVote(option.id)}
                    disabled={castVoteMutation.isPending}
                  >
                    Votar em "{option.text}"
                  </Button>
                ) : (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{option.vote_count} votos</span>
                    {isUserChoice && (
                      <span className="text-primary font-medium">Sua escolha</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Poll metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>{poll.total_votes} votos totais</span>
          {poll.expires_at && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {isExpired 
                  ? 'Enquête finalizada' 
                  : `Termina ${formatDistanceToNow(new Date(poll.expires_at), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}`
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
