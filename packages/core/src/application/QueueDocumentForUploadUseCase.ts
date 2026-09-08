/**
 * QueueDocumentForUploadUseCase — Caso de uso de la Capa de Aplicación.
 *
 * Orquesta: leer el archivo captado/escaneado → validar invariantes de
 * dominio → calcular FileHash (vía puerto DocumentHasher, implementado
 * por Rust/Wasm) → construir el agregado → encolarlo (PENDING_UPLOAD)
 * en el outbox local → persistirlo vía puerto DocumentRepository.
 *
 * Funciona EXACTAMENTE igual offline: la persistencia es local y no
 * depende de red.
 */
import type { DocumentRepository } from '../domain/ports/DocumentRepository';
import type { DocumentHasher } from '../domain/ports/DocumentHasher';
import { DocumentId } from '../domain/DocumentId';
import { DocumentExtension } from '../domain/DocumentExtension';
import { PageCount } from '../domain/PageCount';
import { DocumentAggregate } from '../domain/DocumentAggregate';

export interface IngestionFile {
  name: string;
  size: number;
  buffer: Uint8Array;
}

export interface QueueDocumentCommand {
  file: IngestionFile;
  userId: string;
  pageCount?: number;
}

export class QueueDocumentForUploadUseCase {
  constructor(
    private readonly repository: DocumentRepository,
    private readonly hasher: DocumentHasher
  ) {}

  async execute(command: QueueDocumentCommand): Promise<DocumentAggregate> {
    const extension = DocumentExtension.from(command.file.name.split('.').pop() ?? '');
    const pageCount = PageCount.create(command.pageCount ?? 1);
    const id = DocumentId.generate();
    const fileHash = await this.hasher.hash(command.file.buffer);

    const document = DocumentAggregate.create({
      id,
      name: command.file.name,
      extension,
      pageCount,
      sizeInBytes: command.file.size,
      userId: command.userId,
      fileHash
    });

    document.queueForUpload();
    await this.repository.save(document);
    return document;
  }
}