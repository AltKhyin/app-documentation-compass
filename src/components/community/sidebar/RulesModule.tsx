
// ABOUTME: Community rules module displaying guidelines and policies for community participation.

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface RulesModuleProps {
  rules?: string[];
}

const DEFAULT_RULES = [
  "Seja respeitoso e profissional em todas as interações",
  "Mantenha discussões relevantes ao tema científico",
  "Não faça spam ou promoção excessiva",
  "Cite fontes científicas quando possível",
  "Respeite a privacidade e confidencialidade",
  "Reporte conteúdo inadequado aos moderadores"
];

export const RulesModule = ({ rules = DEFAULT_RULES }: RulesModuleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="w-5 h-5" />
          Regras da Comunidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Rules list */}
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary">{index + 1}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {rule}
              </p>
            </div>
          ))}
        </div>

        {/* Important notice */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Importante:</p>
              <p>
                O descumprimento das regras pode resultar em advertências ou suspensão da conta.
                Para dúvidas, entre em contato com a moderação.
              </p>
            </div>
          </div>
        </div>

        {/* Contact badge */}
        <div className="pt-2">
          <Badge variant="outline" className="text-xs">
            Dúvidas? Contate os moderadores
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
