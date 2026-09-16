import type { SessionRepository } from '../domain/ports/SessionRepository';

export class LogoutUserUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  execute({ token }: { token: string }): void {
    this.sessionRepository.deleteByToken(token);
  }
}