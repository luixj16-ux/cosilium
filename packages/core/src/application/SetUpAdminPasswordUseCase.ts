import { ForbiddenError, NotFoundError, AlreadyExistsError } from './errors';
import { Password } from '../domain/Password';
import type { UserRepository } from '../domain/ports/UserRepository';
import type { PasswordHasher } from '../domain/ports/PasswordHasher';

export interface SetupAdminPasswordInput {
  username: string;
  password: string;
}

export class SetUpAdminPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  execute(input: SetupAdminPasswordInput): void {
    if (input.username !== 'admin') {
      throw new ForbiddenError('Este endpoint es solo para configurar el usuario admin.');
    }
    const password = Password.create(input.password);
    const admin = this.userRepository.findByUsernameOrEmail('admin');
    if (!admin) {
      throw new NotFoundError('Usuario admin no encontrado.');
    }
    if (admin.passwordHash) {
      throw new AlreadyExistsError('La contraseña del admin ya está configurada.');
    }
    admin.setPasswordHash(this.passwordHasher.hash(password.value));
    this.userRepository.save(admin);
  }
}