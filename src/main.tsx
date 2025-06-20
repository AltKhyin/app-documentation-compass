
// ABOUTME: Application entry point with React 18 StrictMode and proper root element mounting.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Ensure root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.');
}

// Create React 18 root with proper error handling
const root = ReactDOM.createRoot(rootElement);

// Render with error boundary wrapper
root.render(<App />);
