import type { SessionRepository } from '../domain/ports/SessionRepository';
import type { User } from '../domain/User';
import type { InMemoryUserRepository } from './InMemoryUserRepository';

function hashToken(token: string): string {
  let hash = 5381;
  for (let i = 0; i < token.length; i++) {
    hash = (hash * 33) ^ token.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

interface StoredSession {
  user: User;
  expiresAt: Date;
}

export class InMemorySessionRepository implements SessionRepository {
  private readonly sessions = new Map<string, StoredSession>();

  constructor(private readonly userRepository: InMemoryUserRepository) {}

  create(userId: number, token: string, expiresAt: Date): void {
    const user = this.userRepository.findById(userId);
    if (!user) return;
    this.sessions.set(hashToken(token), { user, expiresAt });
  }

  findUserByToken(token: string): User | null {
    const session = this.sessions.get(hashToken(token));
    if (!session || session.expiresAt.getTime() < Date.now()) return null;
    return session.user;
  }

  deleteByToken(token: string): void {
    this.sessions.delete(hashToken(token));
  }

  deleteAllForUser(userId: number): void {
    for (const [hash, session] of this.sessions) {
      if (session.user.id === userId) {
        this.sessions.delete(hash);
      }
    }
  }
}