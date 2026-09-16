import type { UserRepository } from '../../domain/ports/UserRepository';
import type { PasswordHasher } from '../../domain/ports/PasswordHasher';
import type { SessionTokenGenerator } from '../../domain/ports/SessionTokenGenerator';
import type { CourtRepository } from '../../domain/ports/CourtRepository';
import type { CaseRepository } from '../../domain/ports/CaseRepository';
import type { SearchRecordRepository } from '../../domain/ports/SearchRecordRepository';
import type { AuditLog } from '../../domain/ports/AuditLog';

import { InMemoryUserRepository } from '../InMemoryUserRepository';
import { InMemorySessionRepository } from '../InMemorySessionRepository';
import { InMemoryCourtRepository } from '../InMemoryCourtRepository';
import { InMemoryCaseRepository } from '../InMemoryCaseRepository';
import { InMemorySearchRecordRepository } from '../InMemorySearchRecordRepository';
import { InMemoryAuditLog } from '../InMemoryAuditLog';
import { InMemoryPasswordHasher } from '../InMemoryPasswordHasher';
import { CryptoRandomTokenGenerator } from '../CryptoRandomTokenGenerator';

import { User } from '../../domain/User';

import { buildSeedCourts } from './courts';
import { buildSeedCases } from './cases';

export interface PortalInMemoryDependencies {
  readonly userRepository: UserRepository;
  readonly passwordHasher: PasswordHasher;
  readonly sessionTokenGenerator: SessionTokenGenerator;
  readonly sessionRepository: InMemorySessionRepository;
  readonly courtRepository: CourtRepository;
  readonly caseRepository: CaseRepository;
  readonly searchRecordRepository: SearchRecordRepository;
  readonly auditLog: AuditLog;
}

export function buildPortalInMemoryDependencies(): PortalInMemoryDependencies {
  const passwordHasher = new InMemoryPasswordHasher();
  const userRepository = new InMemoryUserRepository();
  const sessionRepository = new InMemorySessionRepository(userRepository);

  const admin = User.create({
    id: 1,
    username: 'admin',
    fullName: 'Administrador',
    email: 'admin@tsj.test',
    role: 'public',
    passwordHash: passwordHasher.hash('admin123'),
    active: true,
  });
  admin.promoteToAdmin();
  userRepository.save(admin);

  const courtRepository = new InMemoryCourtRepository(buildSeedCourts());
  const caseRepository = new InMemoryCaseRepository(buildSeedCases());

  return {
    userRepository,
    passwordHasher,
    sessionTokenGenerator: new CryptoRandomTokenGenerator(),
    sessionRepository,
    courtRepository,
    caseRepository,
    searchRecordRepository: new InMemorySearchRecordRepository(),
    auditLog: new InMemoryAuditLog(),
  };
}