import React from 'react';
import { DocumentUploadList } from '@consilium/ui';
import type { DocumentPayload } from '@consilium/ui';

const DEMO_PENDING: DocumentPayload[] = [
  { id: 'doc_mobile_1', name: 'compartido-camscanner.pdf', sizeInBytes: 358400 },
  { id: 'doc_mobile_2', name: 'foto-camara.jpeg', sizeInBytes: 2516582 }
];

/**
 * App (mobile) — Misma app React ejecutada dentro del WebView de
 * Capacitor. El acceso a cámara y el Share Target (interceptación de
 * CamScanner/Adobe Scan) se configuran vía plugins de Capacitor.
 */
export const App: React.FC = () => {
  const handleCancelUpload = (id: string): void => {
    console.info('Cancelar subida solicitada (mobile):', id);
  };

  return (
    <main>
      <h1>CONSILIUM</h1>
      <DocumentUploadList pendingDocuments={DEMO_PENDING} onCancelUpload={handleCancelUpload} />
    </main>
  );
};