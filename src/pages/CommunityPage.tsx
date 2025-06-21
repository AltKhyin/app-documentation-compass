
// ABOUTME: Main community page with single scroll container architecture - no nested scrolling.

import React from 'react';
import { CommunityFeedWithSidebar } from '../components/community/CommunityFeedWithSidebar';
import { CommunityErrorBoundary } from '../components/community/CommunityErrorBoundary';
import { CommunityLoadingState } from '../components/community/CommunityLoadingState';
import { NetworkAwareFallback, useNetworkStatus } from '../components/community/NetworkAwareFallback';
import { useCommunityPageQuery } from '../../packages/hooks/useCommunityPageQuery';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

export default function CommunityPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    dataUpdatedAt
  } = useCommunityPageQuery();

  const { isOnline } = useNetworkStatus();
  const lastSync = dataUpdatedAt ? new Date(dataUpdatedAt) : undefined;

  // Enhanced error handling with network awareness
  if (error && !data) {
    return (
      <div className="container mx-auto px-4 py-6">
        <CommunityErrorBoundary context="página da comunidade" showDetails={true}>
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {!isOnline ? 
                  'Sem conexão com a internet. Verifique sua conexão e tente novamente.' :
                  `Erro ao carregar a comunidade: ${error.message}`
                }
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                disabled={!isOnline}
                className="flex items-center gap-2"
              >
                {!isOnline ? <WifiOff className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                {!isOnline ? 'Sem Conexão' : 'Tentar Novamente'}
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
              >
                Voltar ao Início
              </Button>
            </div>
          </div>
        </CommunityErrorBoundary>
      </div>
    );
  }

  // Enhanced loading state with progressive indicators
  if (isLoading && !data) {
    return (
      <div className="container mx-auto px-4 py-6">
        <CommunityLoadingState 
          variant="page" 
          description="Carregando comunidade..."
          showAnimation={true}
        />
      </div>
    );
  }

  // Show network fallback if offline with no data
  if (!isOnline && !data) {
    return (
      <div className="container mx-auto px-4 py-6">
        <NetworkAwareFallback
          isOnline={isOnline}
          onRetry={() => window.location.reload()}
          context="comunidade"
        />
      </div>
    );
  }

  return (
    <CommunityErrorBoundary context="página principal da comunidade">
      <CommunityFeedWithSidebar
        posts={data?.posts || []}
        sidebarData={data?.sidebarData}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        lastSync={lastSync}
        isLoading={isLoading}
        error={error}
      />
    </CommunityErrorBoundary>
  );
}
