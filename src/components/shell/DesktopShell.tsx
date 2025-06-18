
// ABOUTME: Renders the two-column layout for desktop and tablet viewports with fixed header.
import React, { useState } from 'react';
import CollapsibleSidebar from './CollapsibleSidebar';
import { cn } from '@/lib/utils';
import NotificationBell from './NotificationBell';

const DesktopShell = ({ children }: { children: React.ReactNode }) => {
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
    <div className="min-h-screen w-full">
      {/* Fixed Header at top of page */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-end gap-4 border-b bg-background px-6">
        <NotificationBell />
      </header>
      
      {/* Fixed Sidebar */}
      <CollapsibleSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      
      {/* Main Content Area with top padding for fixed header and left margin for sidebar */}
      <div className={cn(
        'min-h-screen transition-all duration-300 pt-16',
        isCollapsed ? 'ml-20' : 'ml-60'
      )}>
        {/* Main Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DesktopShell;
