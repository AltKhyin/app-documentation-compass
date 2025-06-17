
// ABOUTME: Displays a bell icon for notifications with PWA install notification and red dot indicator.
import React, { useState } from 'react';
import { Bell, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePWAContext } from '../pwa/PWAProvider';

const NotificationBell = () => {
  const { isInstallable, isStandalone, triggerInstall } = usePWAContext();
  const [dismissed, setDismissed] = useState(false);

  const hasNotification = isInstallable && !isStandalone && !dismissed;

  const handleInstallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerInstall();
    setDismissed(true);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {hasNotification && (
            <div className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-3">Notificações</h3>
          
          {hasNotification ? (
            <div className="bg-muted/50 rounded-lg p-3 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={handleDismiss}
              >
                <X className="h-3 w-3" />
              </Button>
              
              <div className="flex items-start gap-3 pr-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Instalar o App Reviews</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Acesso rápido, offline e notificações.
                  </p>
                  <Button 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={handleInstallClick}
                  >
                    Instalar App
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma notificação nova
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
