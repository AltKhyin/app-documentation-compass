
// ABOUTME: The main application shell controller.
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopShell from './DesktopShell';
import MobileShell from './MobileShell';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileShell>{children}</MobileShell>;
  }

  return <DesktopShell>{children}</DesktopShell>;
};

export default AppShell;
