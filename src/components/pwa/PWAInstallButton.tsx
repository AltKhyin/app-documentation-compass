
// ABOUTME: Compact PWA install button for header/navigation areas.

import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { usePWAContext } from './PWAProvider';

const PWAInstallButton: React.FC = () => {
  const { isInstallable, isStandalone, showInstallPrompt } = usePWA();
  const { setShowInstallPrompt } = usePWAContext();

  // Don't show if already installed or not installable
  if (isStandalone || !isInstallable) {
    return null;
  }

  const handleClick = async () => {
    try {
      await showInstallPrompt();
    } catch (error) {
      // Fallback to showing our custom prompt
      setShowInstallPrompt(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="relative rounded-full"
      title="Instalar App"
    >
      <Download className="h-5 w-5" />
    </Button>
  );
};

export default PWAInstallButton;
