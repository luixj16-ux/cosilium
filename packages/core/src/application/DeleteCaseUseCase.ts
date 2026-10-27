import { ForbiddenError, NotFoundError } from './errors';
import type { User } from '../domain/User';
import type { CaseRepository } from '../domain/ports/CaseRepository';

export interface DeleteCaseInput {
  actor: User;
  publicId: string;
}

export class DeleteCaseUseCase {
  constructor(private readonly caseRepository: CaseRepository) {}

  execute(input: DeleteCaseInput): void {
    if (!input.actor.isAdmin) {
      throw new ForbiddenError('Permiso denegado: El público no puede eliminar causas.');
    }
    const deleted = this.caseRepository.delete(input.publicId);
    if (!deleted) {
      throw new NotFoundError('Expediente no encontrado.');
    }
  }
}