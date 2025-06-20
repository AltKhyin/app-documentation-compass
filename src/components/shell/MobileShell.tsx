
// ABOUTME: Main application shell for mobile viewports with bottom tab bar navigation.

import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import BottomTabBar from './BottomTabBar';
import { Button } from '../ui/button';
import NotificationBell from './NotificationBell';
import { Info } from 'lucide-react';

const MobileShell = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center">
          <h1 className="text-xl font-serif font-bold text-foreground">
            Reviews<span className="text-primary">.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Show info button only on community page */}
          {location.pathname === '/comunidade' && (
            <Link to="/comunidade/info">
              <Button variant="ghost" size="sm" className="p-2">
                <Info className="w-5 h-5" />
              </Button>
            </Link>
          )}
          <NotificationBell />
        </div>
      </header>
      
      {/* Main Content rendered via React Router Outlet */}
      <main className="pt-16 min-h-[calc(100vh-112px)]">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
};

export default MobileShell;
