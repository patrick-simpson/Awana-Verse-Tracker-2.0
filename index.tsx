import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Root entry point for the Awana Africa Verse Tracker.
 * Renders the primary App component which implements modular Firebase logic.
 */
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
