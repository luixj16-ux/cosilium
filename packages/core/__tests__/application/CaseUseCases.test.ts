import { describe, it, expect } from 'vitest';
import { ListCourtsUseCase } from '../../src/application/ListCourtsUseCase';
import { ListCourtCasesUseCase } from '../../src/application/ListCourtCasesUseCase';
import { GetCaseDetailUseCase } from '../../src/application/GetCaseDetailUseCase';
import { CreateCaseUseCase } from '../../src/application/CreateCaseUseCase';
import { AddCaseActuationUseCase } from '../../src/application/AddCaseActuationUseCase';
import { DeleteCaseUseCase } from '../../src/application/DeleteCaseUseCase';
import { SaveSearchRecordUseCase } from '../../src/application/SaveSearchRecordUseCase';
import { ListLegalLawsUseCase } from '../../src/application/ListLegalLawsUseCase';
import { ListLegalNewsUseCase } from '../../src/application/ListLegalNewsUseCase';
import { NotFoundError, ForbiddenError, UnauthorizedError } from '../../src/application/errors';
import { User } from '../../src/domain/User';
import { InMemoryCourtRepository } from '../../src/infrastructure/InMemoryCourtRepository';
import { InMemoryCaseRepository } from '../../src/infrastructure/InMemoryCaseRepository';
import { InMemorySearchRecordRepository } from '../../src/infrastructure/InMemorySearchRecordRepository';
import { buildSeedCourts } from '../../src/infrastructure/seed/courts';
import { buildSeedCases } from '../../src/infrastructure/seed/cases';

function adminUser(): User {
  return User.create({ id: 1, username: 'admin', fullName: 'Admin', email: 'admin@tsj.test', role: 'admin' });
}

function publicUser(): User {
  return User.create({ id: 2, username: 'juan.perez', fullName: 'Juan Pérez', email: 'j@test.com', role: 'public' });
}

const courts = () => new InMemoryCourtRepository(buildSeedCourts());
const cases = () => new InMemoryCaseRepository(buildSeedCases());

describe('ListCourtsUseCase', () => {
  it('Devuelve los 7 tribunales', () => {
    const uc = new ListCourtsUseCase(courts());
    expect(uc.execute().length).toBe(7);
  });
});

describe('ListCourtCasesUseCase', () => {
  it('Exige sesión autenticada', () => {
    const uc = new ListCourtCasesUseCase(courts(), cases());
    expect(() => uc.execute({ actor: null, courtId: 'lopnna' })).toThrow(UnauthorizedError);
  });

  it('Lanza NotFound si el tribunal no existe', () => {
    const uc = new ListCourtCasesUseCase(courts(), cases());
    expect(() => uc.execute({ actor: publicUser(), courtId: 'no-existe' })).toThrow(NotFoundError);
  });

  it('Filtra causas por tribunal', () => {
    const uc = new ListCourtCasesUseCase(courts(), cases());
    const lopnna = uc.execute({ actor: publicUser(), courtId: 'lopnna' });
    expect(lopnna.length).toBe(2);
  });

  it('Filtra por término de búsqueda', () => {
    const uc = new ListCourtCasesUseCase(courts(), cases());
    const penal = uc.execute({ actor: publicUser(), courtId: 'penal', filterTerm: 'hurto' });
    expect(penal.length).toBe(1);
    expect(penal[0]!.docketNumber).toBe('EXP-2025-00101-PENAL');
  });

  it('Devuelve todas las causas si el término está vacío', () => {
    const uc = new ListCourtCasesUseCase(courts(), cases());
    expect(uc.execute({ actor: publicUser(), courtId: 'civil', filterTerm: '  ' }).length).toBe(1);
  });
});

describe('GetCaseDetailUseCase', () => {
  it('Exige sesión autenticada', () => {
    const uc = new GetCaseDetailUseCase(cases());
    expect(() => uc.execute({ actor: null, publicId: 'CASE-LOPNNA-1' })).toThrow(UnauthorizedError);
  });

  it('Obtiene el detalle por publicId', () => {
    const uc = new GetCaseDetailUseCase(cases());
    const c = uc.execute({ actor: publicUser(), publicId: 'CASE-LOPNNA-1' });
    expect(c.docketNumber).toBe('EXP-2026-00101-LOPNNA');
    expect(c.actuations.length).toBe(3);
  });

  it('Lanza NotFound si no existe', () => {
    const uc = new GetCaseDetailUseCase(cases());
    expect(() => uc.execute({ actor: publicUser(), publicId: 'NOPE' })).toThrow(NotFoundError);
  });
});

describe('CreateCaseUseCase', () => {
  it('Solo admin puede crear causas', () => {
    const uc = new CreateCaseUseCase(courts(), cases());
    expect(() =>
      uc.execute({
        actor: publicUser(),
        courtId: 'penal',
        title: 'Nueva',
        subject: 'Nueva causa',
        plaintiff: 'A',
        defendant: 'B',
      })
    ).toThrow(ForbiddenError);
  });

  it('Crea causa con docket numérico y actuación inicial', () => {
    const repo = cases();
    const uc = new CreateCaseUseCase(courts(), repo);
    const created = uc.execute({
      actor: adminUser(),
      courtId: 'penal',
      title: ' Estafa  ',
      subject: 'Estafa bancaria',
      plaintiff: 'Banco X',
      defendant: 'Luis',
      attorney: 'Ab. Rojas',
    });
    expect(created.docketNumber).toBe('EXP-2026-00102-PENAL');
    expect(created.title).toBe('ESTAFA');
    expect(created.actuations).toHaveLength(1);
    expect(repo.findByPublicId(created.publicId)?.title).toBe('ESTAFA');
  });

  it('Lanza NotFound si el tribunal no existe', () => {
    const uc = new CreateCaseUseCase(courts(), cases());
    expect(() =>
      uc.execute({ actor: adminUser(), courtId: 'inexistente', title: 'X', subject: 'X', plaintiff: 'A', defendant: 'B' })
    ).toThrow(NotFoundError);
  });
});

describe('AddCaseActuationUseCase', () => {
  it('Solo admin puede añadir actuaciones', () => {
    const uc = new AddCaseActuationUseCase(cases());
    expect(() =>
      uc.execute({ actor: publicUser(), publicId: 'CASE-LOPNNA-1', activityType: 'Auto', summary: 'X', signedBy: 'Juez' })
    ).toThrow(ForbiddenError);
  });

  it('Añade actuación y avanza páginas', () => {
    const repo = cases();
    const uc = new AddCaseActuationUseCase(repo);
    const updated = uc.execute({
      actor: adminUser(),
      publicId: 'CASE-LOPNNA-1',
      activityType: 'Auto de admisión',
      summary: 'Nueva actuación de prueba',
      signedBy: 'Juez',
    });
    expect(updated.getTotalActuations()).toBe(4);
    expect(updated.pages).toBe(9);
  });

  it('Lanza NotFound si el expediente no existe', () => {
    const uc = new AddCaseActuationUseCase(cases());
    expect(() => uc.execute({ actor: adminUser(), publicId: 'NOPE', activityType: 'X', summary: 'X', signedBy: 'Juez' })).toThrow(NotFoundError);
  });
});

describe('DeleteCaseUseCase', () => {
  it('Solo admin puede eliminar', () => {
    const uc = new DeleteCaseUseCase(cases());
    expect(() => uc.execute({ actor: publicUser(), publicId: 'CASE-LOPNNA-1' })).toThrow(ForbiddenError);
  });

  it('Elimina el expediente', () => {
    const repo = cases();
    const uc = new DeleteCaseUseCase(repo);
    uc.execute({ actor: adminUser(), publicId: 'CASE-LOPNNA-1' });
    expect(repo.findByPublicId('CASE-LOPNNA-1')).toBeNull();
  });

  it('Lanza NotFound si no existe', () => {
    const uc = new DeleteCaseUseCase(cases());
    expect(() => uc.execute({ actor: adminUser(), publicId: 'NOPE' })).toThrow(NotFoundError);
  });
});

describe('SaveSearchRecordUseCase', () => {
  it('Exige actor autenticado', () => {
    const uc = new SaveSearchRecordUseCase(new InMemorySearchRecordRepository());
    expect(() => uc.execute({ actor: undefined as unknown as User, query: 'hurto' })).toThrow(UnauthorizedError);
  });

  it('Guarda el registro de búsqueda', () => {
    const repo = new InMemorySearchRecordRepository();
    const uc = new SaveSearchRecordUseCase(repo);
    uc.execute({ actor: publicUser(), query: 'hurto', courtId: 'penal', resultCount: 1 });
    expect(repo.nextId()).toBe(2);
  });
});

describe('Catálogos de leyes y noticias', () => {
  it('ListLegalLawsUseCase devuelve las categorías', () => {
    const laws = new ListLegalLawsUseCase().execute();
    expect(laws.length).toBeGreaterThan(0);
    expect(laws.some((c) => c.items.length > 0)).toBe(true);
  });

  it('ListLegalNewsUseCase devuelve las noticias', () => {
    const news = new ListLegalNewsUseCase().execute();
    expect(news.length).toBeGreaterThan(0);
    expect(news[0]!.title.length).toBeGreaterThan(0);
  });
});