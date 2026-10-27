import { AlreadyExistsError } from './errors';
import { Password } from '../domain/Password';
import { User } from '../domain/User';
import { USER_ROLES } from '../domain/UserRole';
import { AuditEvent } from '../domain/AuditEvent';
import type { UserRepository } from '../domain/ports/UserRepository';
import type { SessionRepository } from '../domain/ports/SessionRepository';
import type { PasswordHasher } from '../domain/ports/PasswordHasher';
import type { SessionTokenGenerator } from '../domain/ports/SessionTokenGenerator';
import type { AuditLog } from '../domain/ports/AuditLog';

export interface RegisterUserInput {
  username: string;
  fullName: string;
  email: string;
  password: string;
  inpre?: string | null;
}

export interface AuthResult {
  user: User;
  token: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: SessionTokenGenerator,
    private readonly auditLog: AuditLog
  ) {}

  execute(input: RegisterUserInput): AuthResult {
    const password = Password.create(input.password);
    const existing = this.userRepository.findByUsernameOrEmail(input.username.trim().toLowerCase());
    if (existing) {
      throw new AlreadyExistsError('El usuario o correo ya está registrado.');
    }
    const existingEmail = this.userRepository.findByUsernameOrEmail(input.email.trim().toLowerCase());
    if (existingEmail) {
      throw new AlreadyExistsError('El usuario o correo ya está registrado.');
    }
    const user = User.create({
      id: this.userRepository.nextId(),
      username: input.username,
      fullName: input.fullName,
      email: input.email,
      role: USER_ROLES.PUBLIC,
      passwordHash: this.passwordHasher.hash(password.value),
      inpre: input.inpre || null
    });
    this.userRepository.save(user);
    const token = this.tokenGenerator.generate();
    this.sessionRepository.create(user.id, token, new Date(Date.now() + 8 * 60 * 60 * 1000));
    this.auditLog.record(
      AuditEvent.create({
        userId: user.id,
        action: 'register',
        entityType: 'user',
        entityId: String(user.id)
      })
    );
    return { user, token };
  }
}