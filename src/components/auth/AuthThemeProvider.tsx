
// ABOUTME: Forces white theme for authentication pages while preserving main app theme
import React, { useEffect } from 'react';

interface AuthThemeProviderProps {
  children: React.ReactNode;
}

const AuthThemeProvider: React.FC<AuthThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    // Force white background for auth pages
    const root = document.documentElement;
    const body = document.body;
    
    // Store original classes
    const originalRootClasses = root.className;
    const originalBodyStyle = body.style.backgroundColor;
    
    // Apply white theme
    root.classList.remove('dark');
    root.classList.add('light');
    body.style.backgroundColor = 'white';
    
    // Cleanup on unmount
    return () => {
      root.className = originalRootClasses;
      body.style.backgroundColor = originalBodyStyle;
    };
  }, []);

  return <div className="min-h-screen bg-white">{children}</div>;
};

export default AuthThemeProvider;
