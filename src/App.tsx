
// ABOUTME: Main application component with hierarchical error boundary protection - Root tier (Tier 1)

import * as React from 'react';
import { AppRouter } from './router/AppRouter';
import { AppProviders } from './components/providers/AppProviders';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function App() {
  console.log('App: Rendering with React:', typeof React, !!React.useEffect);
  
  return (
    <AppProviders>
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
    </AppProviders>
  );
}

export default App;
