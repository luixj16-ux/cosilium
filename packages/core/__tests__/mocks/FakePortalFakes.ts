import type { PasswordHasher } from '../../src/domain/ports/PasswordHasher';

export class FakePasswordHasher implements PasswordHasher {
  hash(password: string): string {
    return `hashed(${password})`;
  }

  verify(password: string, storedHash: string): boolean {
    return this.hash(password) === storedHash;
  }
}

export class FakeTokenGenerator {
  private sequence = 0;
  generate(): string {
    this.sequence += 1;
    return `token-${this.sequence}`;
  }
}