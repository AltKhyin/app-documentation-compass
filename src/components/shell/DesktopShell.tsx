
// ABOUTME: Desktop shell layout component with simplified structure - no header, just sidebar and content.

import React, { useState } from 'react';
import CollapsibleSidebar from './CollapsibleSidebar';
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
          'flex-1 transition-all duration-300 ease-in-out',
          isCollapsed ? 'ml-20' : 'ml-60' // Match sidebar widths exactly
        )}
      >
        {/* Scrollable content area - simplified without header */}
        <main className="min-h-screen overflow-y-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesktopShell;
