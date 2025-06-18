
// ABOUTME: Forces white theme ONLY for authentication pages without affecting main app theme
import React, { useEffect } from 'react';

interface AuthThemeProviderProps {
  children: React.ReactNode;
}

const AuthThemeProvider: React.FC<AuthThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    // Store original theme state
    const root = document.documentElement;
    const originalClasses = root.className;
    
    // Force light theme for auth pages only
    root.classList.remove('dark');
    root.classList.add('light');
    
    // Cleanup on unmount - restore original theme
    return () => {
      root.className = originalClasses;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {children}
    </div>
  );
};

export default AuthThemeProvider;
