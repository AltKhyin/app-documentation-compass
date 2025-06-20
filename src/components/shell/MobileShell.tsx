
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
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-16">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <BottomTabBar />
    </div>
  );
};

export default MobileShell;
