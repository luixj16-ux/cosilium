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

// ── Portal judicial: Tribunal, Expediente y Actuación ──────────────────
export type CourtDto = {
  id: string;
  name: string;
  description: string;
  category: string;
  jurisdiction: string | null;
};

export type CaseActivityDto = {
  activityDate: string;
  activityType: string;
  summary: string;
  signedBy: string;
  pageRange: string | null;
};

export type LegalCaseDto = {
  publicId: string;
  courtId: string;
  docketNumber: string;
  title: string;
  subject: string;
  plaintiff: string;
  defendant: string;
  attorney: string | null;
  amount: number;
  status: string;
  pages: number;
  filedAt: string | null;
  lastActivityAt: string | null;
  actuations: CaseActivityDto[];
};

// ── Portal judicial: Usuario y sesión ──────────────────────────────────
export type UserDto = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: 'public' | 'admin';
  inpre: string | null;
  active: boolean;
  createdAt: string;
};

export type SessionResultDto = {
  user: UserDto;
  token: string;
};

export type CurrentSessionDto = {
  authenticated: boolean;
  user: UserDto | null;
};

export type RegisterInputDto = {
  username: string;
  fullName: string;
  email: string;
  password: string;
  inpre?: string | null;
};

export type LoginInputDto = {
  identifier: string;
  password: string;
};

export type CreateCaseInputDto = {
  courtId: string;
  title: string;
  subject: string;
  plaintiff: string;
  defendant: string;
  attorney?: string | null;
  amount?: number;
};

export type AddCaseActuationInputDto = {
  publicId: string;
  activityType: string;
  summary: string;
  signedBy: string;
};

export type SetupAdminInputDto = {
  username: string;
  password: string;
};

export type SearchRecordInputDto = {
  query: string;
  courtId?: string | null;
  resultCount?: number;
};

// ── Portal judicial: catálogos (leyes y noticias) ──────────────────────
export type LawItemDto = {
  title: string;
  meta: string;
};

export type LawCategoryDto = {
  key: string;
  label: string;
  items: LawItemDto[];
};

export type LegalNewsDto = {
  tag: string;
  title: string;
  summary: string;
  date: string;
  impact: string;
};