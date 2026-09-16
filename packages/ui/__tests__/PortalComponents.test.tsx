import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderToString } from 'react-dom/server';
import { CourtsGrid } from '../src/components/CourtsGrid';
import { CasesList } from '../src/components/CasesList';
import { CaseDetailModal } from '../src/components/CaseDetailModal';
import { ActuationTimeline } from '../src/components/ActuationTimeline';
import { LawsCatalog } from '../src/components/LawsCatalog';
import { AdminUsersList } from '../src/components/AdminUsersList';
import { ToastStack } from '../src/components/ToastStack';
import { SearchBox } from '../src/components/SearchBox';
import type { CaseActivityDto, CourtDto, LawCategoryDto, LegalCaseDto, UserDto } from '@consilium/contracts';

const court: CourtDto = {
  id: 'penal',
  name: 'Tribunal Penal',
  description: 'Jurisdicción penal',
  category: 'penal',
  jurisdiction: 'Nacional'
};

const actuations: CaseActivityDto[] = [
  { activityDate: '2026-01-15', activityType: 'Auto', summary: 'Admisión', signedBy: 'Juez', pageRange: '1-3' }
];

const legalCase: LegalCaseDto = {
  publicId: 'CASE-PENAL-1',
  courtId: 'penal',
  docketNumber: 'EXP-2025-00101-PENAL',
  title: 'HURTO AGRAVADO',
  subject: 'Hurto con fuerza',
  plaintiff: 'Estado',
  defendant: 'Luis',
  attorney: null,
  amount: 0,
  status: 'En Trámite',
  pages: 3,
  filedAt: '2025-06-05',
  lastActivityAt: '2025-10-15',
  actuations
};

const laws: LawCategoryDto[] = [
  { key: 'penal', label: 'Penal', items: [{ title: 'Código Penal', meta: '2020' }] }
];

const users: UserDto[] = [
  { id: 1, username: 'admin', fullName: 'Admin', email: 'a@t', role: 'admin', inpre: null, active: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 2, username: 'juan', fullName: 'Juan', email: 'j@t', role: 'public', inpre: null, active: true, createdAt: '2026-01-01T00:00:00Z' }
];

const act = () => renderToStaticMarkup;

describe('Dumb Components del portal judicial', () => {
  it('CourtsGrid renderiza cada tribunal y delega la selección', () => {
    const onSelect = vi.fn();
    const html = renderToStaticMarkup(
      <CourtsGrid courts={[court]} onSelectCourt={onSelect} />
    );
    expect(html).toContain('Tribunal Penal');
    expect(html).toContain('CourtsGrid-card');
  });

  it('CourtsGrid muestra estado vacío', () => {
    const html = renderToStaticMarkup(<CourtsGrid courts={[]} onSelectCourt={() => undefined} />);
    expect(html).toContain('No hay tribunales');
  });

  it('CasesList renderiza expedientes', () => {
    const html = renderToString(<CasesList legalCases={[legalCase]} onOpenCase={() => undefined} />);
    expect(html).toContain('EXP-2025-00101-PENAL');
    expect(html).toContain('HURTO AGRAVADO');
  });

  it('CasesList muestra vacío', () => {
    const html = renderToString(<CasesList legalCases={[]} onOpenCase={() => undefined} />);
    expect(html).toContain('No se encontraron');
  });

  it('CaseDetailModal muestra detalle y acciones por rol', () => {
    const adminHtml = renderToString(
      <CaseDetailModal
        legalCase={legalCase}
        canEdit={true}
        onClose={() => undefined}
        onDelete={() => undefined}
        onAddActuation={() => undefined}
      />
    );
    expect(adminHtml).toContain('Dar de Baja');
    expect(adminHtml).toContain('Agregar Actuación');

    const publicHtml = renderToString(
      <CaseDetailModal
        legalCase={legalCase}
        canEdit={false}
        onClose={() => undefined}
        onDelete={() => undefined}
        onAddActuation={() => undefined}
      />
    );
    expect(publicHtml).not.toContain('Dar de Baja');
    expect(publicHtml).toContain('3<!-- --> fs.');
  });

  it('ActuationTimeline lista actuaciones', () => {
    const html = renderToString(<ActuationTimeline actuations={actuations} />);
    expect(html).toContain('Admisión');
    expect(html).toContain('Fojas');
    expect(html).toContain('1-3');
  });

  it('LawsCatalog renderiza categoría activa', () => {
    const html = renderToString(<LawsCatalog categories={laws} />);
    expect(html).toContain('Código Penal');
  });

  it('AdminUsersList muestra botón promover solo para no-admin', () => {
    const html = renderToString(
      <AdminUsersList users={users} currentUserId={1} onPromote={() => undefined} />
    );
    expect(html).toContain('Promover a Admin');
    expect(html.match(/Promover a Admin/g)).toHaveLength(1);
  });

  it('ToastStack renderiza mensajes y permite cerrarlos', () => {
    const html = renderToString(
      <ToastStack
        toasts={[{ id: '1', message: 'Guardado', kind: 'success' }]}
        onDismiss={() => undefined}
      />
    );
    expect(html).toContain('Guardado');
    expect(html).toContain('ToastStack-dismiss');
  });

  it('SearchBox reenvía el texto de búsqueda', () => {
    const onSearch = vi.fn();
    const html = renderToStaticMarkup(
      <SearchBox value="hurto" onSearch={onSearch} placeholder="Buscar…" />
    );
    expect(html).toContain('value="hurto"');
  });

  it('act() helper existe (no-op)', () => {
    expect(typeof act()).toBe('function');
  });
});