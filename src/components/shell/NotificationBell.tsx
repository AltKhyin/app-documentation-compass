
// ABOUTME: Displays notification bell with count badge using independent data fetching.
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationCountQuery } from '../../../packages/hooks/useNotificationCountQuery';

const NotificationBell = () => {
  const { data: notificationCount = 0, isLoading } = useNotificationCountQuery();

  return (
    <Button variant="ghost" size="icon" className="relative rounded-full">
      <Bell className="h-5 w-5" />
      {!isLoading && notificationCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {notificationCount > 99 ? '99+' : notificationCount}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationBell;
