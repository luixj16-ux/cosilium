import type { Court } from '../domain/Court';
import type { CourtRepository } from '../domain/ports/CourtRepository';

export class ListCourtsUseCase {
  constructor(private readonly courtRepository: CourtRepository) {}

  execute(): Court[] {
    return this.courtRepository.listAll();
  }
}