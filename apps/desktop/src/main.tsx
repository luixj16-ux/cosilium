import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('No se encontró el nodo #root. Verifique apps/desktop/index.html.');
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);