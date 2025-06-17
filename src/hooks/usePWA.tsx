
// ABOUTME: Hook for PWA capabilities detection and management.

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAHook {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  showInstallPrompt: () => Promise<void>;
  dismissInstallPrompt: () => void;
}

export const usePWA = (): PWAHook => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Detect if device is iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Detect if app is running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone || 
                      document.referrer.includes('android-app://');

  // More aggressive installability detection
  const isInstallable = installPrompt !== null || (isIOS && !isStandalone) || (!isStandalone && !isInstalled);

  useEffect(() => {
    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('beforeinstallprompt event fired');
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA installed');
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if app is already installed
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Debug logging
    console.log('PWA Hook initialized:', {
      isIOS,
      isStandalone,
      userAgent: navigator.userAgent
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone, isIOS]);

  const showInstallPrompt = async () => {
    if (!installPrompt) {
      throw new Error('No install prompt available');
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setInstallPrompt(null);
    } catch (error) {
      console.error('Error showing install prompt:', error);
      throw error;
    }
  };

  const dismissInstallPrompt = () => {
    setInstallPrompt(null);
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    isStandalone,
    installPrompt,
    showInstallPrompt,
    dismissInstallPrompt,
  };
};
