import { ForbiddenError } from './errors';
import type { User } from '../domain/User';
import type { UserRepository } from '../domain/ports/UserRepository';

export interface ListUsersInput {
  actor: User;
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(input: ListUsersInput): User[] {
    if (!input.actor.isAdmin) {
      throw new ForbiddenError('No tienes permisos de administrador para esta acción.');
    }
    return this.userRepository.listAll();
  }
}