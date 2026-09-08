/**
 * DocumentRepository — Puerto (Port) de infraestructura.
 *
 * Define el contrato de persistencia que la capa de dominio necesita,
 * sin conocer la implementación (RxDB, SQLite, en-memoria). La capa de
 * infraestructura implementa este puerto.
 *
 * Capa de dominio: declaraciones puras, sin dependencias externas.
 */
import type { DocumentId } from '../DocumentId';
import type { DocumentAggregate } from '../DocumentAggregate';

export interface DocumentRepository {
  save(document: DocumentAggregate): Promise<void>;
  findById(id: DocumentId): Promise<DocumentAggregate | null>;
  findPendingUploads(): Promise<DocumentAggregate[]>;
  listAll(): Promise<DocumentAggregate[]>;
}