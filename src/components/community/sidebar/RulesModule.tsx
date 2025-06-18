
// ABOUTME: Community rules display module for sidebar.

import React from 'react';

interface RulesModuleProps {
  rules: string[];
}

export const RulesModule = ({ rules }: RulesModuleProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-semibold mb-3 text-foreground">Regras da Comunidade</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start">
            <span className="text-primary mr-2 mt-0.5">•</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
