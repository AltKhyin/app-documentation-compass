
// ABOUTME: Main Community page with desktop/mobile responsive layout per Blueprint 06.

import React from 'react';
import { CommunityFeed } from '../components/community/CommunityFeed';
import { CommunityFeedWithSidebar } from '../components/community/CommunityFeedWithSidebar';
import { CommunitySidebar } from '../components/community/CommunitySidebar';
import { useIsMobile } from '../hooks/use-mobile';

const ComunidadePage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {isMobile ? (
        // Mobile: Single column layout with pinned sidebar cards
        <div className="space-y-6">
          <div className="border-l-4 border-primary bg-muted/50 p-4 rounded-r-lg">
            <h1 className="text-2xl font-bold text-foreground mb-1">Comunidade</h1>
            <p className="text-muted-foreground text-sm">
              Participe das discussões e compartilhe conhecimento com outros praticantes.
            </p>
          </div>
          
          <CommunityFeedWithSidebar />
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
            <div className="sticky top-6">
              <CommunitySidebar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComunidadePage;
