
// ABOUTME: Main community page with enhanced error handling and performance optimization.

import React from 'react';
import { CommunityFeedWithSidebar } from '../components/community/CommunityFeedWithSidebar';
import { CommunityErrorBoundary } from '../components/community/CommunityErrorBoundary';
import { CommunityLoadingState } from '../components/community/CommunityLoadingState';
import { useCommunityPageQuery } from '../../packages/hooks/useCommunityPageQuery';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function CommunityPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useCommunityPageQuery();

  // Enhanced error handling with user-friendly messages
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar a comunidade: {error.message}
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  // Enhanced loading state with better skeleton layout
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <CommunityLoadingState variant="feed" count={5} />
          </div>
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <CommunityLoadingState variant="sidebar" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <CommunityErrorBoundary>
      <CommunityFeedWithSidebar
        posts={data?.posts || []}
        sidebarData={data?.sidebarData}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
      />
    </CommunityErrorBoundary>
  );
}
