import type { SearchRecordRepository } from '../domain/ports/SearchRecordRepository';
import type { SearchRecord } from '../domain/SearchRecord';

export class InMemorySearchRecordRepository implements SearchRecordRepository {
  private readonly records: SearchRecord[] = [];

  save(record: SearchRecord): void {
    this.records.push(record);
  }

  nextId(): number {
    return this.records.length + 1;
  }
}