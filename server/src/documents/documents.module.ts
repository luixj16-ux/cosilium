/**
 * DocumentsModule — Fábrica del servicio de documentos con sus adaptadores.
 * En fase 2 se monta bajo NestJS como controlador GraphQL; la fábrica permite
 * testear y usar el servicio sin levantar el framework.
 */
import { DocumentService } from './documents.service';
import type { PresignedUrlProvider } from './documents.service';

export interface DocumentsModuleDeps {
  presigner: PresignedUrlProvider;
  knownHashes: { has(hash: string): Promise<boolean> };
}

export function createDocumentsModule(deps: DocumentsModuleDeps): DocumentService {
  return new DocumentService(deps.presigner, deps.knownHashes);
}