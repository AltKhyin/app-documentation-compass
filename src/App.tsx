
// ABOUTME: Main application entry point with clean provider composition and routing.

import { Toaster } from './components/ui/sonner';
import { AppRouter } from './router/AppRouter';
import { AppProviders } from './components/providers/AppProviders';
import './App.css';

function App() {
  return (
    <AppProviders>
      <AppRouter />
      <Toaster position="top-right" />
    </AppProviders>
  );
}

export default App;
