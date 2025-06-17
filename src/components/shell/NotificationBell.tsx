
// ABOUTME: Displays a bell icon for notifications without count badge.
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotificationBell = () => {
  return (
    <Button variant="ghost" size="icon" className="relative rounded-full">
      <Bell className="h-5 w-5" />
    </Button>
  );
};

export default NotificationBell;
