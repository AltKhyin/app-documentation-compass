
// ABOUTME: Useful links module for community sidebar.

import React from 'react';
import { SidebarLink } from '../../../../packages/hooks/useCommunitySidebarQuery';
import { ExternalLink } from 'lucide-react';

interface LinksModuleProps {
  links: SidebarLink[];
}

export const LinksModule = ({ links }: LinksModuleProps) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-semibold mb-3 text-foreground">Links Úteis</h3>
      <div className="space-y-3">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="block p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{link.title}</p>
                {link.description && (
                  <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
