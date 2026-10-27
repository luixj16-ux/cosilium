import { describe, it, expect } from 'vitest';
import { SetUpAdminPasswordUseCase } from '../../src/application/SetUpAdminPasswordUseCase';
import { PromoteUserUseCase } from '../../src/application/PromoteUserUseCase';
import { ListUsersUseCase } from '../../src/application/ListUsersUseCase';
import { ForbiddenError, NotFoundError, AlreadyExistsError } from '../../src/application/errors';
import { User } from '../../src/domain/User';
import { InMemoryUserRepository } from '../../src/infrastructure/InMemoryUserRepository';
import { InMemoryAuditLog } from '../../src/infrastructure/InMemoryAuditLog';
import { FakePasswordHasher } from '../mocks/FakePortalFakes';

function adminUser(): User {
  const u = User.create({
    id: 1,
    username: 'admin',
    fullName: 'Administrador',
    email: 'admin@tsj.test',
    role: 'admin',
  });
  return u;
}

function publicUser(id: number, username: string): User {
  return User.create({
    id,
    username,
    fullName: username,
    email: `${username}@test.com`,
    role: 'public',
  });
}

describe('Configuración del Admin', () => {
  it('Solo configura el usuario "admin"', () => {
    const users = new InMemoryUserRepository();
    users.save(adminUser());
    const uc = new SetUpAdminPasswordUseCase(users, new FakePasswordHasher());
    expect(() => uc.execute({ username: 'otro', password: '12345678' })).toThrow(ForbiddenError);
  });

  it('Establece el hash solo si aún no existe', () => {
    const users = new InMemoryUserRepository();
    users.save(adminUser());
    const uc = new SetUpAdminPasswordUseCase(users, new FakePasswordHasher());
    uc.execute({ username: 'admin', password: '12345678' });
    expect(users.findById(1)?.passwordHash).toBe('hashed(12345678)');
    expect(() => uc.execute({ username: 'admin', password: '87654321' })).toThrow(AlreadyExistsError);
  });

  it('Lanza NotFound si el admin no existe', () => {
    const users = new InMemoryUserRepository();
    const uc = new SetUpAdminPasswordUseCase(users, new FakePasswordHasher());
    expect(() => uc.execute({ username: 'admin', password: '12345678' })).toThrow(NotFoundError);
  });
});

describe('PromoteUserUseCase', () => {
  it('Solo un admin puede promover', () => {
    const users = new InMemoryUserRepository();
    const target = publicUser(2, 'juan.perez');
    users.save(target);
    const uc = new PromoteUserUseCase(users, new InMemoryAuditLog());
    const actor = User.create({ id: 3, username: 'alguien', fullName: 'X', email: 'x@test.com', role: 'public' });
    expect(() => uc.execute({ actor, userId: 2 })).toThrow(ForbiddenError);
  });

  it('Promueve al usuario objetivo', () => {
    const users = new InMemoryUserRepository();
    const target = publicUser(2, 'juan.perez');
    users.save(target);
    const audit = new InMemoryAuditLog();
    const uc = new PromoteUserUseCase(users, audit);
    const promoted = uc.execute({ actor: adminUser(), userId: 2 });
    expect(promoted.isAdmin).toBe(true);
    expect(audit.list()[0]!.action).toBe('promote');
  });

  it('Lanza NotFound si el usuario no existe', () => {
    const users = new InMemoryUserRepository();
    const uc = new PromoteUserUseCase(users, new InMemoryAuditLog());
    expect(() => uc.execute({ actor: adminUser(), userId: 999 })).toThrow(NotFoundError);
  });
});

describe('ListUsersUseCase', () => {
  it('Lista todos los usuarios', () => {
    const users = new InMemoryUserRepository();
    users.save(adminUser());
    users.save(publicUser(2, 'juan.perez'));
    const uc = new ListUsersUseCase(users);
    const list = uc.execute({ actor: adminUser() });
    expect(list).toHaveLength(2);
  });

  it('Solo un admin puede listar', () => {
    const users = new InMemoryUserRepository();
    users.save(publicUser(2, 'juan.perez'));
    const uc = new ListUsersUseCase(users);
    expect(() => uc.execute({ actor: publicUser(2, 'juan.perez') })).toThrow(ForbiddenError);
  });
});