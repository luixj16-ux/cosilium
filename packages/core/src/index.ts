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

// ── Portal Judicial — Dominio ─────────────────────────────────────────
export {
  UserRole,
  USER_ROLES,
  type UserRoleValue
} from './domain/UserRole';
export {
  CaseStatus,
  CASE_STATUSES,
  type CaseStatusValue
} from './domain/CaseStatus';
export { PageRange } from './domain/PageRange';
export { DocketNumber } from './domain/DocketNumber';
export { Username } from './domain/Username';
export { Email } from './domain/Email';
export { Password } from './domain/Password';
export { User } from './domain/User';
export { Court } from './domain/Court';
export { LegalCase, type LegalCaseProps } from './domain/LegalCase';
export { CaseActivity, type CaseActivityProps } from './domain/CaseActivity';
export { Session } from './domain/Session';
export { SearchRecord, type SearchRecordProps } from './domain/SearchRecord';
export { AuditEvent, type AuditEventProps } from './domain/AuditEvent';
export type { LegalLawItem, LegalLawCategory } from './domain/LegalLaw';
export type { LegalNewsItem } from './domain/LegalNews';

export type { UserRepository } from './domain/ports/UserRepository';
export type { PasswordHasher } from './domain/ports/PasswordHasher';
export type { SessionRepository } from './domain/ports/SessionRepository';
export type { SessionTokenGenerator } from './domain/ports/SessionTokenGenerator';
export type { CourtRepository } from './domain/ports/CourtRepository';
export type { CaseRepository } from './domain/ports/CaseRepository';
export type { SearchRecordRepository } from './domain/ports/SearchRecordRepository';
export type { AuditLog } from './domain/ports/AuditLog';

// ── Portal Judicial — Catálogos ───────────────────────────────────────
export { VENEZUELAN_LAWS } from './domain/catalogs/laws';
export { LEGAL_NEWS } from './domain/catalogs/news';

// ── Portal Judicial — Application Errors ──────────────────────────────
export {
  InvalidCredentialsError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  AlreadyExistsError
} from './application/errors';

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

// ── Portal Judicial — Aplicación (Use Cases) ──────────────────────────
export { RegisterUserUseCase, type RegisterUserInput, type AuthResult } from './application/RegisterUserUseCase';
export { LoginUserUseCase, type LoginUserInput } from './application/LoginUserUseCase';
export { LogoutUserUseCase } from './application/LogoutUserUseCase';
export { GetCurrentSessionUseCase } from './application/GetCurrentSessionUseCase';
export {
  SetUpAdminPasswordUseCase,
  type SetupAdminPasswordInput
} from './application/SetUpAdminPasswordUseCase';
export { PromoteUserUseCase, type PromoteUserInput } from './application/PromoteUserUseCase';
export { ListUsersUseCase, type ListUsersInput } from './application/ListUsersUseCase';
export { ListCourtsUseCase } from './application/ListCourtsUseCase';
export {
  ListCourtCasesUseCase,
  type ListCourtCasesInput
} from './application/ListCourtCasesUseCase';
export {
  GetCaseDetailUseCase,
  type GetCaseDetailInput
} from './application/GetCaseDetailUseCase';
export {
  CreateCaseUseCase,
  type CreateCaseInput
} from './application/CreateCaseUseCase';
export {
  AddCaseActuationUseCase,
  type AddCaseActuationInput
} from './application/AddCaseActuationUseCase';
export { DeleteCaseUseCase, type DeleteCaseInput } from './application/DeleteCaseUseCase';
export {
  SaveSearchRecordUseCase,
  type SaveSearchRecordInput
} from './application/SaveSearchRecordUseCase';
export { ListLegalLawsUseCase } from './application/ListLegalLawsUseCase';
export { ListLegalNewsUseCase } from './application/ListLegalNewsUseCase';

// ── Infraestructura (Adapters) ────────────────────────────────────────
export { WebCryptoDocumentHasher, bytesToHex } from './infrastructure/WebCryptoDocumentHasher';
export { RxDBDocumentRepository } from './infrastructure/RxDBDocumentRepository';
export type { OutboxCollection, OutboxRecord } from './infrastructure/rxdb/OutboxCollectionSpec';

// ── Portal Judicial — Infraestructura (Adapters) ──────────────────────
export { InMemoryUserRepository } from './infrastructure/InMemoryUserRepository';
export { InMemorySessionRepository } from './infrastructure/InMemorySessionRepository';
export { InMemoryCourtRepository } from './infrastructure/InMemoryCourtRepository';
export { InMemoryCaseRepository } from './infrastructure/InMemoryCaseRepository';
export { InMemorySearchRecordRepository } from './infrastructure/InMemorySearchRecordRepository';
export { InMemoryAuditLog } from './infrastructure/InMemoryAuditLog';
export { InMemoryPasswordHasher } from './infrastructure/InMemoryPasswordHasher';
export { CryptoRandomTokenGenerator } from './infrastructure/CryptoRandomTokenGenerator';
export { buildPortalInMemoryDependencies, type PortalInMemoryDependencies } from './infrastructure/seed/index';
export { createPortalUseCases, type PortalUseCases } from './infrastructure/useCases';
export { SEED_COURTS_DATA, buildSeedCourts } from './infrastructure/seed/courts';
export { buildSeedCases } from './infrastructure/seed/cases';