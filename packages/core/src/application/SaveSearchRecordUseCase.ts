import { UnauthorizedError } from './errors';
import { SearchRecord } from '../domain/SearchRecord';
import type { User } from '../domain/User';
import type { SearchRecordRepository } from '../domain/ports/SearchRecordRepository';

export interface SaveSearchRecordInput {
  actor: User;
  query: string;
  courtId?: string | null;
  resultCount?: number;
}

export class SaveSearchRecordUseCase {
  constructor(private readonly searchRecordRepository: SearchRecordRepository) {}

  execute(input: SaveSearchRecordInput): void {
    if (!input.actor) {
      throw new UnauthorizedError('Debes registrarte o iniciar sesión para guardar búsquedas.');
    }
    const record = SearchRecord.create({
      id: this.searchRecordRepository.nextId(),
      userId: input.actor.id,
      queryText: input.query,
      courtId: input.courtId ?? null,
      resultCount: input.resultCount ?? 0
    });
    this.searchRecordRepository.save(record);
  }
}