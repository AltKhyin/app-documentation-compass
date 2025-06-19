
// ABOUTME: Community sidebar with rules, links, trending discussions, polls, and navigation to saved posts.

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Bookmark, ExternalLink, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CommunityPageResponse } from '../../../packages/hooks/useCommunityPageQuery';

interface CommunitySidebarProps {
  rules: string[];
  links: Array<{ title: string; url: string }>;
  trendingDiscussions: CommunityPageResponse['sidebarData']['trendingDiscussions'];
  featuredPoll?: any;
  recentActivity: CommunityPageResponse['sidebarData']['recentActivity'];
}

export const CommunitySidebar = ({
  rules,
  links,
  trendingDiscussions,
  featuredPoll,
  recentActivity
}: CommunitySidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 sticky top-6">
      {/* Quick Actions - NEW */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/comunidade/salvos')}
            className="w-full justify-start"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Posts Salvos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/community/submit')}
            className="w-full justify-start"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Nova Discussão
          </Button>
        </CardContent>
      </Card>

      {/* Community Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Regras da Comunidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div key={index} className="flex gap-3">
                <span className="text-primary font-medium text-sm min-w-[1.5rem]">
                  {index + 1}.
                </span>
                <p className="text-sm text-muted-foreground">{rule}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Discussions */}
      {trendingDiscussions && trendingDiscussions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Em Alta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingDiscussions.slice(0, 5).map((post) => (
                <div 
                  key={post.id}
                  className="cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
                  onClick={() => navigate(`/comunidade/${post.id}`)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm leading-tight line-clamp-2">
                      {post.title || 'Discussão sem título'}
                    </h4>
                    {post.is_pinned && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        Fixado
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.upvotes} votos</span>
                    <span>{post.reply_count} respostas</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {recentActivity && recentActivity.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {activity.Practitioners.full_name}
                    </span>{' '}
                    criou uma nova discussão
                  </p>
                  <p 
                    className="font-medium text-primary cursor-pointer hover:underline mt-1"
                    onClick={() => navigate(`/comunidade/${activity.id}`)}
                  >
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Useful Links */}
      {links && links.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Links Úteis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <span className="text-sm font-medium">{link.title}</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
