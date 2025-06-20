
// ABOUTME: Mobile shell layout component with bottom navigation.

import React from 'react';
import Header from './Header';
import BottomTabBar from './BottomTabBar';

interface MobileShellProps {
  children: React.ReactNode;
}

const MobileShell = ({ children }: MobileShellProps) => {
  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Content - CRITICAL: Render children here */}
      <main className="flex-1 overflow-auto pb-16 p-4">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <BottomTabBar />
    </div>
  );
};

export default MobileShell;
