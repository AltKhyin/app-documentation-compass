
// ABOUTME: Hook for PWA capabilities detection and management.

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAHook {
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  canPrompt: boolean;
  showInstallPrompt: () => Promise<'accepted' | 'dismissed' | 'failed'>;
}

// A more robust check for whether the app is running in a browser context
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const usePWA = (): PWAHook => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const isIOS = isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  const isStandalone = isBrowser && (
    window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );

  const canPrompt = installPrompt !== null;

  useEffect(() => {
    if (!isBrowser) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('PWA: `beforeinstallprompt` event captured.');
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      console.log('PWA: `appinstalled` event fired. App is installed.');
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (isStandalone) {
      setIsInstalled(true);
    }

    console.log('PWA Hook Initial State:', { isIOS, isStandalone, canPrompt: !!installPrompt });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone, isIOS]);

  const showInstallPrompt = useCallback(async (): Promise<'accepted' | 'dismissed' | 'failed'> => {
    if (!installPrompt) {
      console.error('PWA: showInstallPrompt called but no prompt event is available.');
      return 'failed';
    }

    try {
      console.log('PWA: Showing native browser install prompt.');
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`PWA: User choice was: ${outcome}`);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setInstallPrompt(null);
      return outcome;
    } catch (error) {
      console.error('PWA: Error showing install prompt:', error);
      setInstallPrompt(null);
      return 'failed';
    }
  }, [installPrompt]);

  return {
    isInstalled,
    isStandalone,
    isIOS,
    canPrompt,
    showInstallPrompt,
  };
};
