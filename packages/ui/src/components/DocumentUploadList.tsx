import React from 'react';
import { DocumentRow } from './DocumentRow';

interface DocumentPayload {
  id: string;
  name: string;
  sizeInBytes: number;
}

interface DocumentUploadListProps {
  pendingDocuments: DocumentPayload[];
  onCancelUpload: (id: string) => void;
}

export type { DocumentPayload, DocumentUploadListProps };

/**
 * DocumentUploadList — Dumb Component canónico (especificación
 * MASTER_INIT_PROMPT, Sección 3.1).
 *
 * No conoce el estado de la red ni la lógica de negocio: solo mapea
 * datos a props y reenvía acciones a callbacks.
 */
export const DocumentUploadList: React.FC<DocumentUploadListProps> = ({
  pendingDocuments,
  onCancelUpload
}) => {
  return (
    <div className="DocumentUploadList-container">
      <h2>Documentos pendientes por subir ({pendingDocuments.length})</h2>
      {pendingDocuments.map((doc) => (
        <DocumentRow
          key={doc.id}
          documentId={doc.id}
          title={doc.name}
          status="PENDING_UPLOAD"
          onAction={() => onCancelUpload(doc.id)}
        />
      ))}
    </div>
  );
};