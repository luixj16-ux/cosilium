import { describe, it, expect } from 'vitest';
import { DocumentAggregate } from '../../src/domain/DocumentAggregate';
import { DocumentId } from '../../src/domain/DocumentId';
import { DocumentExtension } from '../../src/domain/DocumentExtension';
import { PageCount } from '../../src/domain/PageCount';
import { FileHash } from '../../src/domain/FileHash';
import { DOCUMENT_STATUS } from '../../src/domain/DocumentStatus';

const SHA256 = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';

function buildDocument(hash?: string, pageCount = 2) {
  return DocumentAggregate.create({
    id: DocumentId.from('doc_test_aggregate'),
    name: 'factura.pdf',
    extension: DocumentExtension.from('pdf'),
    pageCount: PageCount.create(pageCount),
    sizeInBytes: 1024,
    userId: 'usr_123',
    fileHash: hash ? FileHash.fromHex(hash) : null
  });
}

describe('DocumentAggregate (Agregado raíz — invariantes)', () => {
  it('Debe crearse en estado PENDING por defecto', () => {
    expect(buildDocument().status.value).toBe(DOCUMENT_STATUS.PENDING);
  });

  it('Debe encolar para subida (PENDING → PENDING_UPLOAD)', () => {
    const doc = buildDocument();
    doc.queueForUpload();
    expect(doc.status.value).toBe(DOCUMENT_STATUS.PENDING_UPLOAD);
  });

  it('Debe marcar como subido (PENDING_UPLOAD → UPLOADED)', () => {
    const doc = buildDocument();
    doc.queueForUpload();
    doc.markAsUploaded();
    expect(doc.status.value).toBe(DOCUMENT_STATUS.UPLOADED);
  });

  it('Debe marcar como fallido y poder reintentar (FAILED → PENDING_UPLOAD)', () => {
    const doc = buildDocument();
    doc.queueForUpload();
    doc.markAsFailed();
    expect(doc.status.value).toBe(DOCUMENT_STATUS.FAILED);
    doc.retryUpload();
    expect(doc.status.value).toBe(DOCUMENT_STATUS.PENDING_UPLOAD);
  });

  it('Debe PROHIBIR marcar como subido sin haber encolado (invariante de transición)', () => {
    const doc = buildDocument();
    expect(() => doc.markAsUploaded()).toThrow();
  });

  it('Debe rechazar valores inválidos (tamaño negativo)', () => {
    expect(() =>
      DocumentAggregate.create({
        id: DocumentId.from('doc_invalid_size'),
        name: 'x.pdf',
        extension: DocumentExtension.from('pdf'),
        pageCount: PageCount.create(1),
        sizeInBytes: -5,
        userId: 'u'
      })
    ).toThrow();
  });

  it('Debe detectar duplicados por FileHash (deduplicación)', () => {
    const doc = buildDocument(SHA256);
    expect(doc.isDuplicateOf(new Set([SHA256]))).toBe(true);
    expect(doc.isDuplicateOf(new Set(['deadbeef'.padEnd(64, '0')]))).toBe(false);
  });

  it('Debe mantener metadatos inmutables y estado mutable (append-only)', () => {
    const doc = buildDocument(SHA256);
    doc.queueForUpload();
    expect(doc.id.value).toBe('doc_test_aggregate');
    expect(doc.name).toBe('factura.pdf');
    expect(doc.fileHash?.value).toBe(SHA256);
  });
});