import type { CourtRepository } from '../domain/ports/CourtRepository';
import type { Court } from '../domain/Court';

export class InMemoryCourtRepository implements CourtRepository {
  constructor(private readonly courts: Court[]) {}

  listAll(): Court[] {
    return [...this.courts];
  }

  findById(id: string): Court | null {
    return this.courts.find((c) => c.id === id) ?? null;
  }
}