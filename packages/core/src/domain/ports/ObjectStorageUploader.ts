/**
 * ObjectStorageUploader — Puerto (Port) del almacenamiento de objetos.
 *
 * Abstrae la subida del binario mediante Presigned URL directa al
 * storage (AWS S3 / MinIO), de modo que el servidor API nunca carga
 * el binario ni satura su red.
 *
 * Capa de dominio: declaraciones puras, sin dependencias externas.
 */
export interface PresignedUploadRequest {
  documentId: string;
  fileName: string;
  contentType: string;
  /** Binario pre-procesado por Rust (binarizado/compreso). */
  payload: Uint8Array;
}

export interface PresignedUploadResult {
  uploaded: boolean;
  storageKey: string;
}

export interface ObjectStorageUploader {
  uploadViaPresignedUrl(request: PresignedUploadRequest): Promise<PresignedUploadResult>;
}