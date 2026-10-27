import type { Court } from '../Court';

export interface CourtRepository {
  listAll(): Court[];
  findById(id: string): Court | null;
}