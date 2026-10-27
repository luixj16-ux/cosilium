/**
 * VerifyRemoteExistenceUseCase — Caso de uso de la Capa de Aplicación.
 *
 * Dado un conjunto de FileHashes locales pendientes, consulta al
 * registro remoto (GraphQL) cuáles ya existen en la nube, para no
 * re-subir binarios duplicados. La inmutabilidad (append-only) hace
 * que FileHash sea un identificador fiable de deduplicación.
 */
import type { RemoteDocumentRegistry } from '../domain/ports/RemoteDocumentRegistry';
import type { DocumentAggregate } from '../domain/DocumentAggregate';

export interface ExistingHashesResult {
  existingHashes: ReadonlySet<string>;
  missingHashes: readonly string[];
}

export class VerifyRemoteExistenceUseCase {
  constructor(private readonly registry: RemoteDocumentRegistry) {}

  async execute(pendingDocuments: readonly DocumentAggregate[]): Promise<ExistingHashesResult> {
    const hashes = pendingDocuments
      .map((doc) => doc.fileHash)
      .filter((hash): hash is NonNullable<typeof hash> => hash !== null);

    const { existingHashes } = await this.registry.verifyExistence(hashes);

    return {
      existingHashes,
      missingHashes: hashes.filter((hash) => !existingHashes.has(hash.value)).map((h) => h.value)
    };
  }
}