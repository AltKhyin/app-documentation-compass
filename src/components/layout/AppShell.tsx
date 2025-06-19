
// ABOUTME: Main application shell component with responsive navigation

import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import DesktopShell from '../shell/DesktopShell';
import MobileShell from '../shell/MobileShell';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileShell>{children}</MobileShell>
  ) : (
    <DesktopShell>{children}</DesktopShell>
  );
};
