
// ABOUTME: Review detail page with layout-aware rendering and community integration.

import React from 'react';
import { useParams } from 'react-router-dom';
import { useReviewDetailQuery } from '../../packages/hooks/useReviewDetailQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ReviewDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: review, isLoading, error } = useReviewDetailQuery(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              {error.message.includes('not found') 
                ? 'Esta revisão não foi encontrada ou não está mais disponível.'
                : error.message.includes('Access denied')
                ? 'Acesso negado. Este conteúdo requer uma assinatura de nível superior.'
                : 'Erro ao carregar a revisão. Tente novamente mais tarde.'
              }
            </AlertDescription>
          </Alert>
          
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={() => navigate('/acervo')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Acervo
          </Button>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Revisão não encontrada</h2>
          <p className="text-muted-foreground mb-4">
            A revisão solicitada não foi encontrada
          </p>
          <Button onClick={() => navigate('/acervo')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Acervo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Navigation */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6"
          onClick={() => navigate('/acervo')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Acervo
        </Button>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {review.title}
          </h1>
          
          {review.description && (
            <p className="text-lg text-muted-foreground mb-6">
              {review.description}
            </p>
          )}

          {/* Author info */}
          {review.author && (
            <div className="flex items-center gap-4 mb-6">
              {review.author.avatar_url ? (
                <img 
                  src={review.author.avatar_url} 
                  alt={review.author.full_name || 'Author'}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {review.author.full_name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium">
                  {review.author.full_name || 'Autor Anônimo'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.published_at).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Content Body - Placeholder for LayoutAwareRenderer */}
        <main className="mb-12">
          {/* Cover image */}
          {review.cover_image_url && (
            <div className="mb-8">
              <img 
                src={review.cover_image_url}
                alt={review.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Structured content placeholder */}
          <div className="prose prose-lg max-w-none">
            <div className="p-6 bg-muted/50 rounded-lg border-2 border-dashed">
              <h3 className="text-lg font-semibold mb-2">
                📝 LayoutAwareRenderer - Em Desenvolvimento
              </h3>
              <p className="text-muted-foreground mb-4">
                O sistema de renderização de layout personalizado será implementado aqui.
                Este componente irá interpretar o structured_content v2.0 e renderizar
                os blocos de conteúdo conforme o design personalizado criado no editor.
              </p>
              <details className="text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  Ver dados brutos do structured_content
                </summary>
                <pre className="bg-background p-4 rounded border overflow-auto text-xs">
                  {JSON.stringify(review.structured_content, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </main>

        {/* Community Thread Placeholder */}
        {review.community_post_id && (
          <section className="border-t pt-8">
            <div className="p-6 bg-muted/50 rounded-lg border-2 border-dashed">
              <h3 className="text-lg font-semibold mb-2">
                💬 Discussão da Comunidade - Em Desenvolvimento
              </h3>
              <p className="text-muted-foreground">
                Sistema de comentários lazy-loaded será implementado aqui.
                Community Post ID: {review.community_post_id}
              </p>
            </div>
          </section>
        )}

        {/* Recommended Section Placeholder */}
        <section className="border-t pt-8 mt-8">
          <div className="p-6 bg-muted/50 rounded-lg border-2 border-dashed">
            <h3 className="text-lg font-semibold mb-2">
              📚 Leituras Recomendadas - Em Desenvolvimento
            </h3>
            <p className="text-muted-foreground">
              Sistema de recomendações será implementado aqui.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
