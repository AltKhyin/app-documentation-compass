
// ABOUTME: Admin tag management page for organizing and maintaining content tags

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tags, Plus, Edit, Trash2, Hash } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const AdminTagManagement = () => {
  const { user } = useAuthStore();

  // Mock data for demonstration - would be replaced with actual hooks
  const tagStats = {
    totalTags: 89,
    popularTags: 12,
    unusedTags: 8,
    newThisMonth: 5
  };

  const tags = [
    { id: 1, name: 'Performance', usage: 45, color: 'blue', parent: null },
    { id: 2, name: 'Metodologia', usage: 32, color: 'green', parent: null },
    { id: 3, name: 'Ferramentas', usage: 28, color: 'purple', parent: null },
    { id: 4, name: 'Análise', usage: 21, color: 'orange', parent: 'Performance' },
    { id: 5, name: 'Otimização', usage: 18, color: 'red', parent: 'Performance' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gestão de Tags
        </h2>
        <p className="text-gray-600">
          Organize e mantenha o sistema de tags para categorização de conteúdo.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tags</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tagStats.totalTags}</div>
            <p className="text-xs text-muted-foreground">
              Tags no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags Populares</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tagStats.popularTags}</div>
            <p className="text-xs text-muted-foreground">
              Mais de 10 usos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags Não Utilizadas</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tagStats.unusedTags}</div>
            <p className="text-xs text-muted-foreground">
              Sem conteúdo associado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novas Este Mês</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tagStats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Criadas recentemente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tag Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Gestão</CardTitle>
          <CardDescription>
            Ferramentas para organização e manutenção de tags
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Nova Tag
            </Button>
            <Button variant="outline" className="justify-start">
              <Tags className="mr-2 h-4 w-4" />
              Organizar Hierarquia
            </Button>
            <Button variant="outline" className="justify-start">
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar Não Utilizadas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tags List */}
      <Card>
        <CardHeader>
          <CardTitle>Tags do Sistema</CardTitle>
          <CardDescription>
            Lista de todas as tags disponíveis e suas estatísticas de uso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded bg-${tag.color}-500`}></div>
                  <div>
                    <h3 className="font-medium">#{tag.name}</h3>
                    {tag.parent && (
                      <p className="text-sm text-gray-500">Filho de: {tag.parent}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    {tag.usage} usos
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTagManagement;
