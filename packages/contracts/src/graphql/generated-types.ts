/**
 * Tipos "generados" por el esquema GraphQL.
 *
 * En producción, estos tipos se generan con `graphql-codegen` a partir
 * de `schema.graphql` (ver server/src/graphql/schema.graphql). Se
 * mantienen versionados aquí para que las apps compartan el contrato
 * sin depender del toolchain de generación en tiempo de build.
 */
import type {
  DocumentPayload,
  UploadResult,
  ExistenceVerificationResult,
  DocumentStatusValue,
  DocumentExtensionValue
} from '../index';

export interface DocumentGraphQL {
  id: string;
  name: string;
  extension: DocumentExtensionValue;
  pageCount: number;
  sizeInBytes: number;
  fileHash: string | null;
  status: DocumentStatusValue;
  userId: string;
  createdAt: string;
  __typename: 'Document';
}

export interface UploadDocumentInput {
  id: string;
  name: string;
  contentType: string;
  sizeInBytes: number;
  fileHash: string;
}

export interface VerifyExistenceVariables {
  hashes: string[];
}

export interface VerifyExistenceResponseData {
  verifyDocumentsExistence: ExistenceVerificationResult;
}

export interface GetPresignedUploadUrlVariables {
  input: UploadDocumentInput;
}

export interface GetPresignedUploadUrlResponseData {
  presignedUploadUrl: {
    url: string;
    storageKey: string;
    expiresInSeconds: number;
  };
}

export type { DocumentPayload, UploadResult, ExistenceVerificationResult, DocumentStatusValue, DocumentExtensionValue };

export type { DocumentGraphQL as DocumentContractGraphQL };