/**
 * DocumentAggregate — Agregado raíz del dominio.
 *
 * Encapsula los metadatos inmutables del documento y su estado de
 * sincronización. Aplica invariantes DDD en frío:
 *   - id inmutable (append-only),
 *   - extensión válida,
 *   - conteo de páginas dentro del límite offline,
 *   - transiciones de estado válidas del protocolo de outbox.
 *
 * La úNICA mutación permitida sobre un agregado es su estado de
 * sincronización (PENDING → PENDING_UPLOAD → UPLOADED/FAILED).
 * Corregir un metadato = crear un nuevo `DocumentAggregate` con un
 * nuevo `DocumentId`.
 *
 * Capa de dominio: código TypeScript puro, sin dependencias externas.
 */
import { DocumentId } from './DocumentId';
import { FileHash } from './FileHash';
import { PageCount } from './PageCount';
import { DocumentExtension } from './DocumentExtension';
import { DocumentStatus } from './DocumentStatus';

export interface DocumentAggregateProps {
  id: DocumentId;
  name: string;
  extension: DocumentExtension;
  pageCount: PageCount;
  sizeInBytes: number;
  userId: string;
  fileHash?: FileHash | null;
  status?: DocumentStatus;
  createdAt?: Date;
}

export class DocumentAggregate {
  readonly id: DocumentId;
  readonly name: string;
  readonly extension: DocumentExtension;
  readonly pageCount: PageCount;
  readonly sizeInBytes: number;
  readonly userId: string;
  readonly createdAt: Date;
  readonly fileHash: FileHash | null;

  private _status: DocumentStatus;

  private constructor(props: DocumentAggregateProps) {
    this.id = props.id;
    this.name = props.name;
    this.extension = props.extension;
    this.pageCount = props.pageCount;
    this.sizeInBytes = this.validateSizeInBytes(props.sizeInBytes);
    this.userId = props.userId;
    this.fileHash = props.fileHash ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this._status = props.status ?? DocumentStatus.PENDING;
  }

  /** Invariante: el tamaño binario debe ser un entero >= 0. */
  private validateSizeInBytes(size: number): number {
    if (!Number.isInteger(size) || size < 0) {
      throw new Error(`sizeInBytes inválido: "${size}" debe ser un entero >= 0.`);
    }
    return size;
  }

  /** Crea un agregado validando TODAS las invariantes de dominio. */
  static create(props: DocumentAggregateProps): DocumentAggregate {
    return new DocumentAggregate(props);
  }

  get status(): DocumentStatus {
    return this._status;
  }

  /** Marca el documento para subida. PENDING → PENDING_UPLOAD. */
  queueForUpload(): void {
    this.transitionTo(DocumentStatus.PENDING_UPLOAD);
  }

  /**
   * Marca el documento como subido. PENDING_UPLOAD → UPLOADED.
   * Si el binario ya existe en la nube (mismo FileHash), se marca
   * UPLOADED igualmente (el servidor descarta duplicados por hash).
   */
  markAsUploaded(): void {
    this.transitionTo(DocumentStatus.UPLOADED);
  }

  /** Marca el documento como fallido. PENDING_UPLOAD → FAILED (retryable). */
  markAsFailed(): void {
    this.transitionTo(DocumentStatus.FAILED);
  }

  /** Reintenta un fallido. FAILED → PENDING_UPLOAD. */
  retryUpload(): void {
    this.transitionTo(DocumentStatus.PENDING_UPLOAD);
  }

  /**
   * Deduplicación: true si el FileHash de este documento ya existe
   * en el conjunto de hashes remotos (no se vuelve a subir el binario).
   */
  isDuplicateOf(existingHashes: ReadonlySet<string>): boolean {
    return this.fileHash !== null && existingHashes.has(this.fileHash.value);
  }

  private transitionTo(next: DocumentStatus): void {
    if (!this._status.canTransitionTo(next)) {
      throw new Error(
        `Transición de estado inválida: ${this._status.value} → ${next.value}. ` +
          `Los metadatos son append-only; solo el estado de sincronización puede cambiar.`
      );
    }
    this._status = next;
  }
}