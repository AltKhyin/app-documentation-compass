
// ABOUTME: Settings/configuration page placeholder for mobile navigation.
import React from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const ConfiguracoesPage = () => {
  const { userProfile } = useAppData();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      
      {/* User Info */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Informações da Conta</h2>
        <div className="space-y-2">
          <p><strong>Nome:</strong> {userProfile?.full_name ?? 'N/A'}</p>
          <p><strong>Role:</strong> {userProfile?.role ?? 'practitioner'}</p>
          <p><strong>Tier:</strong> {userProfile?.subscription_tier ?? 'free'}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Ações</h2>
        <Button onClick={handleLogout} variant="outline">
          Sair da Conta
        </Button>
      </div>

      {/* Future Settings */}
      <div className="border-l-4 border-primary bg-muted/50 p-6 rounded-r-lg">
        <h2 className="text-lg font-semibold mb-2">Configurações Avançadas</h2>
        <p className="text-muted-foreground">
          Funcionalidades de configuração serão implementadas conforme os requisitos do projeto.
        </p>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
