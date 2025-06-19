
// ABOUTME: PWA provider for managing installation state and lifecycle with improved error handling.

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import PWAInstallPrompt from './PWAInstallPrompt';

interface PWAContextType {
  showInstallPrompt: boolean;
  setShowInstallPrompt: (show: boolean) => void;
  isInstalled: boolean;
  isInstallable: boolean;
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
  const { isInstalled, isInstallable, isStandalone } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    // Register service worker with better error handling
    if ('serviceWorker' in navigator && !swRegistered) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered successfully:', registration);
            setSwRegistered(true);
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('New service worker available');
                    // Optionally notify user about update
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.error('SW registration failed:', registrationError);
            // Continue without service worker
          });
      });
    }

    // Show install prompt after a delay if conditions are met
    if (!isInstalled && !isStandalone && isInstallable && !showInstallPrompt) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 15000); // Increased to 15 seconds to avoid being too aggressive

      return () => clearTimeout(timer);
    }
  }, [isInstalled, isStandalone, isInstallable, showInstallPrompt, swRegistered]);

  // Handle beforeinstallprompt event more robustly
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      // The event will be handled by the usePWA hook
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const contextValue: PWAContextType = {
    showInstallPrompt,
    setShowInstallPrompt,
    isInstalled,
    isInstallable,
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
      {showInstallPrompt && !isInstalled && (
        <PWAInstallPrompt 
          onDismiss={() => setShowInstallPrompt(false)} 
        />
      )}
    </PWAContext.Provider>
  );
};

export default PWAProvider;
