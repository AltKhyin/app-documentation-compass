
// ABOUTME: Community rules module displaying guidelines and expandable rule list.

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { Button } from '../../ui/button';

interface RulesModuleProps {
  rules: string[];
}

export const RulesModule = ({ rules }: RulesModuleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show first 3 rules by default, rest when expanded
  const visibleRules = isExpanded ? rules : rules.slice(0, 3);
  const hasMoreRules = rules.length > 3;

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-blue-500" />
        <h3 className="font-semibold text-foreground">Regras da Comunidade</h3>
      </div>
      
      <div className="space-y-3">
        {visibleRules.map((rule, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">{index + 1}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {rule}
            </p>
          </div>
        ))}
        
        {hasMoreRules && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-8 mt-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronRight className="w-3 h-3 mr-1" />
                Ver todas ({rules.length})
              </>
            )}
          </Button>
        )}
        
        {rules.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma regra configurada
          </p>
        )}
      </div>
    </div>
  );
};
