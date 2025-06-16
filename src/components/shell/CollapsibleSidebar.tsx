
// ABOUTME: The main sidebar navigation for desktop views with collapsible functionality.
import React from 'react';
import { ChevronLeft, ChevronRight, Home, Archive, Users, Settings } from 'lucide-react';
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
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <div className={`flex flex-col h-full bg-background border-r border-border transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`}>
      {/* Header with logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <h1 className="font-serif font-medium tracking-tight text-2xl text-foreground">
            Reviews.
          </h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
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

      {/* User profile block at bottom */}
      <div className="mt-auto p-4 border-t border-border">
        <UserProfileBlock isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default CollapsibleSidebar;
