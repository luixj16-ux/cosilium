/**
 * OutboxCollectionSpec — Forma tipada de la colección RxDB `document_outbox`.
 *
 * Documenta el contrato que una colección RxDB real debe exponer para
 * que `RxDBDocumentRepository` la consuma. Al cablear RxDB real se
 * intercambia la implementación (insertar/find/update map a RxDB), sin
 * tocar el dominio ni la aplicación. La colección está AISLADA
 * (Outbox Pattern): no interfiere con el resto del almacenamiento.
 *
 * Capa de infraestructura: contrato de adapter, no reglas de negocio.
 */
export interface OutboxRecord {
  id: string;
  name: string;
  extension: string;
  pageCount: number;
  sizeInBytes: number;
  userId: string;
  fileHash: string | null;
  status: string;
  createdAt: number;
}

export interface OutboxCollection {
  insert(record: OutboxRecord): Promise<void>;
  findById(id: string): Promise<OutboxRecord | null>;
  findPendingUploads(): Promise<OutboxRecord[]>;
  all(): Promise<OutboxRecord[]>;
  updateStatus(id: string, status: string): Promise<void>;
}