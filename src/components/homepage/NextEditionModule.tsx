
// ABOUTME: Module component for the next edition suggestion and voting system with standardized layout.

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Clock } from 'lucide-react';
import SuggestionPollItem from './SuggestionPollItem';
import { useSubmitSuggestionMutation } from '../../../packages/hooks/useSubmitSuggestionMutation';

export interface Suggestion {
  id: number;
  title: string;
  description: string;
  upvotes: number;
  created_at: string;
  user_has_voted?: boolean;
  Practitioners: {
    full_name: string;
    avatar_url?: string;
  };
}

interface NextEditionModuleProps {
  suggestions: Suggestion[];
}

const NextEditionModule: React.FC<NextEditionModuleProps> = ({ suggestions }) => {
  const [newSuggestion, setNewSuggestion] = useState('');
  const submitSuggestionMutation = useSubmitSuggestionMutation();

  // Mock countdown data (we'll implement backend later)
  const mockCountdown = "5d 34min";
  const mockProgress = 65; // Progress percentage

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestion.trim()) return;

    try {
      await submitSuggestionMutation.mutateAsync({
        title: newSuggestion.trim(),
        description: ''
      });
      
      setNewSuggestion('');
    } catch (error) {
      console.error('Failed to submit suggestion:', error);
    }
  };

  return (
    <div className="bg-background rounded-md p-6 border border-border shadow-md">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Suggestion Form */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            {/* Header with title and timer */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground font-serif">Próxima Edição</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} />
                <span>{mockCountdown}</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <Progress value={mockProgress} className="w-full h-2" />
            </div>
          </div>

          <form onSubmit={handleSubmitSuggestion} className="space-y-4">
            <Input
              type="text"
              placeholder="Sugira um artigo ou tema para a próxima edição"
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
              className="w-full bg-surface-muted"
              disabled={submitSuggestionMutation.isPending}
            />
            <Button 
              type="submit" 
              disabled={!newSuggestion.trim() || submitSuggestionMutation.isPending}
              className="w-full bg-primary text-primary-foreground"
            >
              {submitSuggestionMutation.isPending ? 'Enviando...' : 'Enviar Sugestão'}
            </Button>
          </form>
        </div>

        {/* Right Column - Voting List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Vote nas sugestões</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <SuggestionPollItem key={suggestion.id} suggestion={suggestion} />
              ))
            ) : (
              <div className="text-secondary text-center py-8">
                <p className="text-sm">Nenhuma sugestão disponível no momento.</p>
                <p className="text-xs mt-2">Seja o primeiro a sugerir um tópico!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextEditionModule;
