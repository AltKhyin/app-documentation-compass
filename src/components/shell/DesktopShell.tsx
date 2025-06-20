
// ABOUTME: Desktop application shell with collapsible sidebar layout.

import React, { useState } from 'react';
import CollapsibleSidebar from './CollapsibleSidebar';

interface DesktopShellProps {
  children: React.ReactNode;
}

const DesktopShell = ({ children }: DesktopShellProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      <CollapsibleSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={handleToggleSidebar} 
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DesktopShell;
