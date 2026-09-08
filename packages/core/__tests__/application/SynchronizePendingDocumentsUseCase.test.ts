import { describe, it, expect } from 'vitest';
import { SynchronizePendingDocumentsUseCase } from '../../src/application/SynchronizePendingDocumentsUseCase';
import { QueueDocumentForUploadUseCase } from '../../src/application/QueueDocumentForUploadUseCase';
import { MockDocumentRepository } from '../mocks/MockDocumentRepository';
import { MockDocumentHasher } from '../mocks/MockDocumentHasher';
import { FakeRemoteRegistry } from '../mocks/FakeRemoteRegistry';
import { FakeUploader } from '../mocks/FakeUploader';

describe('SynchronizePendingDocumentsUseCase (orquestador de sync)', () => {
  it('Debe subir binarios nuevos y marcar duplicados sin re-subir', async () => {
    const repo = new MockDocumentRepository();
    const hasher = new MockDocumentHasher();
    const queue = new QueueDocumentForUploadUseCase(repo, hasher);

    const bufferA = new Uint8Array([1, 2, 3]);
    const bufferB = new Uint8Array([4, 5, 6]);
    const docA = await queue.execute({ file: { name: 'a.pdf', size: 3, buffer: bufferA }, userId: 'u' });
    const docB = await queue.execute({ file: { name: 'b.pdf', size: 3, buffer: bufferB }, userId: 'u' });

    const existing = new Set([docA.fileHash!.value]);
    const uploader = new FakeUploader();
    const useCase = new SynchronizePendingDocumentsUseCase(repo, new FakeRemoteRegistry(existing), uploader);

    const summary = await useCase.execute();

    expect(summary.processed).toBe(2);
    expect(summary.uploaded).toBe(1);
    expect(summary.duplicated).toBe(1);
    expect(summary.failed).toBe(0);
    expect(uploader.uploadedKeys).toHaveLength(1);
  });

  it('Debe marcar como FAILED un documento si falla la subida (offline durante sync)', async () => {
    const repo = new MockDocumentRepository();
    const hasher = new MockDocumentHasher();
    const queue = new QueueDocumentForUploadUseCase(repo, hasher);

    await queue.execute({ file: { name: 'a.pdf', size: 3, buffer: new Uint8Array([1, 2, 3]) }, userId: 'u' });

    const uploader = new FakeUploader({ failNext: true });
    const useCase = new SynchronizePendingDocumentsUseCase(repo, new FakeRemoteRegistry(new Set()), uploader);

    const summary = await useCase.execute();

    expect(summary.failed).toBe(1);
    const all = await repo.listAll();
    expect(all[0]!.status.value).toBe('FAILED');
  });

  it('Debe no hacer nada si no hay documentos pendientes', async () => {
    const repo = new MockDocumentRepository();
    const useCase = new SynchronizePendingDocumentsUseCase(repo, new FakeRemoteRegistry(), new FakeUploader());

    const summary = await useCase.execute();
    expect(summary.processed).toBe(0);
  });
});