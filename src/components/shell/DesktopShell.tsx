
// ABOUTME: Renders the two-column layout for desktop and tablet viewports with fixed header.
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CollapsibleSidebar from './CollapsibleSidebar';
import { cn } from '@/lib/utils';
import NotificationBell from './NotificationBell';

const DesktopShell = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    // Collapse sidebar by default on tablet screens (less than 1024px wide)
    return window.innerWidth < 1024;
  });

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Fixed Header at top of page with proper background */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between border-b border-border bg-background px-6">
        {/* Logo - matching sidebar styling */}
        <div className="flex items-center">
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Reviews<span className="text-primary">.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationBell />
        </div>
      </header>
      
      {/* Fixed Sidebar */}
      <CollapsibleSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      
      {/* Main Content Area with top padding for fixed header and left margin for sidebar */}
      <div className={cn(
        'min-h-screen transition-all duration-300 pt-16 bg-background',
        isCollapsed ? 'ml-20' : 'ml-60'
      )}>
        {/* Main Content rendered via React Router Outlet */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DesktopShell;
