import type { SearchRecord } from '../SearchRecord';

export interface SearchRecordRepository {
  save(record: SearchRecord): void;
  nextId(): number;
}