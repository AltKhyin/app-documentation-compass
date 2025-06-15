
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
          'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
          isActive
            ? isMobile || isCollapsed
              ? 'bg-secondary text-primary'
              : 'bg-muted text-primary'
            : 'text-muted-foreground',
          { 'justify-center px-2': isCollapsed }
        )
      }
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  );

  if (isCollapsed) {
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
