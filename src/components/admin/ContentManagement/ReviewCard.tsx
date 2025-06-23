
// ABOUTME: Individual review card component displaying review metadata with quick action buttons

import React from 'react';
import { ReviewQueueItem } from '../../../../packages/hooks/useContentQueueQuery';
import { WorkflowActions } from './WorkflowActions';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReviewCardProps {
  review: ReviewQueueItem;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

export const ReviewCard = ({ review, isSelected, onSelect }: ReviewCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      under_review: { label: 'Under Review', variant: 'default' as const },
      scheduled: { label: 'Scheduled', variant: 'outline' as const },
      published: { label: 'Published', variant: 'default' as const },
      archived: { label: 'Archived', variant: 'secondary' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
      { label: status, variant: 'secondary' as const };

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Selection Checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="mt-1"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {review.title}
              </h3>
              {review.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {review.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {getStatusBadge(review.review_status)}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
            {/* Author */}
            {review.author && (
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={review.author.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {review.author.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{review.author.full_name}</span>
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDate(review.created_at)}</span>
            </div>

            {/* Scheduled Date */}
            {review.scheduled_publish_at && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Scheduled {formatDate(review.scheduled_publish_at)}</span>
              </div>
            )}

            {/* Reviewer */}
            {review.reviewer && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Reviewer: {review.reviewer.full_name}</span>
              </div>
            )}
          </div>

          {/* Publication Notes */}
          {review.publication_notes && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <strong>Notes:</strong> {review.publication_notes}
            </div>
          )}

          {/* Actions */}
          <WorkflowActions review={review} />
        </div>
      </div>
    </div>
  );
};
