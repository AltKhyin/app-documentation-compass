
// ABOUTME: Main community page that orchestrates the two-column layout with consolidated data fetching.

import React from 'react';
import { CommunityFeedWithSidebar } from '../components/community/CommunityFeedWithSidebar';
import { useCommunityPageQuery } from '../../packages/hooks/useCommunityPageQuery';
import { Loader2 } from 'lucide-react';

export default function ComunidadePage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useCommunityPageQuery();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-destructive mb-4">Erro ao carregar a comunidade</p>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <CommunityFeedWithSidebar
      posts={data?.posts || []}
      sidebarData={data?.sidebarData}
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
    />
  );
}
