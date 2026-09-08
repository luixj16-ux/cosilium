/**
 * Test canónico de TDD — QueueDocumentForUploadUseCase.
 *
 * Fuente: especificación MASTER_INIT_PROMPT.md, Sección 3.3.
 * Simula la pérdida de conexión con un mock del repositorio.
 */
import { describe, it, expect } from 'vitest';
import { QueueDocumentForUploadUseCase } from '../src/application/QueueDocumentForUploadUseCase';
import { MockDocumentRepository } from './mocks/MockDocumentRepository';
import { MockDocumentHasher } from './mocks/MockDocumentHasher';

describe('Dado que el usuario escanea un documento estando offline', () => {
  it('Debe guardar el documento en la cola local con estado PENDING_UPLOAD', async () => {
    // Arrange
    const mockRepo = new MockDocumentRepository();
    const useCase = new QueueDocumentForUploadUseCase(mockRepo, new MockDocumentHasher());
    const fakeFile = { name: 'factura.pdf', size: 1024, buffer: new Uint8Array([]) };

    // Act
    const result = async () => await useCase.execute({ file: fakeFile, userId: 'usr_123' });

    // Assert
    await expect(result()).resolves.not.toThrow();
    const queuedDocs = await mockRepo.getPendingUploads();
    expect(queuedDocs).toHaveLength(1);
    expect(queuedDocs[0]!.status.value).toBe('PENDING_UPLOAD');
  });

  it('Debe poder encolar varios documentos sin red sin interferir entre sí', async () => {
    const mockRepo = new MockDocumentRepository();
    const useCase = new QueueDocumentForUploadUseCase(mockRepo, new MockDocumentHasher());

    await useCase.execute({ file: { name: 'a.pdf', size: 10, buffer: new Uint8Array([1]) }, userId: 'u' });
    await useCase.execute({ file: { name: 'b.jpeg', size: 20, buffer: new Uint8Array([2]) }, userId: 'u' });

    const queued = await mockRepo.getPendingUploads();
    expect(queued).toHaveLength(2);
    expect(queued.map((d) => d.name).sort()).toEqual(['a.pdf', 'b.jpeg']);
  });

  it('Debe rechazar extensiones no admitidas por el dominio', async () => {
    const mockRepo = new MockDocumentRepository();
    const useCase = new QueueDocumentForUploadUseCase(mockRepo, new MockDocumentHasher());

    await expect(
      useCase.execute({ file: { name: 'virus.exe', size: 5, buffer: new Uint8Array([1]) }, userId: 'u' })
    ).rejects.toThrow();
    expect(await mockRepo.listAll()).toHaveLength(0);
  });

  it('Debe rechazar documentos que exceden el límite offline de páginas', async () => {
    const mockRepo = new MockDocumentRepository();
    const useCase = new QueueDocumentForUploadUseCase(mockRepo, new MockDocumentHasher());

    await expect(
      useCase.execute({ file: { name: 'big.pdf', size: 5, buffer: new Uint8Array([1]) }, userId: 'u', pageCount: 9999 })
    ).rejects.toThrow();
  });
});