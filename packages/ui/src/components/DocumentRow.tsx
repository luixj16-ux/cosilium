import React from 'react';

export interface DocumentRowProps {
  title: string;
  status: 'PENDING_UPLOAD' | 'UPLOADED' | 'FAILED';
  /** Callback de acción; el componente NO decide qué hacer, solo notifica. */
  onAction?: (id: string) => void;
  documentId?: string;
}

/**
 * DocumentRow — Dumb Component.
 *
 * Puro y ciego al estado de red: recibe `title`, `status` y opcional
 * `onAction`, y notifica el id vía callback. No sabe de fetching, ni
 * de casos de uso, ni de la conectividad.
 *
 * PascalCase (convención obligatoria para componentes React).
 */
export const DocumentRow: React.FC<DocumentRowProps> = ({
  title,
  status,
  onAction,
  documentId
}) => {
  return (
    <div className="DocumentRow-container" data-status={status}>
      <span className="DocumentRow-title">{title}</span>
      <span className="DocumentRow-status">{status}</span>
      {onAction && documentId ? (
        <button type="button" className="DocumentRow-action" onClick={() => onAction(documentId!)}>
          Acción
        </button>
      ) : null}
    </div>
  );
};