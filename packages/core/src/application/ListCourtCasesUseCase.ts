import { UnauthorizedError, NotFoundError } from './errors';
import type { User } from '../domain/User';
import type { LegalCase } from '../domain/LegalCase';
import type { CourtRepository } from '../domain/ports/CourtRepository';
import type { CaseRepository } from '../domain/ports/CaseRepository';

export interface ListCourtCasesInput {
  actor: User | null;
  courtId: string;
  filterTerm?: string;
}

export class ListCourtCasesUseCase {
  constructor(
    private readonly courtRepository: CourtRepository,
    private readonly caseRepository: CaseRepository
  ) {}

  execute(input: ListCourtCasesInput): LegalCase[] {
    if (!input.actor) {
      throw new UnauthorizedError();
    }
    if (!this.courtRepository.findById(input.courtId)) {
      throw new NotFoundError('Tribunal no encontrado.');
    }
    const term = (input.filterTerm ?? '').trim();
    return term
      ? this.caseRepository.search(input.courtId, term)
      : this.caseRepository.findByCourtId(input.courtId);
  }
}