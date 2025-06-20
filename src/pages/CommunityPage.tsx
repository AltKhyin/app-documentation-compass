
// ABOUTME: Community page with Reddit-style layout and seamless feed integration.

import React from 'react';
import { CommunityFeedWithSidebar } from '../components/community/CommunityFeedWithSidebar';
import { CommunityErrorBoundary } from '../components/community/CommunityErrorBoundary';
import { CommunityLoadingState } from '../components/community/CommunityLoadingState';
import { useCommunityPageQuery } from '../../packages/hooks/useCommunityPageQuery';
import { useIsMobile } from '../hooks/use-mobile';

const CommunityPage = () => {
  const isMobile = useIsMobile();
  const { data, isLoading, error } = useCommunityPageQuery();

  if (isLoading) {
    return <CommunityLoadingState />;
  }

  if (error) {
    return (
      <CommunityErrorBoundary 
        error={error} 
        resetErrorBoundary={() => window.location.reload()} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reddit-style seamless container */}
      <div className="max-w-7xl mx-auto">
        {/* Mobile header with community info */}
        {isMobile && (
          <div className="sticky top-0 z-10 bg-background border-b border-community-separator px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">Comunidade EVIDENS</h1>
                <p className="text-sm text-muted-foreground">
                  Discussões científicas de alto nível
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Desktop header - integrated into the layout */}
        {!isMobile && (
          <div className="px-6 py-4 border-b border-community-separator">
            <div className="max-w-4xl">
              <h1 className="text-2xl font-bold mb-1">Comunidade EVIDENS</h1>
              <p className="text-muted-foreground">
                Discussões científicas de alto nível • Praticantes conectados
              </p>
            </div>
          </div>
        )}

        {/* Main content with Reddit-style layout */}
        <div className="flex gap-6 px-0 md:px-6">
          <CommunityFeedWithSidebar 
            initialData={data}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
