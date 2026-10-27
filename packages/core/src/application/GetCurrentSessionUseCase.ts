import type { User } from '../domain/User';
import type { SessionRepository } from '../domain/ports/SessionRepository';

export class GetCurrentSessionUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  execute({ token }: { token: string }): User | null {
    return this.sessionRepository.findUserByToken(token);
  }
}