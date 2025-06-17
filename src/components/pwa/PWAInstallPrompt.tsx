
// ABOUTME: PWA installation banner prompt with iOS/Android support and corrected text contrast.

import React from 'react';
import { usePWAContext } from './PWAProvider';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PWAInstallPromptProps {
  onDismiss?: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onDismiss }) => {
  const { triggerInstall } = usePWAContext();

  const handleInstall = () => {
    triggerInstall();
    onDismiss?.();
  };

  const handleDismiss = () => {
    onDismiss?.();
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 border-primary/20 bg-background/95 backdrop-blur-sm md:left-auto md:right-4 md:w-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Instalar App</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-foreground">
          Instale o Reviews no seu dispositivo para uma experiência melhor!
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-foreground">
            Tenha acesso rápido e funcionalidades offline.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Instalar Agora
            </Button>
            <Button variant="outline" onClick={handleDismiss} size="sm">
              Depois
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallPrompt;
