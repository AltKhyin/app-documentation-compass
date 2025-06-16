
// ABOUTME: The main sidebar navigation for desktop views with collapsible functionality.
import React from 'react';
import { ChevronLeft, ChevronRight, Home, Archive, Users, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import NavItem from './NavItem';
import UserProfileBlock from './UserProfileBlock';

interface CollapsibleSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const CollapsibleSidebar = ({ isCollapsed, onToggle }: CollapsibleSidebarProps) => {
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Archive, label: 'Acervo', path: '/acervo' },
    { icon: Users, label: 'Comunidade', path: '/comunidade' },
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  return (
    <aside className={`fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-60'} hidden md:flex flex-col`}>
      {/* Header with logo */}
      <div className="flex items-center p-4 border-b border-border min-h-[65px]">
        {!isCollapsed ? (
          <h1 className="font-serif font-medium tracking-tight text-2xl text-foreground">
            Reviews.
          </h1>
        ) : (
          <h1 className="font-serif font-medium tracking-tight text-2xl text-foreground">
            R.
          </h1>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavItem
            key={item.path}
            href={item.path}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Collapse button */}
      <div className="px-4 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* User profile block at bottom */}
      <div className="p-4 border-t border-border">
        <UserProfileBlock isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export default CollapsibleSidebar;
