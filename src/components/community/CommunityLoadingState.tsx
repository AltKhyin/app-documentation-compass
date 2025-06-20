
// ABOUTME: Enhanced loading state component with adaptive skeletons and progressive indicators for community module.

import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardHeader } from '../ui/card';
import { useIsMobile } from '../../hooks/use-mobile';

export interface CommunityLoadingStateProps {
  variant?: 'feed' | 'sidebar' | 'post' | 'minimal' | 'page';
  count?: number;
  showAnimation?: boolean;
  description?: string;
}

export const CommunityLoadingState = ({
  variant = 'feed',
  count = 3,
  showAnimation = true,
  description
}: CommunityLoadingStateProps) => {
  const isMobile = useIsMobile();

  // Progressive loading animation
  const [visibleItems, setVisibleItems] = React.useState(1);

  React.useEffect(() => {
    if (!showAnimation || variant === 'minimal') return;

    const interval = setInterval(() => {
      setVisibleItems(prev => {
        if (prev >= count) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [count, showAnimation, variant]);

  const renderFeedSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: showAnimation ? visibleItems : count }, (_, index) => (
        <Card key={index} className={`${showAnimation ? 'animate-pulse' : ''}`}>
          <CardContent className="p-4">
            <div className="flex gap-3">
              {/* Vote buttons skeleton */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <Skeleton className="w-8 h-6 rounded" />
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-8 h-6 rounded" />
              </div>

              {/* Content skeleton */}
              <div className="flex-1 space-y-3">
                {/* Header with badges */}
                <div className="flex items-center gap-2">
                  <Skeleton className="w-16 h-5 rounded-full" />
                  <Skeleton className="w-20 h-5 rounded-full" />
                  {!isMobile && <Skeleton className="w-12 h-4 rounded-full" />}
                </div>

                {/* Title */}
                <Skeleton className="w-4/5 h-6 rounded" />
                
                {/* Content preview */}
                <div className="space-y-2">
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-3/4 h-4 rounded" />
                  {!isMobile && <Skeleton className="w-1/2 h-4 rounded" />}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-20 h-4 rounded" />
                    <Skeleton className="w-16 h-4 rounded" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="w-6 h-4 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSidebarSkeleton = () => (
    <div className="space-y-4 sticky top-6">
      {/* Rules module */}
      <Card>
        <CardHeader>
          <Skeleton className="w-24 h-5 rounded" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="w-full h-4 rounded" />
          ))}
        </CardContent>
      </Card>

      {/* Trending discussions */}
      <Card>
        <CardHeader>
          <Skeleton className="w-32 h-5 rounded" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="w-full h-4 rounded" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-12 h-3 rounded" />
                <Skeleton className="w-16 h-3 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <Skeleton className="w-28 h-5 rounded" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-full h-4 rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderPostSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-16 h-5 rounded-full" />
            <Skeleton className="w-20 h-5 rounded-full" />
          </div>

          {/* Title */}
          <Skeleton className="w-3/5 h-8 rounded" />

          {/* Content */}
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="w-full h-4 rounded" />
            ))}
            <Skeleton className="w-2/3 h-4 rounded" />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-8 rounded" />
              <Skeleton className="w-16 h-8 rounded" />
              <Skeleton className="w-16 h-8 rounded" />
            </div>
            <Skeleton className="w-8 h-8 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMinimalSkeleton = () => (
    <div className="flex justify-center items-center py-8">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Carregando...</span>
      </div>
    </div>
  );

  const renderPageSkeleton = () => (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Page header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <Skeleton className="w-32 h-8 rounded" />
              <Skeleton className="w-32 h-10 rounded" />
            </div>
          </div>
          {renderFeedSkeleton()}
        </div>

        {/* Sidebar */}
        {!isMobile && (
          <div className="w-80 flex-shrink-0">
            {renderSidebarSkeleton()}
          </div>
        )}
      </div>
    </div>
  );

  // Render appropriate skeleton based on variant
  switch (variant) {
    case 'feed':
      return (
        <div>
          {description && (
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )}
          {renderFeedSkeleton()}
        </div>
      );
    case 'sidebar':
      return renderSidebarSkeleton();
    case 'post':
      return renderPostSkeleton();
    case 'minimal':
      return renderMinimalSkeleton();
    case 'page':
      return renderPageSkeleton();
    default:
      return renderFeedSkeleton();
  }
};
