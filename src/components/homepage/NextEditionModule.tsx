
// ABOUTME: Module component for the next edition suggestion and voting system.

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestion.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement useSubmitSuggestionMutation hook when ready
      console.log('Submitting suggestion:', newSuggestion);
      
      // Reset form on success
      setNewSuggestion('');
    } catch (error) {
      console.error('Failed to submit suggestion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background rounded-md p-6 border border-border shadow-md">
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
              className="w-full bg-surface-muted"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              disabled={!newSuggestion.trim() || isSubmitting}
              className="w-full bg-primary text-primary-foreground"
            >
              {isSubmitting ? 'Enviando...' : 'Sugerir'}
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
              <div className="text-secondary text-center py-8">
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
