
// ABOUTME: The top header for the mobile application shell.
import React from 'react';
import NotificationBell from './NotificationBell';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4">
       <h1 className="font-serif font-medium tracking-tight text-2xl text-foreground flex items-center">
        Reviews.
      </h1>
      <NotificationBell />
    </header>
  );
};

export default Header;
