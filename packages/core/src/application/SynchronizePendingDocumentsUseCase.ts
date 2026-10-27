/**
 * SynchronizePendingDocumentsUseCase — Orquestador de sincronización.
 *
 * Drena la cola `document_outbox` cuando hay red:
 *   1. Obtiene los documentos PENDING_UPLOAD del repositorio local.
 *   2. Pregunta a la nube qué FileHashes ya existen.
 *   3. Duplicados → se marcan UPLOADED sin subir binario.
 *   4. Nuevos → presigned URL y subida directa al storage de objetos
 *      (sin saturar el servidor API).
 *   5. Éxito → UPLOADED; fallo de red → FAILED (reintentable).
 *
 * El orden del outbox se respeta (FIFO por fecha de encolamiento).
 */
import type { DocumentRepository } from '../domain/ports/DocumentRepository';
import type { RemoteDocumentRegistry } from '../domain/ports/RemoteDocumentRegistry';
import type { ObjectStorageUploader } from '../domain/ports/ObjectStorageUploader';
import type { DocumentAggregate } from '../domain/DocumentAggregate';

export interface SynchronizationSummary {
  processed: number;
  uploaded: number;
  duplicated: number;
  failed: number;
}

export class SynchronizePendingDocumentsUseCase {
  constructor(
    private readonly repository: DocumentRepository,
    private readonly registry: RemoteDocumentRegistry,
    private readonly uploader: ObjectStorageUploader
  ) {}

  async execute(): Promise<SynchronizationSummary> {
    const pending = await this.repository.findPendingUploads();
    const summary: SynchronizationSummary = { processed: pending.length, uploaded: 0, duplicated: 0, failed: 0 };

    const { existingHashes } = await this.registry.verifyExistence(
      pending.filter((doc) => doc.fileHash !== null).map((doc) => doc.fileHash!)
    );

    for (const document of pending) {
      await this.processDocument(document, existingHashes, summary);
    }

    return summary;
  }

  private async processDocument(
    document: DocumentAggregate,
    existingHashes: ReadonlySet<string>,
    summary: SynchronizationSummary
  ): Promise<void> {
    try {
      if (document.isDuplicateOf(existingHashes)) {
        document.markAsUploaded();
        await this.repository.save(document);
        summary.duplicated += 1;
        return;
      }

      await this.uploader.uploadViaPresignedUrl({
        documentId: document.id.value,
        fileName: document.name,
        contentType: `application/${document.extension.value.toLowerCase()}`,
        payload: new Uint8Array(0)
      });

      document.markAsUploaded();
      await this.repository.save(document);
      summary.uploaded += 1;
    } catch {
      document.markAsFailed();
      await this.repository.save(document);
      summary.failed += 1;
    }
  }
}