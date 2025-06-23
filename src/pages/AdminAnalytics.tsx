
// ABOUTME: Admin analytics dashboard for platform metrics and insights

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Eye, Download, Filter } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const AdminAnalytics = () => {
  const { user } = useAuthStore();

  // Mock data for demonstration - would be replaced with actual hooks
  const analytics = {
    totalPageViews: 15432,
    uniqueVisitors: 3421,
    engagementRate: 68.5,
    conversionRate: 4.2
  };

  const topContent = [
    { id: 1, title: 'Análise de Performance em React', views: 1234, engagement: 85 },
    { id: 2, title: 'Metodologias Ágeis na Prática', views: 987, engagement: 78 },
    { id: 3, title: 'Ferramentas de Desenvolvimento', views: 756, engagement: 72 },
    { id: 4, title: 'Otimização de Código', views: 645, engagement: 69 },
  ];

  const timeRanges = ['7 dias', '30 dias', '90 dias', '1 ano'];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analytics
        </h2>
        <p className="text-gray-600">
          Métricas de performance e insights da plataforma.
        </p>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Período de Análise</CardTitle>
          <CardDescription>
            Selecione o período para visualizar as métricas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <Button key={range} variant="outline" size="sm">
                {range}
              </Button>
            ))}
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtros Avançados
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              +12% vs. período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              +8% vs. período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.engagementRate}%</div>
            <p className="text-xs text-green-600">
              +3% vs. período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-red-600">
              -1% vs. período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Tendências de Tráfego</CardTitle>
          <CardDescription>
            Visualização temporal do engajamento dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <p>Gráfico de tendências será implementado aqui</p>
              <p className="text-sm">Integração com biblioteca de gráficos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Content */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo Mais Popular</CardTitle>
          <CardDescription>
            Reviews e posts com melhor performance no período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium">{content.title}</h3>
                    <p className="text-sm text-gray-500">{content.views} visualizações</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    {content.engagement}% engajamento
                  </Badge>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Insights de Usuário</CardTitle>
            <CardDescription>
              Comportamento e preferências dos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Tempo médio na página</span>
                <Badge variant="outline">3min 45s</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Taxa de rejeição</span>
                <Badge variant="outline">32%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Páginas por sessão</span>
                <Badge variant="outline">2.8</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispositivos</CardTitle>
            <CardDescription>
              Distribuição de acesso por tipo de dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Desktop</span>
                <Badge variant="outline">45%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Mobile</span>
                <Badge variant="outline">42%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Tablet</span>
                <Badge variant="outline">13%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
