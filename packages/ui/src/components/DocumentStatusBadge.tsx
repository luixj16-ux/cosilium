import React from 'react';

export interface DocumentStatusBadgeProps {
  status: 'PENDING' | 'PENDING_UPLOAD' | 'UPLOADED' | 'FAILED';
}

const LABELS: Record<DocumentStatusBadgeProps['status'], string> = {
  PENDING: 'Pendiente',
  PENDING_UPLOAD: 'Por subir',
  UPLOADED: 'Subido',
  FAILED: 'Fallido'
};

/**
 * DocumentStatusBadge — Dumb Component. Presenta un estado como badge.
 */
export const DocumentStatusBadge: React.FC<DocumentStatusBadgeProps> = ({ status }) => {
  return (
    <span className="DocumentStatusBadge" data-status={status}>
      {LABELS[status]}
    </span>
  );
};