
// ABOUTME: Individual suggestion item with voting functionality and optimistic updates.

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCastVoteMutation } from '../../../packages/hooks/useSuggestionMutations';
import { useAppData } from '@/contexts/AppDataContext';

interface Suggestion {
  id: number;
  title: string;
  description: string | null;
  upvotes: number;
  created_at: string;
  Practitioners: {
    full_name: string;
  } | null;
}

interface SuggestionPollItemProps {
  suggestion: Suggestion;
}

const SuggestionPollItem: React.FC<SuggestionPollItemProps> = ({ suggestion }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [optimisticVotes, setOptimisticVotes] = useState(suggestion.upvotes);
  const { toast } = useToast();
  const { userProfile } = useAppData();
  
  const castVoteMutation = useCastVoteMutation();

  // TODO: In a future iteration, we should fetch the user's current vote status
  // For now, we'll track it locally
  useEffect(() => {
    setOptimisticVotes(suggestion.upvotes);
  }, [suggestion.upvotes]);

  const handleVote = async () => {
    if (!userProfile) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para votar.",
        variant: "destructive",
      });
      return;
    }

    const action = hasVoted ? 'retract' : 'vote';
    const previousVoteState = hasVoted;
    const previousVoteCount = optimisticVotes;

    // Optimistic update
    setHasVoted(!hasVoted);
    setOptimisticVotes(prev => hasVoted ? prev - 1 : prev + 1);

    try {
      await castVoteMutation.mutateAsync({
        suggestion_id: suggestion.id,
        action
      });

      toast({
        title: hasVoted ? "Voto removido" : "Voto computado",
        description: hasVoted 
          ? "Seu voto foi removido com sucesso." 
          : "Seu voto foi registrado com sucesso.",
      });
    } catch (error: any) {
      console.error('Failed to cast vote:', error);
      
      // Rollback optimistic update
      setHasVoted(previousVoteState);
      setOptimisticVotes(previousVoteCount);
      
      // Handle specific error types
      if (error.message?.includes('already voted')) {
        setHasVoted(true); // User actually has voted
        toast({
          title: "Voto já registrado",
          description: "Você já votou nesta sugestão.",
          variant: "destructive",
        });
      } else if (error.message?.includes('Rate limit')) {
        toast({
          title: "Muitos votos",
          description: "Você atingiu o limite de votos por minuto. Tente novamente em breve.",
          variant: "destructive",
        });
      } else if (error.message?.includes('Authentication')) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para votar.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao votar",
          description: "Ocorreu um erro ao registrar seu voto. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors">
      <Button
        variant={hasVoted ? "default" : "outline"}
        size="sm"
        onClick={handleVote}
        disabled={castVoteMutation.isPending}
        className="flex-shrink-0 flex items-center gap-1 min-w-[60px]"
      >
        <ChevronUp className="h-4 w-4" />
        <span className="text-sm font-medium">{optimisticVotes}</span>
      </Button>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground line-clamp-2 mb-1">
          {suggestion.title}
        </h4>
        
        {suggestion.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {suggestion.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Por {suggestion.Practitioners?.full_name || 'Anônimo'}</span>
          <span>•</span>
          <span>{formatDate(suggestion.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default SuggestionPollItem;
