
// ABOUTME: Bottom navigation bar for mobile devices with error boundary protection.

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, User, Bookmark } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/auth';
import ShellErrorBoundary from './ShellErrorBoundary';

const BottomTabBar = () => {
  const location = useLocation();
  const { session } = useAuthStore();
  
  const tabs = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/acervo', icon: BookOpen, label: 'Acervo' },
    { path: '/community', icon: Users, label: 'Comunidade' },
    { path: '/saved', icon: Bookmark, label: 'Salvos' },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];

  const handleTabClick = (path: string) => {
    if (location.pathname !== path) {
      window.location.href = path;
    }
  };

  return (
    <ShellErrorBoundary>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="flex justify-around items-center py-2 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            
            return (
              <Button
                key={tab.path}
                variant="ghost"
                size="sm"
                onClick={() => handleTabClick(tab.path)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={18} />
                <span className="text-xs font-medium">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </ShellErrorBoundary>
  );
};

export default BottomTabBar;
