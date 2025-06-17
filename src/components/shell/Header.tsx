
// ABOUTME: Mobile header with logo, notifications and PWA install button.
import React from 'react';
import NotificationBell from './NotificationBell';
import PWAInstallButton from '../pwa/PWAInstallButton';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-background">
      {/* Left-aligned Logo with same styling as desktop sidebar */}
      <div className="flex items-center">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">Reviews</h1>
      </div>
      
      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <PWAInstallButton />
        <NotificationBell />
      </div>
    </header>
  );
};

export default Header;
