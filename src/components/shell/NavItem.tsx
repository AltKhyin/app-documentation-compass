
// ABOUTME: A reusable navigation item for sidebars and tab bars.
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type NavItemProps = {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed?: boolean;
  isMobile?: boolean;
};

const NavItem = ({ href, icon: Icon, label, isCollapsed = false, isMobile = false }: NavItemProps) => {
  const linkContent = (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg transition-all hover:text-primary',
          isActive
            ? isMobile
              ? 'text-primary'
              : 'bg-secondary text-primary' // Use bg-secondary for active desktop item
            : 'text-muted-foreground',
          { 'justify-center': isCollapsed },
          // Adjust padding for different states to ensure proper centering
          isCollapsed && !isMobile ? 'p-3' : 'px-3 py-2'
        )
      }
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  );

  if (isCollapsed && !isMobile) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return linkContent;
};

export default NavItem;
