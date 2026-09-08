/**
 * DocumentService — Adapter del backend sobre los puertos del Core.
 *
 * Implementa el lado remoto de los puertos `RemoteDocumentRegistry` y
 * `ObjectStorageUploader` de @consilium/core. Los clientes invocan estos
 * contratos vía GraphQL; el servicio SOLO trabaja con metadatos y
 * presign — nunca transporta binarios (ADR-0006).
 */
import type { ExistenceVerificationResult } from '@consilium/contracts';
import type { UploadDocumentInput } from '@consilium/contracts/graphql';

export interface PresignedUploadPayload {
  url: string;
  storageKey: string;
  expiresInSeconds: number;
}

export interface PresignedUrlProvider {
  issueUpload(input: UploadDocumentInput): Promise<PresignedUploadPayload>;
}

interface ExistingHashesStore {
  has(hash: string): Promise<boolean>;
}

export class DocumentService {
  constructor(
    private readonly presigner: PresignedUrlProvider,
    private readonly knownHashes: ExistingHashesStore
  ) {}

  async presignedUploadUrl(input: UploadDocumentInput): Promise<PresignedUploadPayload> {
    return this.presigner.issueUpload(input);
  }

  async verifyExistence(hashes: string[]): Promise<ExistenceVerificationResult> {
    const existingHashes: string[] = [];
    for (const hash of hashes) {
      if (await this.knownHashes.has(hash)) {
        existingHashes.push(hash);
      }
    }
    return { existingHashes };
  }
}