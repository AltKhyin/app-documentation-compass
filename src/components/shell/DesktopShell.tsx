
// ABOUTME: Renders the two-column layout for desktop viewports.
import React, { useState } from 'react';
import CollapsibleSidebar from './CollapsibleSidebar';
import { cn } from '@/lib/utils';
import NotificationBell from './NotificationBell';

const DesktopShell = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen w-full">
      <CollapsibleSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <div
        className={cn(
          'flex flex-col transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:pl-20' : 'lg:pl-60'
        )}
      >
        <header className="hidden lg:flex sticky top-0 z-10 h-16 items-center justify-end gap-4 border-b bg-background px-6">
            <NotificationBell />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DesktopShell;
