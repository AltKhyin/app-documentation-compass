
// ABOUTME: Renders the two-column layout for desktop and tablet viewports.
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
    <div className="flex min-h-screen w-full">
      {/* Fixed Sidebar */}
      <CollapsibleSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="hidden md:flex sticky top-0 z-10 h-16 items-center justify-end gap-4 border-b bg-background px-6">
          <NotificationBell />
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DesktopShell;
