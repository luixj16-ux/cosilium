import { UnauthorizedError, NotFoundError } from './errors';
import type { User } from '../domain/User';
import type { LegalCase } from '../domain/LegalCase';
import type { CaseRepository } from '../domain/ports/CaseRepository';

export interface GetCaseDetailInput {
  actor: User | null;
  publicId: string;
}

export class GetCaseDetailUseCase {
  constructor(private readonly caseRepository: CaseRepository) {}

  execute(input: GetCaseDetailInput): LegalCase {
    if (!input.actor) {
      throw new UnauthorizedError();
    }
    const legalCase = this.caseRepository.findByPublicId(input.publicId);
    if (!legalCase) {
      throw new NotFoundError('Expediente no encontrado.');
    }
    return legalCase;
  }
}