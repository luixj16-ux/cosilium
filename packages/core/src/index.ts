/**
 * @consilium/core — Punto de entrada único del Core.
 *
 * El Core es COMPARTIDO (mismo código) entre web, desktop y mobile.
 * Exporta el dominio, la aplicación y los adaptadores de
 * infraestructura; la capa de UI nunca debe usar el dominio directo.
 */

// ── Dominio (Value Objects / Agregado / Puertos) ──────────────────────
export { DocumentId } from './domain/DocumentId';
export { FileHash } from './domain/FileHash';
export { PageCount, MAX_OFFLINE_PAGE_COUNT } from './domain/PageCount';
export {
  DocumentStatus,
  DOCUMENT_STATUS,
  type DocumentStatusValue
} from './domain/DocumentStatus';
export {
  DocumentExtension,
  ALLOWED_EXTENSIONS,
  type DocumentExtensionValue
} from './domain/DocumentExtension';
export { DocumentAggregate, type DocumentAggregateProps } from './domain/DocumentAggregate';

export type { DocumentRepository } from './domain/ports/DocumentRepository';
export type { DocumentHasher } from './domain/ports/DocumentHasher';
export type {
  RemoteDocumentRegistry,
  RemoteExistenceCheckResult
} from './domain/ports/RemoteDocumentRegistry';
export type {
  ObjectStorageUploader,
  PresignedUploadRequest,
  PresignedUploadResult
} from './domain/ports/ObjectStorageUploader';

// ── Aplicación (Use Cases / Orquestadores) ────────────────────────────
export {
  QueueDocumentForUploadUseCase,
  type IngestionFile,
  type QueueDocumentCommand
} from './application/QueueDocumentForUploadUseCase';
export {
  VerifyRemoteExistenceUseCase,
  type ExistingHashesResult
} from './application/VerifyRemoteExistenceUseCase';
export {
  SynchronizePendingDocumentsUseCase,
  type SynchronizationSummary
} from './application/SynchronizePendingDocumentsUseCase';

// ── Infraestructura (Adapters) ────────────────────────────────────────
export { WebCryptoDocumentHasher, bytesToHex } from './infrastructure/WebCryptoDocumentHasher';
export { RxDBDocumentRepository } from './infrastructure/RxDBDocumentRepository';
export type { OutboxCollection, OutboxRecord } from './infrastructure/rxdb/OutboxCollectionSpec';