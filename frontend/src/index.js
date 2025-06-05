// frontend/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Your global styles, ensure this file exists
import AppWrapper from './App'; // Import AppWrapper which includes BrowserRouter

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  );
} else {
  // This error is critical, means your public/index.html is missing the root div
  console.error('CRITICAL ERROR: Root element with ID "root" not found in the HTML. React application cannot be mounted.');
  // You could display a fallback message to the user on the page itself
  document.body.innerHTML = '<div style="padding: 20px; text-align: center; font-family: sans-serif; color: red;"><h1>Application Mount Error</h1><p>Could not find the root HTML element to launch the application. Please contact support.</p></div>';
}
