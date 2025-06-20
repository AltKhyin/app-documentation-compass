// ABOUTME: Community feed component that displays posts in a vertical list with infinite scroll functionality.

import React from 'react';
import { PostCard } from './PostCard';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import type { CommunityPost } from '@/types/community';

interface CommunityFeedProps {
  posts: CommunityPost[];
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const CommunityFeed = ({
  posts,
  onLoadMore,
  hasMore,
  isLoadingMore
}: CommunityFeedProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isLoadingMore ? 'Carregando...' : 'Carregar mais'}
          </Button>
        </div>
      )}
    </div>
  );
};
