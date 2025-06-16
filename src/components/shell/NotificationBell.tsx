
// ABOUTME: Displays a bell icon with a badge for unread notifications using consolidated data.
import React from 'react';
import { Bell } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { Button } from '@/components/ui/button';

const NotificationBell = () => {
  const { notificationCount, isLoading } = useAppData();

  return (
    <Button variant="ghost" size="icon" className="relative rounded-full">
      <Bell className="h-5 w-5" />
      {!isLoading && notificationCount && notificationCount > 0 && (
        <span className="absolute top-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
    </Button>
  );
};

export default NotificationBell;
