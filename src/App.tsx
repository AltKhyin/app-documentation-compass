
// ABOUTME: Main application component with hierarchical error boundary protection

import React from 'react';
import { AppRouter } from './router/AppRouter';
import { AppProviders } from './components/providers/AppProviders';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <AppProviders>
      {/* Tier 1: Root Error Boundary - Ultimate safety net for entire application */}
      <ErrorBoundary 
        tier="root"
        context="aplicação"
        showDetails={true}
        showHomeButton={false}
        showBackButton={false}
      >
        <AppRouter />
      </ErrorBoundary>
    </AppProviders>
  );
}

export default App;
