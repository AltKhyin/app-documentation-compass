
// ABOUTME: Renders the single-column layout for mobile viewports.
import React from 'react';
import Header from './Header';
import BottomTabBar from './BottomTabBar';

const MobileShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 mobile-content py-4 pb-20">{children}</main>
      <BottomTabBar />
    </div>
  );
};

export default MobileShell;
