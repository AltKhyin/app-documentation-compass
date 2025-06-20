
// ABOUTME: Error boundary specifically for shell components to handle Router context errors.

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/ui/error-fallback';

interface ShellErrorBoundaryProps {
  children: React.ReactNode;
}

const ShellErrorBoundary = ({ children }: ShellErrorBoundaryProps) => {
  const handleError = (error: Error, errorInfo: any) => {
    console.error('Shell Error Boundary caught an error:', error, errorInfo);
    
    // Check if it's a Router context error
    if (error.message.includes('useContext') || error.message.includes('Router')) {
      console.error('Router context error detected in shell components');
    }
  };

  const handleReset = () => {
    // Force a page reload to re-establish Router context
    window.location.reload();
  };

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback
          {...props}
          context="shell do aplicativo"
          showDetails={true}
          showHomeButton={true}
          showBackButton={false}
        />
      )}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ShellErrorBoundary;
