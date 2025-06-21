
// ABOUTME: Reddit-style community feed with separator-based layout and optimized infinite scroll.

import React from 'react';
import { PostCard } from './PostCard';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
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
    <div className="reddit-feed-container">
      {posts.map((post, index) => (
        <React.Fragment key={post.id}>
          <PostCard post={post} />
          {/* Add separator between posts, but not after the last post */}
          {index < posts.length - 1 && <Separator className="my-0" />}
        </React.Fragment>
      ))}

      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center pt-6 pb-4">
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
