
// ABOUTME: Settings and configuration page - theme settings, notifications, account preferences.
import React from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ConfiguracoesPage = () => {
  const { userProfile, isLoading } = useAppData();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse bg-muted h-32 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-l-4 border-primary bg-muted/50 p-6 rounded-r-lg">
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências de conta, notificações e configurações da plataforma.
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>
            Personalize a aparência da plataforma de acordo com suas preferências.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Modo escuro</Label>
            <Switch id="dark-mode" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="system-theme">Seguir tema do sistema</Label>
            <Switch id="system-theme" />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            Controle quais notificações você deseja receber.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Notificações por email</Label>
              <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
            </div>
            <Switch id="email-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="community-notifications">Notificações da comunidade</Label>
              <p className="text-sm text-muted-foreground">Seja notificado sobre atividades da comunidade</p>
            </div>
            <Switch id="community-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-content-notifications">Novos conteúdos</Label>
              <p className="text-sm text-muted-foreground">Receba notificações sobre novos reviews</p>
            </div>
            <Switch id="new-content-notifications" />
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
          <CardDescription>
            Gerencie suas configurações de conta e privacidade.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-public">Perfil público</Label>
              <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu perfil</p>
            </div>
            <Switch id="profile-public" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-activity">Mostrar atividade</Label>
              <p className="text-sm text-muted-foreground">Exibir suas atividades recentes no perfil</p>
            </div>
            <Switch id="show-activity" />
          </div>
          <Separator />
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              Alterar senha
            </Button>
            <Button variant="outline" className="w-full">
              Baixar dados da conta
            </Button>
            <Button variant="destructive" className="w-full">
              Excluir conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracoesPage;
