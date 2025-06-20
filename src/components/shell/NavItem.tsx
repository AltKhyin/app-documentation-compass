
// ABOUTME: Individual navigation item component with proper Router context handling.

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const NavItem = ({ href, icon: Icon, label, isCollapsed }: NavItemProps) => {
  const location = useLocation();
  
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          isCollapsed && "justify-center px-2"
        )
      }
    >
      <Icon size={20} className="flex-shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
};

export default NavItem;
