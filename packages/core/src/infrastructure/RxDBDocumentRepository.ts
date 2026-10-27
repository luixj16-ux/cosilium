/**
 * RxDBDocumentRepository — Adapter del puerto DocumentRepository.
 *
 * Implementa el puerto de dominio sobre la colección `document_outbox`
 * (RxDB/IndexedDB en navegador, SQLite en móvil). Mapea agregados de
 * dominio ↔ registros planos del outbox. NO contiene reglas de negocio:
 * solo persistencia.
 *
 * Capa de infraestructura: implementa puertos.
 */
import type { DocumentRepository } from '../domain/ports/DocumentRepository';
import { DocumentId } from '../domain/DocumentId';
import { DocumentAggregate } from '../domain/DocumentAggregate';
import { DocumentExtension } from '../domain/DocumentExtension';
import { PageCount } from '../domain/PageCount';
import { FileHash } from '../domain/FileHash';
import { DocumentStatus } from '../domain/DocumentStatus';
import type { OutboxCollection, OutboxRecord } from './rxdb/OutboxCollectionSpec';

export class RxDBDocumentRepository implements DocumentRepository {
  constructor(private readonly collection: OutboxCollection) {}

  async save(document: DocumentAggregate): Promise<void> {
    const record: OutboxRecord = this.toRecord(document);
    const existing = await this.collection.findById(record.id);
    if (existing) {
      await this.collection.updateStatus(record.id, record.status);
      return;
    }
    await this.collection.insert(record);
  }

  async findById(id: DocumentId): Promise<DocumentAggregate | null> {
    const record = await this.collection.findById(id.value);
    return record ? this.fromRecord(record) : null;
  }

  async findPendingUploads(): Promise<DocumentAggregate[]> {
    const records = await this.collection.findPendingUploads();
    return records.map((r) => this.fromRecord(r));
  }

  async listAll(): Promise<DocumentAggregate[]> {
    const records = await this.collection.all();
    return records.map((r) => this.fromRecord(r));
  }

  private toRecord(document: DocumentAggregate): OutboxRecord {
    return {
      id: document.id.value,
      name: document.name,
      extension: document.extension.value,
      pageCount: document.pageCount.value,
      sizeInBytes: document.sizeInBytes,
      userId: document.userId,
      fileHash: document.fileHash?.value ?? null,
      status: document.status.value,
      createdAt: document.createdAt.getTime()
    };
  }

  private fromRecord(record: OutboxRecord): DocumentAggregate {
    return DocumentAggregate.create({
      id: DocumentId.from(record.id),
      name: record.name,
      extension: DocumentExtension.from(record.extension),
      pageCount: PageCount.create(record.pageCount),
      sizeInBytes: record.sizeInBytes,
      userId: record.userId,
      fileHash: record.fileHash ? FileHash.fromHex(record.fileHash) : null,
      status: DocumentStatus.from(record.status),
      createdAt: new Date(record.createdAt)
    });
  }
}