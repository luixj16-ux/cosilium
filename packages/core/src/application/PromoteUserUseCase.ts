import { ForbiddenError, NotFoundError } from './errors';
import { AuditEvent } from '../domain/AuditEvent';
import type { User } from '../domain/User';
import type { UserRepository } from '../domain/ports/UserRepository';
import type { AuditLog } from '../domain/ports/AuditLog';

export interface PromoteUserInput {
  actor: User;
  userId: number;
}

export class PromoteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auditLog: AuditLog
  ) {}

  execute(input: PromoteUserInput): User {
    if (!input.actor.isAdmin) {
      throw new ForbiddenError('No tienes permisos de administrador para esta acción.');
    }
    const target = this.userRepository.findById(input.userId);
    if (!target) {
      throw new NotFoundError('Usuario no encontrado.');
    }
    target.promoteToAdmin();
    this.userRepository.save(target);
    this.auditLog.record(
      AuditEvent.create({
        userId: input.actor.id,
        action: 'promote',
        entityType: 'user',
        entityId: String(input.userId),
        metadataJson: JSON.stringify({ promotedBy: input.actor.username.value })
      })
    );
    return target;
  }
}