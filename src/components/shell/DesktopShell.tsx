
// ABOUTME: Desktop application shell with proper two-column layout management and header.

import React, { useState } from 'react';
import CollapsibleSidebar from './CollapsibleSidebar';
import Header from './Header';

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
      {/* Main content area with header and proper content constraints */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-60'
        }`}
      >
        {/* Desktop Header - as per Blueprint 02 requirements */}
        <Header />
        
        {/* Main content with proper containment */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesktopShell;
