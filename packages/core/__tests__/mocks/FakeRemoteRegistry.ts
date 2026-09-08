/**
 * FakeRemoteRegistry — Fake del registro remoto para pruebas de sync.
 */
import type {
  RemoteDocumentRegistry,
  RemoteExistenceCheckResult
} from '../../src/domain/ports/RemoteDocumentRegistry';
import type { FileHash } from '../../src/domain/FileHash';

export class FakeRemoteRegistry implements RemoteDocumentRegistry {
  constructor(private readonly existingHashes: ReadonlySet<string> = new Set()) {}

  async verifyExistence(localHashes: readonly FileHash[]): Promise<RemoteExistenceCheckResult> {
    return {
      existingHashes: new Set(localHashes.map((h) => h.value).filter((h) => this.existingHashes.has(h)))
    };
  }
}