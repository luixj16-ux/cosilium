import type { UserRepository } from '../domain/ports/UserRepository';
import type { User } from '../domain/User';

export class InMemoryUserRepository implements UserRepository {
  private readonly users: User[] = [];

  save(user: User): void {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
  }

  findById(id: number): User | null {
    return this.users.find((u) => u.id === id) ?? null;
  }

  findByUsernameOrEmail(identifier: string): User | null {
    const normalized = identifier.trim().toLowerCase();
    return (
      this.users.find((u) => u.username.value === normalized || u.email.value === normalized) ??
      null
    );
  }

  listAll(): User[] {
    return [...this.users];
  }

  nextId(): number {
    return this.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  }
}