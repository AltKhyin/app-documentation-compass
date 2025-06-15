
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
};

const NavItem = ({ href, icon: Icon, label, isCollapsed = false }: NavItemProps) => {
  const linkContent = (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 text-muted-foreground transition-all hover:text-primary',
          isCollapsed
            ? 'h-12 w-12 justify-center rounded-lg'
            : 'rounded-lg px-3 py-2',
          { 'bg-muted text-primary': isActive }
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
