
// ABOUTME: User profile display component with auth integration - Updated for emergency stabilization.

import React from 'react';
import { User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/SimpleAuthProvider';

const UserProfileBlock = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 p-3 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-3">
        <Button variant="ghost" size="sm" className="w-full">
          <User className="w-4 h-4 mr-2" />
          Fazer Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 p-3 border-b">
      <Avatar className="w-10 h-10">
        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email || ''} />
        <AvatarFallback>
          {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {user.user_metadata?.full_name || 'Usuário'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {user.email}
        </p>
      </div>
      <Button variant="ghost" size="sm">
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default UserProfileBlock;
