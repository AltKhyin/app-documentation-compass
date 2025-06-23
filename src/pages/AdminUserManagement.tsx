
// ABOUTME: Admin user management page for user administration and role management

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, UserPlus, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const AdminUserManagement = () => {
  const { user } = useAuthStore();

  // Mock data for demonstration - would be replaced with actual hooks
  const userStats = {
    totalUsers: 1234,
    activeToday: 89,
    newThisWeek: 23,
    premiumUsers: 156
  };

  const recentUsers = [
    { id: '1', name: 'João Silva', email: 'joao@example.com', role: 'practitioner', status: 'active', joinedAt: '2025-06-20' },
    { id: '2', name: 'Maria Santos', email: 'maria@example.com', role: 'practitioner', status: 'active', joinedAt: '2025-06-19' },
    { id: '3', name: 'Pedro Costa', email: 'pedro@example.com', role: 'editor', status: 'active', joinedAt: '2025-06-18' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gestão de Usuários
        </h2>
        <p className="text-gray-600">
          Gerencie usuários, papéis e permissões da plataforma.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuários registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos Hoje</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.activeToday}</div>
            <p className="text-xs text-muted-foreground">
              Usuários ativos nas últimas 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Esta Semana</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.newThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Registros nos últimos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Premium</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.premiumUsers}</div>
            <p className="text-xs text-muted-foreground">
              Assinantes ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Gestão</CardTitle>
          <CardDescription>
            Ferramentas rápidas para administração de usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <UserPlus className="mr-2 h-4 w-4" />
              Convidar Usuário
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Gerenciar Papéis
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Recentes</CardTitle>
          <CardDescription>
            Últimos usuários registrados na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.role === 'editor' ? 'default' : 'secondary'}>
                    {user.role === 'editor' ? 'Editor' : 'Praticante'}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(user.joinedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
