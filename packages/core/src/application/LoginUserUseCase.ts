import { InvalidCredentialsError } from './errors';
import type { AuthResult } from './RegisterUserUseCase';
import { AuditEvent } from '../domain/AuditEvent';
import type { UserRepository } from '../domain/ports/UserRepository';
import type { SessionRepository } from '../domain/ports/SessionRepository';
import type { PasswordHasher } from '../domain/ports/PasswordHasher';
import type { SessionTokenGenerator } from '../domain/ports/SessionTokenGenerator';
import type { AuditLog } from '../domain/ports/AuditLog';

export interface LoginUserInput {
  identifier: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: SessionTokenGenerator,
    private readonly auditLog: AuditLog
  ) {}

  execute(input: LoginUserInput): AuthResult {
    const user = this.userRepository.findByUsernameOrEmail(input.identifier.trim().toLowerCase());
    if (!user) {
      throw new InvalidCredentialsError();
    }
    if (!user.passwordHash || !this.passwordHasher.verify(input.password, user.passwordHash)) {
      throw new InvalidCredentialsError();
    }
    const token = this.tokenGenerator.generate();
    this.sessionRepository.create(user.id, token, new Date(Date.now() + 8 * 60 * 60 * 1000));
    this.auditLog.record(
      AuditEvent.create({
        userId: user.id,
        action: 'login',
        entityType: 'user',
        entityId: String(user.id)
      })
    );
    return { user, token };
  }
}