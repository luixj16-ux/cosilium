import React from 'react';
import { DocumentUploadList } from '@consilium/ui';
import type { DocumentPayload } from '@consilium/ui';

const DEMO_PENDING: DocumentPayload[] = [
  { id: 'doc_demo_1', name: 'factura-2026-001.pdf', sizeInBytes: 20480 },
  { id: 'doc_demo_2', name: 'escaneo-camscanner.jpeg', sizeInBytes: 1228801 }
];

/**
 * App (capa de presentación) — ORQUESTA la capa de aplicación,
 * nunca el dominio directamente.
 */
export const App: React.FC = () => {
  const handleCancelUpload = (id: string): void => {
    // En producción: dispatch a un caso de uso (ej. CancelUploadUseCase).
    console.info('Cancelar subida solicitada:', id);
  };

  return (
    <main className="App-main">
      <h1 className="App-title">CONSILIUM — Gestión de Expedientes Digital</h1>
      <DocumentUploadList pendingDocuments={DEMO_PENDING} onCancelUpload={handleCancelUpload} />
    </main>
  );
};