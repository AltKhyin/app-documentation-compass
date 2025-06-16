
// ABOUTME: Displays user avatar/name, with loading state and logout action using consolidated data.
import React from 'react';
import { LogOut } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type UserProfileBlockProps = {
  isCollapsed?: boolean;
};

const UserProfileBlock = ({ isCollapsed = false }: UserProfileBlockProps) => {
  const { userProfile, isLoading } = useAppData();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    queryClient.clear(); // Clears all query cache on logout
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center p-2' : 'p-3'}`}>
        <Skeleton className="h-9 w-9 rounded-full" />
        {!isCollapsed && <Skeleton className="h-4 w-24" />}
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="mt-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={`w-full h-auto ${isCollapsed ? 'justify-center p-2' : 'justify-start gap-3 p-2'}`}
          >
             <Avatar className="h-9 w-9">
              <AvatarImage src={userProfile?.avatar_url ?? undefined} alt={userProfile?.full_name ?? 'User'} />
              <AvatarFallback>
                {userProfile?.full_name ? getInitials(userProfile.full_name) : 'U'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold truncate">
                  {userProfile?.full_name ?? 'Usuário'}
                </span>
                 <span className="text-xs text-muted-foreground -mt-1">
                  {userProfile?.role ?? 'practitioner'}
                </span>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userProfile?.full_name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userProfile?.subscription_tier} tier
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileBlock;
