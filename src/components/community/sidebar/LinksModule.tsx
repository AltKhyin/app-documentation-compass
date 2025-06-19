
// ABOUTME: Useful links module for community sidebar displaying helpful resources and external links.

import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { SidebarLink } from '../../../../packages/hooks/useCommunitySidebarQuery';

interface LinksModuleProps {
  links: SidebarLink[];
}

export const LinksModule = ({ links }: LinksModuleProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-semibold mb-4 text-foreground">Links Úteis</h3>
      
      <div className="space-y-3">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : '_self'}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="block group"
          >
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0 mt-0.5">
                <ExternalLink className="w-4 h-4 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {link.title}
                </h4>
                {link.description && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {link.description}
                  </p>
                )}
              </div>
            </div>
          </a>
        ))}
        
        {links.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum link configurado
          </p>
        )}
      </div>
    </div>
  );
};
