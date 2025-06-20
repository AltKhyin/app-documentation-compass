
// ABOUTME: Desktop shell layout component with proper sidebar-content relationship and responsive layout.

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
    <div className="min-h-screen w-full bg-background relative">
      {/* Fixed sidebar - independent positioning */}
      <CollapsibleSidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main content wrapper - positioned to avoid sidebar overlap */}
      <div
        className={cn(
          'absolute top-0 right-0 bottom-0 transition-all duration-300 ease-in-out',
          isCollapsed ? 'left-20' : 'left-60' // Match sidebar widths exactly
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header - now properly aligned with sidebar header */}
          <Header />

          {/* Page content with proper spacing */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DesktopShell;
