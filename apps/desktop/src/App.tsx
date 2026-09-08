import React from 'react';
import { DocumentUploadList } from '@consilium/ui';
import type { DocumentPayload } from '@consilium/ui';

const DEMO_PENDING: DocumentPayload[] = [
  { id: 'doc_desktop_1', name: 'expediente-digital.pdf', sizeInBytes: 819200 },
  { id: 'doc_desktop_2', name: 'escaneo-carpeta-ingesta.png', sizeInBytes: 4456448 }
];

/**
 * App (escritorio) — Consume la capa de aplicación (mismo core).
 * El manejo nativo de archivos masivos en disco se hace vía Tauri
 * (ver rust/tauri-native y apps/desktop/src-tauri).
 */
export const App: React.FC = () => {
  const handleCancelUpload = (id: string): void => {
    console.info('Cancelar subida solicitada (desktop):', id);
  };

  return (
    <main>
      <h1>CONSILIUM Desktop</h1>
      <DocumentUploadList pendingDocuments={DEMO_PENDING} onCancelUpload={handleCancelUpload} />
    </main>
  );
};