
// ABOUTME: Individual review card component for the masonry grid.

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { AcervoReview } from '../../../packages/hooks/useAcervoDataQuery';

interface ReviewCardProps {
  review: AcervoReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const handleClick = () => {
    // TODO: Navigate to review detail page when implemented
    console.log('Navigate to review:', review.review_id);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 mb-4 break-inside-avoid"
      onClick={handleClick}
    >
      {review.cover_image_url && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={review.cover_image_url} 
            alt={review.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {review.title}
        </h3>
        {review.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {review.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mt-3">
          {Object.keys(review.tags_json).map(categoria => (
            <div key={categoria} className="flex flex-wrap gap-1">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {categoria}
              </span>
              {review.tags_json[categoria].map(subtag => (
                <span key={subtag} className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">
                  {subtag}
                </span>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
