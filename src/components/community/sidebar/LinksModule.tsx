
// ABOUTME: Useful links module for community sidebar with external resources and internal navigation.

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { ExternalLink, FileText, HelpCircle, Mail, Book } from 'lucide-react';

interface CommunityLink {
  title: string;
  url: string;
  external?: boolean;
  icon?: React.ElementType;
  description?: string;
}

interface LinksModuleProps {
  links?: CommunityLink[];
}

const DEFAULT_LINKS: CommunityLink[] = [
  {
    title: "Acervo de Reviews",
    url: "/acervo",
    icon: Book,
    description: "Explore nossa biblioteca de reviews científicos"
  },
  {
    title: "Como Participar",
    url: "/comunidade/info",
    icon: HelpCircle,
    description: "Guia para novos membros da comunidade"
  },
  {
    title: "Guidelines de Discussão",
    url: "https://docs.example.com/discussion-guidelines",
    external: true,
    icon: FileText,
    description: "Diretrizes detalhadas para discussões"
  },
  {
    title: "Contato e Suporte",
    url: "mailto:suporte@evidens.app",
    external: true,
    icon: Mail,
    description: "Entre em contato conosco"
  }
];

export const LinksModule = ({ links = DEFAULT_LINKS }: LinksModuleProps) => {
  const handleLinkClick = (link: CommunityLink) => {
    if (link.external) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } else {
      // For internal links, we could use navigate, but for simplicity using window.location
      window.location.href = link.url;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ExternalLink className="w-5 h-5" />
          Links Úteis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map((link, index) => {
          const IconComponent = link.icon || ExternalLink;
          
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto p-3 text-left"
              onClick={() => handleLinkClick(link)}
            >
              <div className="flex items-start gap-3 w-full">
                <IconComponent className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{link.title}</span>
                    {link.external && (
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  {link.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {link.description}
                    </p>
                  )}
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
