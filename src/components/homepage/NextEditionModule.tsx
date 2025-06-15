
// ABOUTME: Module component for the next edition suggestion form and poll system.

import React, { useState } from 'react';
import SuggestionPollItem, { Suggestion } from './SuggestionPollItem';

interface NextEditionModuleProps {
  suggestions: Suggestion[];
}

const NextEditionModule: React.FC<NextEditionModuleProps> = ({ suggestions }) => {
  const [suggestionText, setSuggestionText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;
    
    // TODO: Wire up to useSubmitSuggestionMutation when available
    console.log('Submitting suggestion:', suggestionText);
    setSuggestionText('');
  };

  return (
    <div className="bg-card rounded-md p-6 border border-border">
      <h2 className="text-foreground text-2xl font-bold mb-6">Próxima Edição</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Suggestion Form - Left Side */}
        <div>
          <h3 className="text-foreground text-lg font-semibold mb-4">
            Sugira um artigo ou tema
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder="Sugira um artigo ou tema para a próxima edição"
              className="w-full p-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground resize-none"
              rows={4}
            />
            
            <button
              type="submit"
              disabled={!suggestionText.trim()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Enviar Sugestão
            </button>
          </form>
        </div>
        
        {/* Poll List - Right Side */}
        <div>
          <h3 className="text-foreground text-lg font-semibold mb-4">
            Vote nas sugestões
          </h3>
          
          {suggestions && suggestions.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <SuggestionPollItem key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-md p-6 text-center">
              <p className="text-muted-foreground">Nenhuma sugestão disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextEditionModule;
