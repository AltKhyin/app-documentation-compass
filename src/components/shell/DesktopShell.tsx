
// ABOUTME: Desktop application shell with proper two-column layout management.

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
      {/* Main content area with proper sidebar spacing */}
      <main 
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-60'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DesktopShell;
