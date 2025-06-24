
// ABOUTME: Main application component with hierarchical error boundary protection - Emergency stabilization mode

import React from 'react';
import { AppRouter } from './router/AppRouter';
import { AppProviders } from './components/providers/AppProviders';
import { SimpleAuthProvider } from './components/auth/SimpleAuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function App() {
  console.log('App: Emergency stabilization mode - simplified provider chain');
  
  return (
    <AppProviders>
      <SimpleAuthProvider>
        {/* Tier 1: Root Error Boundary - Ultimate safety net for entire application */}
        <ErrorBoundary 
          tier="root"
          context="aplicação completa"
          showDetails={process.env.NODE_ENV === 'development'}
          showHomeButton={false}
          showBackButton={false}
        >
          <AppRouter />
        </ErrorBoundary>
      </SimpleAuthProvider>
    </AppProviders>
  );
}

export default App;
