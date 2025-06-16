
// ABOUTME: Module component for the next edition suggestion and voting system with full backend integration.

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { useSubmitSuggestionMutation } from '../../../packages/hooks/useSuggestionMutations';
import SuggestionPollItem from './SuggestionPollItem';

export interface Suggestion {
  id: number;
  title: string;
  description: string;
  upvotes: number;
  created_at: string;
  Practitioners: {
    full_name: string;
  };
}

interface NextEditionModuleProps {
  suggestions: Suggestion[];
}

const NextEditionModule: React.FC<NextEditionModuleProps> = ({ suggestions }) => {
  const [newSuggestion, setNewSuggestion] = useState('');
  const { toast } = useToast();
  
  const submitSuggestionMutation = useSubmitSuggestionMutation();

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestion.trim()) return;

    try {
      await submitSuggestionMutation.mutateAsync({
        title: newSuggestion.trim()
      });
      
      // Reset form on success
      setNewSuggestion('');
      
      toast({
        title: "Sugestão enviada!",
        description: "Sua sugestão foi enviada com sucesso e está aguardando votação.",
      });
    } catch (error: any) {
      console.error('Failed to submit suggestion:', error);
      
      // Handle specific error types
      if (error.message?.includes('Rate limit')) {
        toast({
          title: "Muitas sugestões",
          description: "Você atingiu o limite de 5 sugestões por hora. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } else if (error.message?.includes('Authentication')) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para sugerir tópicos.",
          variant: "destructive",
        });
      } else if (error.message?.includes('characters')) {
        toast({
          title: "Erro de validação",
          description: "O título deve ter entre 5 e 200 caracteres.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao enviar",
          description: "Ocorreu um erro ao enviar sua sugestão. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="bg-card rounded-md p-6 border border-border">
      <h2 className="text-foreground text-2xl font-bold mb-6 font-serif">Próxima Edição</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Suggestion Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Sugira um tópico</h3>
          <form onSubmit={handleSubmitSuggestion} className="space-y-4">
            <Input
              type="text"
              placeholder="Digite sua sugestão de tópico..."
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
              className="w-full"
              disabled={submitSuggestionMutation.isPending}
              minLength={5}
              maxLength={200}
            />
            <Button 
              type="submit" 
              disabled={!newSuggestion.trim() || submitSuggestionMutation.isPending}
              className="w-full"
            >
              {submitSuggestionMutation.isPending ? 'Enviando...' : 'Sugerir'}
            </Button>
          </form>
        </div>

        {/* Poll List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Vote nas sugestões</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <SuggestionPollItem key={suggestion.id} suggestion={suggestion} />
              ))
            ) : (
              <div className="text-muted-foreground text-center py-8">
                <p>Nenhuma sugestão disponível no momento.</p>
                <p className="text-sm mt-2">Seja o primeiro a sugerir um tópico!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextEditionModule;
