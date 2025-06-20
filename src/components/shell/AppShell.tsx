
// ABOUTME: The main application shell controller with independent rendering.
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopShell from './DesktopShell';
import MobileShell from './MobileShell';
import { Skeleton } from '@/components/ui/skeleton';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  console.log('AppShell render state:', { isMobile });

  // Shell renders immediately - no data dependencies
  // Individual components handle their own loading states
  if (isMobile) {
    return (
      <MobileShell>
        {children}
      </MobileShell>
    );
  }

  return (
    <DesktopShell>
      {children}
    </DesktopShell>
  );
};

export default AppShell;
