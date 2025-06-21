
// ABOUTME: Desktop shell layout component with proper sidebar-content relationship and fixed header architecture.

import React, { useState } from 'react';
import CollapsibleSidebar from './CollapsibleSidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface DesktopShellProps {
  children: React.ReactNode;
}

const DesktopShell = ({ children }: DesktopShellProps) => {
  // This component manages the collapsed state to coordinate sidebar and content layout
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen w-full bg-background flex">
      {/* Fixed sidebar - independent positioning */}
      <CollapsibleSidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main content wrapper - positioned to avoid sidebar overlap */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out',
          isCollapsed ? 'ml-20' : 'ml-60' // Match sidebar widths exactly
        )}
      >
        {/* Fixed Header - now properly separated from scrollable content */}
        <Header />

        {/* Scrollable content area - CRITICAL: This is where page content scrolls */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesktopShell;
