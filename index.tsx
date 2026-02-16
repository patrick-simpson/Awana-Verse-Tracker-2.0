import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // If we reach here, clear any panic state (it might have flickered)
    const panic = document.getElementById('panic-message');
    if (panic) panic.style.display = 'none';
    
  } catch (error) {
    console.error("Critical Render Error:", error);
    const details = document.getElementById('panic-details');
    if (details) details.innerText = "React Render Failure: " + (error instanceof Error ? error.message : String(error));
    const panic = document.getElementById('panic-message');
    if (panic) panic.style.display = 'flex';
  }
}