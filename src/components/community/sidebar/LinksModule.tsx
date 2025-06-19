
// ABOUTME: Useful links module for displaying relevant links in the community sidebar.

import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { SidebarLink } from '../../../../packages/hooks/useCommunitySidebarQuery';

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
            className="block group hover:bg-muted/50 p-3 rounded-md transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {link.title}
                </h4>
                {link.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {link.description}
                  </p>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
