
// ABOUTME: User profile page following decoupled architecture - fetches its own data per Blueprint 07

import React from 'react';
import { useParams } from 'react-router-dom';
import { useProfilePageQuery } from '../../packages/hooks/useProfilePageQuery';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const ProfilePage = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { data, isLoading, isError, error } = useProfilePageQuery(userId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </div>
        <Skeleton className="h-32 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Erro ao Carregar Perfil
          </h2>
          <p className="text-muted-foreground">
            {error?.message || 'Não foi possível carregar o perfil do usuário.'}
          </p>
        </div>
      </div>
    );
  }

  const { userProfile, isOwnProfile } = data || {};

  return (
    <ErrorBoundary 
      tier="feature"
      context="página de perfil"
      showDetails={process.env.NODE_ENV === 'development'}
      showHomeButton={true}
      showBackButton={true}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile?.avatar_url ?? undefined} />
              <AvatarFallback>
                {userProfile?.full_name?.split(' ').map(n => n[0]).join('') ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {userProfile?.full_name ?? 'Usuário'}
              </h1>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary">
                  {userProfile?.role ?? 'practitioner'}
                </Badge>
                <Badge variant="outline">
                  {userProfile?.subscription_tier ?? 'free'} tier
                </Badge>
              </div>
              {userProfile?.profession && (
                <p className="text-muted-foreground mt-1">
                  {userProfile.profession}
                </p>
              )}
            </div>
          </div>

          {userProfile?.biography && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Sobre</h3>
              <p className="text-muted-foreground">{userProfile.biography}</p>
            </div>
          )}

          {userProfile?.affiliation && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Afiliação</h3>
              <p className="text-muted-foreground">{userProfile.affiliation}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>Score de Contribuição: {userProfile?.contribution_score ?? 0}</span>
            <span>Membro desde: {
              userProfile?.created_at 
                ? new Date(userProfile.created_at).toLocaleDateString('pt-BR')
                : 'N/A'
            }</span>
          </div>
        </div>

        {/* Future Profile Features */}
        <div className="border-l-4 border-primary bg-muted/50 p-6 rounded-r-lg">
          <h2 className="text-xl font-semibold mb-2">Perfil Completo em Desenvolvimento</h2>
          <p className="text-muted-foreground">
            Esta página será expandida conforme Blueprint 07 - Profile System.
          </p>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Funcionalidades Planejadas:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Histórico de atividades e contribuições</li>
            <li>• Sistema de contribuição score detalhado</li>
            <li>• Reviews favoritos e listas personalizadas</li>
            <li>• Configurações de perfil avançadas</li>
            <li>• Estatísticas de engajamento</li>
            {isOwnProfile && (
              <li>• Edição de perfil (disponível apenas no seu próprio perfil)</li>
            )}
          </ul>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProfilePage;
