
// ABOUTME: Hook for PWA capabilities detection and management.

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAHook {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  showInstallPrompt: () => Promise<'accepted' | 'dismissed' | 'failed'>;
}

export const usePWA = (): PWAHook => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );

  // PWA is installable if we have a prompt event OR if it's iOS and not standalone
  const isInstallable = installPrompt !== null || (isIOS && !isStandalone) || (!isStandalone && 'serviceWorker' in navigator);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('PWA: beforeinstallprompt event captured');
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      console.log('PWA: App installed');
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (isStandalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone]);

  const showInstallPrompt = useCallback(async (): Promise<'accepted' | 'dismissed' | 'failed'> => {
    if (!installPrompt) {
      console.log('PWA: No install prompt available');
      return 'failed';
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`PWA: User choice: ${outcome}`);
      
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
    isInstallable,
    isInstalled,
    isIOS,
    isStandalone,
    showInstallPrompt,
  };
};
