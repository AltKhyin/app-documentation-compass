import { CommunityFeedWithSidebar } from '@/components/community/CommunityFeedWithSidebar';
import { CommunityLoadingState } from '@/components/community/CommunityLoadingState';
import { useCommunityPageQuery } from '@/packages/hooks/useCommunityPageQuery';

export function CommunityPage() {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommunityPageQuery();

  // Aggregate posts from all fetched pages for infinite scrolling
  const allPosts = data?.pages.flatMap(page => page.data.posts.items) ?? [];
  const sidebarData = data?.pages[0]?.data.sidebarData;
  const lastSync = data?.pages[0]?.data.lastSync
    ? new Date(data.pages[0].data.lastSync)
    : undefined;

  return (
    // The incorrect wrapper <div class="min-h-screen..."> has been removed.
    // This allows the shell's <main> element to correctly manage its own scrolling,
    // finally fixing the layout bug.
    <CommunityLoadingState
      isLoading={isLoading && allPosts.length === 0}
      error={error}
    >
      <CommunityFeedWithSidebar
        posts={allPosts}
        sidebarData={sidebarData}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        lastSync={lastSync}
        isLoading={isLoading && allPosts.length === 0}
        error={error}
      />
    </CommunityLoadingState>
  );
}