/**
 * DocumentStatus — Value Object (enum cerrado).
 *
 * Estados del ciclo de vida de un documento en la cola de mutaciones
 * (Outbox Pattern, ver `.agents/rules/sync-architecture.md`).
 *
 * Capa de dominio: código TypeScript puro, sin dependencias externas.
 */
export const DOCUMENT_STATUS = {
  PENDING: 'PENDING',
  PENDING_UPLOAD: 'PENDING_UPLOAD',
  UPLOADED: 'UPLOADED',
  FAILED: 'FAILED'
} as const;

export type DocumentStatusValue = (typeof DOCUMENT_STATUS)[keyof typeof DOCUMENT_STATUS];

export class DocumentStatus {
  private constructor(public readonly value: DocumentStatusValue) {}

  static readonly PENDING = new DocumentStatus(DOCUMENT_STATUS.PENDING);
  static readonly PENDING_UPLOAD = new DocumentStatus(DOCUMENT_STATUS.PENDING_UPLOAD);
  static readonly UPLOADED = new DocumentStatus(DOCUMENT_STATUS.UPLOADED);
  static readonly FAILED = new DocumentStatus(DOCUMENT_STATUS.FAILED);

  static from(value: string): DocumentStatus {
    switch (value) {
      case DOCUMENT_STATUS.PENDING:
        return DocumentStatus.PENDING;
      case DOCUMENT_STATUS.PENDING_UPLOAD:
        return DocumentStatus.PENDING_UPLOAD;
      case DOCUMENT_STATUS.UPLOADED:
        return DocumentStatus.UPLOADED;
      case DOCUMENT_STATUS.FAILED:
        return DocumentStatus.FAILED;
      default:
        throw new Error(`DocumentStatus inválido: "${value}".`);
    }
  }

  /** Matriz de transiciones válidas del protocolo append-only. */
  canTransitionTo(next: DocumentStatus): boolean {
    switch (this.value) {
      case DOCUMENT_STATUS.PENDING:
        return next.value === DOCUMENT_STATUS.PENDING_UPLOAD;
      case DOCUMENT_STATUS.PENDING_UPLOAD:
        return (
          next.value === DOCUMENT_STATUS.UPLOADED ||
          next.value === DOCUMENT_STATUS.FAILED ||
          next.value === DOCUMENT_STATUS.PENDING_UPLOAD
        );
      case DOCUMENT_STATUS.UPLOADED:
        return false;
      case DOCUMENT_STATUS.FAILED:
        return next.value === DOCUMENT_STATUS.PENDING_UPLOAD;
      default:
        return false;
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: DocumentStatus): boolean {
    return this.value === other.value;
  }
}