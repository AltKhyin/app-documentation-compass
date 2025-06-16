// ABOUTME: The main application shell controller.
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppData } from '@/contexts/AppDataContext';
import DesktopShell from './DesktopShell';
import MobileShell from './MobileShell';
import { Skeleton } from '@/components/ui/skeleton';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const { isLoading: isAppDataLoading } = useAppData();

  // --- Data-Ready Guard ---
  // This is the critical fix. We will show a full-page skeleton
  // loader while the initial consolidated data from AppDataContext is being fetched.
  // This prevents any child components from rendering prematurely and attempting
  // to access data that isn't ready, which was causing the race condition and
  // triggering the old, multiple API calls as a fallback.
  if (isAppDataLoading) {
    return (
        <div className="flex h-screen w-full">
            {/* Sidebar Skeleton for Desktop */}
            <div className="hidden md:flex flex-col w-60 border-r p-4 space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <div className="mt-auto">
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
            {/* Main Content Skeleton */}
            <div className="flex-1 p-6 space-y-6">
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <Skeleton className="w-full h-96" />
                <Skeleton className="h-8 w-64" />
                <div className="flex gap-4">
                    <Skeleton className="w-64 h-48" />
                    <Skeleton className="w-64 h-48" />
                    <Skeleton className="w-64 h-48" />
                </div>
            </div>
        </div>
    );
  }

  // Once the data is ready, render the appropriate shell.
  if (isMobile) {
    return <MobileShell>{children}</MobileShell>;
  }

  return <DesktopShell>{children}</DesktopShell>;
};

export default AppShell;
