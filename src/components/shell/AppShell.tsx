
// ABOUTME: The main application shell controller with enhanced stability and persistence.
import React, { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopShell from './DesktopShell';
import MobileShell from './MobileShell';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  console.log('AppShell render state:', { isMobile });

  // Memoize shell selection to prevent unnecessary re-renders during navigation
  const ShellComponent = useMemo(() => {
    return isMobile ? MobileShell : DesktopShell;
  }, [isMobile]);

  // Shell renders immediately with stable component selection
  // Individual pages handle their own loading states within the shell
  return (
    <ShellComponent>
      {children}
    </ShellComponent>
  );
};

export default AppShell;
