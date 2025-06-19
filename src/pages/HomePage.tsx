
// ABOUTME: Homepage component that displays consolidated feed data

import React from 'react';
import { useHomepageFeedQuery } from '../../packages/hooks/useHomepageFeedQuery';
import { FeaturedReview } from '../components/homepage/FeaturedReview';
import { ReviewCarousel } from '../components/homepage/ReviewCarousel';
import { SuggestionPollItem } from '../components/homepage/SuggestionPollItem';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';

const HomePage = () => {
  const { data, isLoading, error } = useHomepageFeedQuery();

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <Skeleton className="h-48 w-full" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Erro ao carregar a página inicial: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum conteúdo disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Featured Review */}
      {data.featured && (
        <section>
          <FeaturedReview review={data.featured} />
        </section>
      )}

      {/* Recent Reviews */}
      {data.recent && data.recent.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Reviews Recentes</h2>
          <ReviewCarousel reviews={data.recent} />
        </section>
      )}

      {/* Popular Reviews */}
      {data.popular && data.popular.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Reviews Populares</h2>
          <ReviewCarousel reviews={data.popular} />
        </section>
      )}

      {/* Suggestions */}
      {data.suggestions && data.suggestions.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Sugestões da Comunidade</h2>
          <div className="space-y-4">
            {data.suggestions.map((suggestion) => (
              <SuggestionPollItem key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
