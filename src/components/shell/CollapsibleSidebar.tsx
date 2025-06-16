
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
      {/* Header with logo - matching notification header height of 64px */}
      <div className={`flex items-center border-b border-border h-16 ${isCollapsed ? 'justify-center px-2' : 'justify-center px-4'}`}>
        {!isCollapsed ? (
          <h1 className="font-serif font-medium tracking-tight text-3xl text-foreground">
            Reviews.
          </h1>
        ) : (
          <h1 className="font-serif font-medium tracking-tight text-3xl text-foreground">
            R.
          </h1>
        )}
      </div>

      {/* Navigation items */}
      <nav className={`flex-1 space-y-2 ${isCollapsed ? 'px-2 py-4' : 'px-4 py-4'}`}>
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
      <div className={`pb-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={`w-full ${isCollapsed ? 'justify-center' : 'justify-end'}`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* User profile block at bottom */}
      <div className={`border-t border-border ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <UserProfileBlock isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export default CollapsibleSidebar;
