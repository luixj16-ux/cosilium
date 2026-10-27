/**
 * RemoteDocumentRegistry — Puerto (Port) del backend (GraphQL).
 *
 * Abstrae la consulta a la nube de qué FileHashes / ids ya existen,
 * permitiendo no re-subir binarios duplicados (append-only).
 *
 * Capa de dominio: declaraciones puras, sin dependencias externas.
 */
import type { FileHash } from '../FileHash';

export interface RemoteExistenceCheckResult {
  existingHashes: ReadonlySet<string>;
}

export interface RemoteDocumentRegistry {
  /** Devuelve qué hashes del conjunto de entrada ya existen en la nube. */
  verifyExistence(localHashes: readonly FileHash[]): Promise<RemoteExistenceCheckResult>;
}