/**
 * Contratos del dominio agnósticos al transporte.
 *
 * NOTA sobre n8n diferido: estos contratos son neutrales (JSON puro)
 * para que los futuros puntos de integración n8n (notificaciones,
 * reportes, ingestas) puedan consumirlos sin acoplarse al transporte
 * (ver `.agents/n8n-future/FUTURE_README.md`).
 */

// ── Tipos del documento (compartidos con @consilium/core) ─────────────
export type DocumentStatusValue =
  | 'PENDING'
  | 'PENDING_UPLOAD'
  | 'UPLOADED'
  | 'FAILED';

export type DocumentExtensionValue = 'PDF' | 'JPEG' | 'PNG';

export interface DocumentPayload {
  id: string;
  name: string;
  extension: DocumentExtensionValue;
  pageCount: number;
  sizeInBytes: number;
  fileHash: string | null;
  status: DocumentStatusValue;
  userId: string;
  createdAt: string;
}

export interface UploadResult {
  uploaded: boolean;
  duplicated: boolean;
  storageKey: string | null;
}

export interface ExistenceVerificationResult {
  existingHashes: string[];
}

// ── DTOs de entrada de la capa de aplicación ──────────────────────────
export interface QueueDocumentDto {
  file: {
    name: string;
    size: number;
    mimeType: string;
  };
  userId: string;
  pageCount?: number;
}

export interface SyncResultDto {
  processed: number;
  uploaded: number;
  duplicated: number;
  failed: number;
}