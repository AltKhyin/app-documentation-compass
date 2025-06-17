
// ABOUTME: Mobile header with logo, notifications and PWA install button.
import React from 'react';
import NotificationBell from './NotificationBell';
import PWAInstallButton from '../pwa/PWAInstallButton';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-background">
      <div className="flex-1" />
      
      {/* Centered Logo */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-foreground">Reviews</h1>
      </div>
      
      {/* Right side actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <PWAInstallButton />
        <NotificationBell />
      </div>
    </header>
  );
};

export default Header;
