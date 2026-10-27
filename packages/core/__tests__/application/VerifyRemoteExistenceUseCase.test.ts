import { describe, it, expect } from 'vitest';
import { VerifyRemoteExistenceUseCase } from '../../src/application/VerifyRemoteExistenceUseCase';
import { FakeRemoteRegistry } from '../mocks/FakeRemoteRegistry';
import { DocumentAggregate } from '../../src/domain/DocumentAggregate';
import { DocumentId } from '../../src/domain/DocumentId';
import { DocumentExtension } from '../../src/domain/DocumentExtension';
import { PageCount } from '../../src/domain/PageCount';
import { FileHash } from '../../src/domain/FileHash';

const SHA_1 = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
const SHA_2 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

function doc(id: string, hash: string) {
  return DocumentAggregate.create({
    id: DocumentId.from(id),
    name: `${id}.pdf`,
    extension: DocumentExtension.from('pdf'),
    pageCount: PageCount.create(1),
    sizeInBytes: 1,
    userId: 'u',
    fileHash: FileHash.fromHex(hash)
  });
}

describe('VerifyRemoteExistenceUseCase (deduplicación por hash)', () => {
  it('Debe devolver cuáles hashes ya existen y cuáles faltan', async () => {
    const registry = new FakeRemoteRegistry(new Set([SHA_1]));
    const useCase = new VerifyRemoteExistenceUseCase(registry);

    const result = await useCase.execute([doc('doc_aa', SHA_1), doc('doc_bb', SHA_2)]);

    expect(result.existingHashes.has(SHA_1)).toBe(true);
    expect(result.existingHashes.has(SHA_2)).toBe(false);
    expect(result.missingHashes).toEqual([SHA_2]);
  });

  it('Debe ignorar documentos sin hash (no deduplicables)', async () => {
    const registry = new FakeRemoteRegistry(new Set());
    const useCase = new VerifyRemoteExistenceUseCase(registry);

    const noHash = DocumentAggregate.create({
      id: DocumentId.from('doc_nohash'),
      name: 'x.pdf',
      extension: DocumentExtension.from('pdf'),
      pageCount: PageCount.create(1),
      sizeInBytes: 1,
      userId: 'u'
    });

    const result = await useCase.execute([noHash]);
    expect(result.existingHashes.size).toBe(0);
    expect(result.missingHashes).toEqual([]);
  });
});