
// ABOUTME: Main Community page with desktop/mobile responsive layout per Blueprint 06.

import React from 'react';
import { CommunityFeed } from '../components/community/CommunityFeed';
import { useIsMobile } from '../hooks/use-mobile';

const ComunidadePage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {isMobile ? (
        // Mobile: Single column layout
        <div className="space-y-6">
          <div className="border-l-4 border-primary bg-muted/50 p-4 rounded-r-lg">
            <h1 className="text-2xl font-bold text-foreground mb-1">Comunidade</h1>
            <p className="text-muted-foreground text-sm">
              Participe das discussões e compartilhe conhecimento com outros praticantes.
            </p>
          </div>
          
          <CommunityFeed />
        </div>
      ) : (
        // Desktop: Two column layout per Blueprint 06
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Left column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border-l-4 border-primary bg-muted/50 p-6 rounded-r-lg">
              <h1 className="text-3xl font-bold text-foreground mb-2">Comunidade</h1>
              <p className="text-muted-foreground">
                Participe das discussões e compartilhe conhecimento com outros praticantes de alto sinal.
              </p>
            </div>
            
            <CommunityFeed />
          </div>

          {/* Sidebar - Right column (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Community Rules */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-3">Regras da Comunidade</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Mantenha discussões respeitosas e construtivas</li>
                  <li>• Foque em evidências científicas</li>
                  <li>• Evite spam e autopromoção excessiva</li>
                  <li>• Use categorias apropriadas para seus posts</li>
                  <li>• Cite fontes quando relevante</li>
                </ul>
              </div>

              {/* Quick Stats */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-3">Estatísticas</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de Discussões</span>
                    <span className="font-medium">Em breve</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Membros Ativos</span>
                    <span className="font-medium">Em breve</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discussões Hoje</span>
                    <span className="font-medium">Em breve</span>
                  </div>
                </div>
              </div>

              {/* Help */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-3">Precisa de Ajuda?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Primeira vez na comunidade? Veja como começar e tirar o máximo proveito das discussões.
                </p>
                <button className="text-sm text-primary hover:underline">
                  Guia para Iniciantes →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComunidadePage;
