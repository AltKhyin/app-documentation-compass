
// ABOUTME: Standardized loading state component for community module with consistent skeleton patterns.

import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent } from '../ui/card';

interface CommunityLoadingStateProps {
  variant?: 'feed' | 'sidebar' | 'post' | 'minimal';
  count?: number;
}

export const CommunityLoadingState = ({ 
  variant = 'feed', 
  count = 3 
}: CommunityLoadingStateProps) => {
  if (variant === 'minimal') {
    return (
      <div className="flex justify-center py-6">
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'post') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Skeleton className="h-16 w-16" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default 'feed' variant
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CommunityLoadingState key={index} variant="post" />
      ))}
    </div>
  );
};
