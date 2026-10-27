import { describe, it, expect } from 'vitest';
import { DocumentStatus, DOCUMENT_STATUS } from '../../src/domain/DocumentStatus';

describe('DocumentStatus (Value Object — protocolo outbox)', () => {
  it('Debe modelar los estados del outbox', () => {
    expect(DocumentStatus.PENDING.value).toBe(DOCUMENT_STATUS.PENDING);
    expect(DocumentStatus.PENDING_UPLOAD.value).toBe(DOCUMENT_STATUS.PENDING_UPLOAD);
    expect(DocumentStatus.UPLOADED.value).toBe(DOCUMENT_STATUS.UPLOADED);
    expect(DocumentStatus.FAILED.value).toBe(DOCUMENT_STATUS.FAILED);
  });

  it('Debe permitir PENDING → PENDING_UPLOAD', () => {
    expect(DocumentStatus.PENDING.canTransitionTo(DocumentStatus.PENDING_UPLOAD)).toBe(true);
  });

  it('Debe permitir PENDING_UPLOAD → UPLOADED | FAILED', () => {
    expect(DocumentStatus.PENDING_UPLOAD.canTransitionTo(DocumentStatus.UPLOADED)).toBe(true);
    expect(DocumentStatus.PENDING_UPLOAD.canTransitionTo(DocumentStatus.FAILED)).toBe(true);
  });

  it('Debe permitir retry FAILED → PENDING_UPLOAD', () => {
    expect(DocumentStatus.FAILED.canTransitionTo(DocumentStatus.PENDING_UPLOAD)).toBe(true);
  });

  it('Debe prohibir mutaciones ilegales (append-only)', () => {
    expect(DocumentStatus.UPLOADED.canTransitionTo(DocumentStatus.PENDING)).toBe(false);
    expect(DocumentStatus.UPLOADED.canTransitionTo(DocumentStatus.PENDING_UPLOAD)).toBe(false);
    expect(DocumentStatus.PENDING.canTransitionTo(DocumentStatus.UPLOADED)).toBe(false);
  });

  it('Debe reconstruirse desde cadena y rechazar desconocidas', () => {
    expect(DocumentStatus.from('UPLOADED').equals(DocumentStatus.UPLOADED)).toBe(true);
    expect(() => DocumentStatus.from('BOGUS')).toThrow();
  });
});