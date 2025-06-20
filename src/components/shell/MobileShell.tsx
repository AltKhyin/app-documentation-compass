
// ABOUTME: Mobile application shell with header and bottom navigation.

import React from 'react';
import Header from './Header';
import BottomTabBar from './BottomTabBar';

interface MobileShellProps {
  children: React.ReactNode;
}

const MobileShell = ({ children }: MobileShellProps) => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-auto pb-16">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
};

export default MobileShell;
