import { describe, it, expect } from 'vitest';
import { RegisterUserUseCase } from '../../src/application/RegisterUserUseCase';
import { LoginUserUseCase } from '../../src/application/LoginUserUseCase';
import { LogoutUserUseCase } from '../../src/application/LogoutUserUseCase';
import { GetCurrentSessionUseCase } from '../../src/application/GetCurrentSessionUseCase';
import { InvalidCredentialsError, AlreadyExistsError } from '../../src/application/errors';
import { InMemoryUserRepository } from '../../src/infrastructure/InMemoryUserRepository';
import { InMemorySessionRepository } from '../../src/infrastructure/InMemorySessionRepository';
import { InMemoryAuditLog } from '../../src/infrastructure/InMemoryAuditLog';
import { FakePasswordHasher, FakeTokenGenerator } from '../mocks/FakePortalFakes';

describe('Registro y Autenticación', () => {
  const deps = () => {
    const users = new InMemoryUserRepository();
    const sessions = new InMemorySessionRepository(users);
    const hasher = new FakePasswordHasher();
    const tokens = new FakeTokenGenerator();
    const audit = new InMemoryAuditLog();
    return { users, sessions, hasher, tokens, audit };
  };

  it('Registro crea usuario público y sesión', () => {
    const d = deps();
    const uc = new RegisterUserUseCase(d.users, d.sessions, d.hasher, d.tokens, d.audit);
    const res = uc.execute({ username: 'juan.perez', fullName: 'Juan Pérez', email: 'j@test.com', password: '12345678' });

    expect(res.user.isAdmin).toBe(false);
    expect(res.token).toBe('token-1');
    expect(d.audit.list()).toHaveLength(1);
    expect(d.audit.list()[0]!.action).toBe('register');
  });

  it('Registro rechaza duplicados por username o email', () => {
    const d = deps();
    const uc = new RegisterUserUseCase(d.users, d.sessions, d.hasher, d.tokens, d.audit);
    uc.execute({ username: 'juan.perez', fullName: 'Juan Pérez', email: 'j@test.com', password: '12345678' });
    expect(() =>
      uc.execute({ username: 'juan.perez', fullName: 'Otro', email: 'otro@test.com', password: '12345678' })
    ).toThrow(AlreadyExistsError);
    expect(() =>
      uc.execute({ username: 'otro.nombre', fullName: 'Otro', email: 'j@test.com', password: '12345678' })
    ).toThrow(AlreadyExistsError);
  });

  it('Registro rechaza contraseña corta', () => {
    const d = deps();
    const uc = new RegisterUserUseCase(d.users, d.sessions, d.hasher, d.tokens, d.audit);
    expect(() => uc.execute({ username: 'juan.perez', fullName: 'Juan', email: 'j@test.com', password: '123' })).toThrow();
  });

  it('Login exitoso devuelve usuario y token', () => {
    const d = deps();
    const reg = new RegisterUserUseCase(d.users, d.sessions, d.hasher, d.tokens, d.audit);
    reg.execute({ username: 'juan.perez', fullName: 'Juan Pérez', email: 'j@test.com', password: '12345678' });

    const login = new LoginUserUseCase(d.users, d.sessions, d.hasher, d.tokens, d.audit);
    const res = login.execute({ identifier: 'juan.perez', password: '12345678' });
    expect(res.user.username.value).toBe('juan.perez');
    expect(res.token).toBe('token-2');
  });

  it('Login falla con credenciales inválidas', () => {
    const d = deps();
    const reg = new RegisterUserUseCase(d.users, d.sessions, d.hasher, d.tokens, d.audit);
    reg.execute({ username: 'juan.perez', fullName: 'Juan Pérez', email: 'j@test.com', password: '12345678' });

    const login = new LoginUserUseCase(d.users, d.sessions, d.hasher, d.tokens, d.audit);
    expect(() => login.execute({ identifier: 'juan.perez', password: 'INCORRECTA' })).toThrow(InvalidCredentialsError);
    expect(() => login.execute({ identifier: 'no.existe', password: '12345678' })).toThrow(InvalidCredentialsError);
  });

  it('GetCurrentSession devuelve usuario por token activo', () => {
    const d = deps();
    const reg = new RegisterUserUseCase(d.users, d.sessions, d.hasher, d.tokens, d.audit);
    const { token } = reg.execute({ username: 'juan.perez', fullName: 'Juan Pérez', email: 'j@test.com', password: '12345678' });

    const current = new GetCurrentSessionUseCase(d.sessions);
    expect(current.execute({ token })?.username.value).toBe('juan.perez');
    expect(current.execute({ token: 'token-invalido' })).toBeNull();
  });

  it('Logout elimina la sesión', () => {
    const d = deps();
    const reg = new RegisterUserUseCase(d.users, d.sessions, d.hasher, d.tokens, d.audit);
    const { token } = reg.execute({ username: 'juan.perez', fullName: 'Juan Pérez', email: 'j@test.com', password: '12345678' });

    const logout = new LogoutUserUseCase(d.sessions);
    logout.execute({ token });
    expect(new GetCurrentSessionUseCase(d.sessions).execute({ token })).toBeNull();
  });
});