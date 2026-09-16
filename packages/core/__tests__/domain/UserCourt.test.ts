import { describe, it, expect } from 'vitest';
import { User } from '../../src/domain/User';
import { USER_ROLES } from '../../src/domain/UserRole';
import { Court } from '../../src/domain/Court';

describe('User', () => {
  it('create() crea usuario público por defecto', () => {
    const u = User.create({
      id: 1,
      username: 'consulta-publica',
      fullName: 'Consulta Pública',
      email: 'consulta@tsj.test',
    });
    expect(u.isAdmin).toBe(false);
  });

  it('create() con rol admin', () => {
    const u = User.create({
      id: 1,
      username: 'admin',
      fullName: 'Administrador',
      email: 'admin@tsj.test',
      role: USER_ROLES.ADMIN,
    });
    expect(u.isAdmin).toBe(true);
  });

  it('promoteToAdmin() convierte a admin', () => {
    const u = User.create({ id: 1, username: 'juan.perez', fullName: 'Juan Pérez', email: 'j@test.com' });
    u.promoteToAdmin();
    expect(u.isAdmin).toBe(true);
  });

  it('promoteToAdmin() lanza si ya es admin', () => {
    const u = User.create({ id: 1, username: 'admin', fullName: 'Admin', email: 'a@test.com', role: USER_ROLES.ADMIN });
    expect(() => u.promoteToAdmin()).toThrow('ya es administrador');
  });

  it('toPublicDto() no expone el hash', () => {
    const u = User.create({
      id: 1,
      username: 'juan.perez',
      fullName: 'Juan Pérez',
      email: 'j@test.com',
      passwordHash: 'hash-secreto',
    });
    const dto = u.toPublicDto();
    expect(dto.email).toBe('j@test.com');
    expect(dto.username).toBe('juan.perez');
    expect(dto.fullName).toBe('Juan Pérez');
    expect(JSON.stringify(dto)).not.toContain('hash-secreto');
  });

  it('setPasswordHash() actualiza el hash', () => {
    const u = User.create({ id: 1, username: 'admin', fullName: 'Admin', email: 'a@test.com' });
    expect(u.passwordHash).toBeNull();
    u.setPasswordHash('abc123');
    expect(u.passwordHash).toBe('abc123');
  });
});

describe('Court', () => {
  it('create() requiere id no vacío', () => {
    expect(() => Court.create({ id: '   ', name: 'X', description: 'D', category: 'penal' })).toThrow();
  });

  it('create() con valores por defecto', () => {
    const c = Court.create({ id: 'penal', name: 'Tribunal Penal', description: 'D', category: 'penal' });
    expect(c.id).toBe('penal');
    expect(c.active).toBe(true);
  });

  it('equals() compara por id', () => {
    const a = Court.create({ id: 'penal', name: 'X', description: 'D', category: 'penal' });
    const b = Court.create({ id: 'penal', name: 'Y', description: 'D', category: 'penal' });
    expect(a.equals(b)).toBe(true);
  });
});