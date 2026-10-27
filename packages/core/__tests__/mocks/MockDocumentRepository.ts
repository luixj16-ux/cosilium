/**
 * MockDocumentRepository — Fake en-memoria del puerto DocumentRepository.
 *
 * Simula la persistencia local (RxDB/SQLite) SIN red: permite probar
 * el comportamiento offline del Core en pruebas unitarias.
 */
import type { DocumentRepository } from '../../src/domain/ports/DocumentRepository';
import type { DocumentId } from '../../src/domain/DocumentId';
import type { DocumentAggregate } from '../../src/domain/DocumentAggregate';

export class MockDocumentRepository implements DocumentRepository {
  private readonly documents: DocumentAggregate[] = [];

  async save(document: DocumentAggregate): Promise<void> {
    const index = this.documents.findIndex((doc) => doc.id.equals(document.id));
    if (index >= 0) {
      this.documents[index] = document;
    } else {
      this.documents.push(document);
    }
  }

  async findById(id: DocumentId): Promise<DocumentAggregate | null> {
    return this.documents.find((doc) => doc.id.equals(id)) ?? null;
  }

  async findPendingUploads(): Promise<DocumentAggregate[]> {
    return this.documents.filter((doc) => doc.status.value === 'PENDING_UPLOAD');
  }

  async listAll(): Promise<DocumentAggregate[]> {
    return [...this.documents];
  }

  async getPendingUploads(): Promise<DocumentAggregate[]> {
    return this.findPendingUploads();
  }
}