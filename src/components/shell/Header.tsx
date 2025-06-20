
// ABOUTME: Main application header with proper height alignment and navigation actions.
import React from 'react';
import NotificationBell from './NotificationBell';
import PWAInstallButton from '../pwa/PWAInstallButton';

const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Spacer div - logo is now in sidebar */}
      <div className="flex-1" />
      
      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <PWAInstallButton />
        <NotificationBell />
      </div>
    </header>
  );
};

export default Header;
