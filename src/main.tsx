
// ABOUTME: Application entry point with React 18 StrictMode and emergency stabilization error handling.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('main.tsx: Emergency stabilization mode - starting application with React:', React.version);

// Enhanced error logging for debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Ensure root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.');
}

// Create React 18 root with emergency error handling
const root = ReactDOM.createRoot(rootElement);

// Render with emergency stabilization
try {
  console.log('main.tsx: Rendering App component in emergency stabilization mode...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('main.tsx: App rendered successfully in emergency mode');
} catch (error) {
  console.error('Failed to render React app:', error);
  
  // Emergency fallback rendering
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="text-align: center; max-width: 500px;">
        <h1 style="color: #dc2626; margin-bottom: 16px;">Erro Crítico na Aplicação</h1>
        <p style="color: #6b7280; margin-bottom: 20px;">
          Ocorreu um erro crítico ao carregar a aplicação. Sistema de recuperação ativado.
        </p>
        <button 
          onclick="window.location.reload()" 
          style="background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;"
        >
          Recarregar Página
        </button>
      </div>
    </div>
  `;
}
