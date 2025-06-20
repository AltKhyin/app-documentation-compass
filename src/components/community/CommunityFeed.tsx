
// ABOUTME: Reddit-style community feed with horizontal separators and de-boxed layout.

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
    <div className="bg-background">
      {posts.map((post, index) => (
        <React.Fragment key={post.id}>
          <PostCard post={post} />
          {index < posts.length - 1 && (
            <Separator className="reddit-separator" />
          )}
        </React.Fragment>
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
