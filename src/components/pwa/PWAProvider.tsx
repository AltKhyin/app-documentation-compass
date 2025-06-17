
// ABOUTME: PWA provider for managing installation state, lifecycle, and centralized installation logic.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePWA } from '@/hooks/usePWA';
import PWAInstallPrompt from './PWAInstallPrompt';
import PWAInstructionsModal from './PWAInstructionsModal';

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  canPrompt: boolean;
  triggerInstall: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const usePWAContext = () => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWAContext must be used within a PWAProvider');
  }
  return context;
};

interface PWAProviderProps {
  children: React.ReactNode;
}

const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const { isInstalled, isInstallable, isStandalone, isIOS, canPrompt, showInstallPrompt } = usePWA();
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  useEffect(() => {
    if (isInstallable && !isStandalone) {
      const timer = setTimeout(() => {
        console.log('PWAProvider: Showing install banner.');
        setShowInstallBanner(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isStandalone]);
  
  const triggerInstall = useCallback(async () => {
    console.log('PWAProvider: `triggerInstall` called.');
    
    if (canPrompt) {
      const outcome = await showInstallPrompt();
      if (outcome === 'accepted') {
        console.log('PWAProvider: Native prompt accepted by user.');
        setShowInstallBanner(false);
      } else {
        console.log('PWAProvider: Native prompt dismissed by user.');
      }
    } 
    else if (isInstallable) { 
      console.log('PWAProvider: Native prompt not available. Showing instructions modal as fallback.');
      setShowInstructionsModal(true);
    } 
    else {
      console.log('PWAProvider: App is not installable, doing nothing.');
    }
  }, [canPrompt, isInstallable, showInstallPrompt]);

  const contextValue: PWAContextType = {
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    canPrompt,
    triggerInstall,
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
      {showInstallBanner && (
        <PWAInstallPrompt 
          onDismiss={() => setShowInstallBanner(false)} 
        />
      )}
      <PWAInstructionsModal
        open={showInstructionsModal}
        onOpenChange={setShowInstructionsModal}
      />
    </PWAContext.Provider>
  );
};

export default PWAProvider;
