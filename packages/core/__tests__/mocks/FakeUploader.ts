/**
 * FakeUploader — Fake del storage de objetos que guarda las subidas
 * presigned en memoria y permite inducir fallos de red.
 */
import type {
  ObjectStorageUploader,
  PresignedUploadRequest,
  PresignedUploadResult
} from '../../src/domain/ports/ObjectStorageUploader';

export class FakeUploader implements ObjectStorageUploader {
  uploadedKeys: string[] = [];
  private readonly failNext: boolean;

  constructor(options: { failNext?: boolean } = {}) {
    this.failNext = options.failNext ?? false;
  }

  async uploadViaPresignedUrl(request: PresignedUploadRequest): Promise<PresignedUploadResult> {
    if (this.failNext) {
      throw new Error('Red simulada: fallo de red durante la subida.');
    }
    const storageKey = `docs/${request.documentId}/${request.fileName}`;
    this.uploadedKeys.push(storageKey);
    return { uploaded: true, storageKey };
  }
}