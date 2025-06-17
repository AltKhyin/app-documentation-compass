
// ABOUTME: Compact PWA install button for header/navigation areas.

import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAContext } from './PWAProvider';

const PWAInstallButton: React.FC = () => {
  const { isInstallable, isStandalone, triggerInstall } = usePWAContext();

  if (isStandalone || !isInstallable) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={triggerInstall}
      className="relative rounded-full"
      title="Instalar App"
    >
      <Download className="h-5 w-5" />
    </Button>
  );
};

export default PWAInstallButton;
