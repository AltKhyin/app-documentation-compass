
// ABOUTME: Community information page for mobile users to access rules, links, and other static sidebar content.

import React from 'react';
import { useCommunitySidebarQuery } from '../../packages/hooks/useCommunitySidebarQuery';
import { RulesModule } from '../components/community/sidebar/RulesModule';
import { LinksModule } from '../components/community/sidebar/LinksModule';
import { RecentActivityModule } from '../components/community/sidebar/RecentActivityModule';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const CommunityInfoPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useCommunitySidebarQuery();

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/comunidade')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Comunidade
            </Button>
          </div>
          
          <Alert>
            <AlertDescription>
              Erro ao carregar informações da comunidade. Tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/comunidade')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Comunidade
          </Button>
        </div>

        <div className="border-l-4 border-primary bg-muted/50 p-6 rounded-r-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Informações da Comunidade</h1>
          <p className="text-muted-foreground">
            Regras, links úteis e estatísticas da nossa comunidade científica.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {/* Loading skeletons */}
            <div className="bg-card border rounded-lg p-6">
              <Skeleton className="h-5 w-32 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <Skeleton className="h-5 w-24 mb-3" />
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Community Rules */}
            <RulesModule rules={data.rules} />
            
            {/* Recent Activity */}
            <RecentActivityModule activity={data.recentActivity} />
            
            {/* Useful Links */}
            <LinksModule links={data.links} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CommunityInfoPage;
