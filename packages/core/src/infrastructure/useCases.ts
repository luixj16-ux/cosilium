import type { PortalInMemoryDependencies } from './seed/index';

import { RegisterUserUseCase } from '../application/RegisterUserUseCase';
import { LoginUserUseCase } from '../application/LoginUserUseCase';
import { LogoutUserUseCase } from '../application/LogoutUserUseCase';
import { GetCurrentSessionUseCase } from '../application/GetCurrentSessionUseCase';
import { SetUpAdminPasswordUseCase } from '../application/SetUpAdminPasswordUseCase';
import { PromoteUserUseCase } from '../application/PromoteUserUseCase';
import { ListUsersUseCase } from '../application/ListUsersUseCase';
import { ListCourtsUseCase } from '../application/ListCourtsUseCase';
import { ListCourtCasesUseCase } from '../application/ListCourtCasesUseCase';
import { GetCaseDetailUseCase } from '../application/GetCaseDetailUseCase';
import { CreateCaseUseCase } from '../application/CreateCaseUseCase';
import { AddCaseActuationUseCase } from '../application/AddCaseActuationUseCase';
import { DeleteCaseUseCase } from '../application/DeleteCaseUseCase';
import { SaveSearchRecordUseCase } from '../application/SaveSearchRecordUseCase';
import { ListLegalLawsUseCase } from '../application/ListLegalLawsUseCase';
import { ListLegalNewsUseCase } from '../application/ListLegalNewsUseCase';

export interface PortalUseCases {
  readonly register: RegisterUserUseCase;
  readonly login: LoginUserUseCase;
  readonly logout: LogoutUserUseCase;
  readonly currentSession: GetCurrentSessionUseCase;
  readonly setupAdmin: SetUpAdminPasswordUseCase;
  readonly promote: PromoteUserUseCase;
  readonly listUsers: ListUsersUseCase;
  readonly listCourts: ListCourtsUseCase;
  readonly listCourtCases: ListCourtCasesUseCase;
  readonly getCaseDetail: GetCaseDetailUseCase;
  readonly createCase: CreateCaseUseCase;
  readonly addActuation: AddCaseActuationUseCase;
  readonly deleteCase: DeleteCaseUseCase;
  readonly saveSearch: SaveSearchRecordUseCase;
  readonly listLaws: ListLegalLawsUseCase;
  readonly listNews: ListLegalNewsUseCase;
}

export function createPortalUseCases(deps: PortalInMemoryDependencies): PortalUseCases {
  return {
    register: new RegisterUserUseCase(
      deps.userRepository,
      deps.sessionRepository,
      deps.passwordHasher,
      deps.sessionTokenGenerator,
      deps.auditLog
    ),
    login: new LoginUserUseCase(
      deps.userRepository,
      deps.sessionRepository,
      deps.passwordHasher,
      deps.sessionTokenGenerator,
      deps.auditLog
    ),
    logout: new LogoutUserUseCase(deps.sessionRepository),
    currentSession: new GetCurrentSessionUseCase(deps.sessionRepository),
    setupAdmin: new SetUpAdminPasswordUseCase(deps.userRepository, deps.passwordHasher),
    promote: new PromoteUserUseCase(deps.userRepository, deps.auditLog),
    listUsers: new ListUsersUseCase(deps.userRepository),
    listCourts: new ListCourtsUseCase(deps.courtRepository),
    listCourtCases: new ListCourtCasesUseCase(deps.courtRepository, deps.caseRepository),
    getCaseDetail: new GetCaseDetailUseCase(deps.caseRepository),
    createCase: new CreateCaseUseCase(deps.courtRepository, deps.caseRepository),
    addActuation: new AddCaseActuationUseCase(deps.caseRepository),
    deleteCase: new DeleteCaseUseCase(deps.caseRepository),
    saveSearch: new SaveSearchRecordUseCase(deps.searchRecordRepository),
    listLaws: new ListLegalLawsUseCase(),
    listNews: new ListLegalNewsUseCase()
  };
}