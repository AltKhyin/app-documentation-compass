
// ABOUTME: Mobile shell layout component with bottom navigation and proper header/content separation.

import React from 'react';
import Header from './Header';
import BottomTabBar from './BottomTabBar';

interface MobileShellProps {
  children: React.ReactNode;
}

const MobileShell = ({ children }: MobileShellProps) => {
  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Fixed Header - separated from scrollable content */}
      <Header />
      
      {/* Scrollable Main Content - CRITICAL: Proper scroll boundary */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pb-20">
          {children}
        </div>
      </main>
      
      {/* Fixed Bottom Navigation */}
      <BottomTabBar />
    </div>
  );
};

export default MobileShell;
