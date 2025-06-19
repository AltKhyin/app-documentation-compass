
// ABOUTME: Community rules module for displaying community guidelines in the sidebar.

import React from 'react';

interface RulesModuleProps {
  rules: string[];
}

export const RulesModule = ({ rules }: RulesModuleProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-semibold mb-3 text-foreground">Regras da Comunidade</h3>
      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-xs text-muted-foreground font-medium mt-1 flex-shrink-0">
              {index + 1}.
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {rule}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
