import { LegalCase } from '../../domain/LegalCase';
import { CaseActivity } from '../../domain/CaseActivity';
import type { CaseStatusValue } from '../../domain/CaseStatus';

interface SeedCaseInput {
  publicId: string;
  internalId: number;
  courtId: string;
  docketNumber: string;
  title: string;
  subject: string;
  plaintiff: string;
  defendant: string;
  attorney: string | null;
  amount: number;
  status: string;
  pages: number;
  filedAt: string | null;
  lastActivityAt: string | null;
  actuations: {
    id: number;
    caseId: number;
    activityDate: string;
    activityType: string;
    summary: string;
    signedBy: string;
    pageRange: string | null;
  }[];
}

const CASES_SEED: readonly SeedCaseInput[] = [
  {
    publicId: 'CASE-LOPNNA-1',
    internalId: 1,
    courtId: 'lopnna',
    docketNumber: 'EXP-2026-00101-LOPNNA',
    title: 'CASO DE PATRIA POTESTAD',
    subject: 'Retención indebida de menor',
    plaintiff: 'María López',
    defendant: 'Juan Pérez',
    attorney: null,
    amount: 0,
    status: 'En Trámite',
    pages: 7,
    filedAt: '2026-01-10',
    lastActivityAt: '2026-03-01',
    actuations: [
      { id: 1, caseId: 1, activityDate: '2026-01-15', activityType: 'Apertura del proceso', summary: 'Inicio formal del proceso de patria potestad.', signedBy: 'Secretaría LOPNNA', pageRange: '1-3' },
      { id: 2, caseId: 1, activityDate: '2026-02-10', activityType: 'Cita de conciliación', summary: 'Convocatoria a audiencia de conciliación.', signedBy: 'Secretaría LOPNNA', pageRange: '4-5' },
      { id: 3, caseId: 1, activityDate: '2026-03-01', activityType: 'Auditoría de pruebas', summary: 'Evaluación de pruebas presentadas.', signedBy: 'Juzgado LOPNNA', pageRange: '6-7' },
    ],
  },
  {
    publicId: 'CASE-LOPNNA-2',
    internalId: 2,
    courtId: 'lopnna',
    docketNumber: 'EXP-2026-00102-LOPNNA',
    title: 'ADOPCIÓN INTERNA',
    subject: 'Adopción de menor abandonado',
    plaintiff: 'Carlos Ruiz',
    defendant: 'María González',
    attorney: null,
    amount: 0,
    status: 'Apertura a Prueba',
    pages: 4,
    filedAt: '2026-01-25',
    lastActivityAt: '2026-02-20',
    actuations: [
      { id: 1, caseId: 2, activityDate: '2026-02-01', activityType: 'Inicio del proceso', summary: 'Apertura de expediente de adopción.', signedBy: 'Secretaría LOPNNA', pageRange: '1-2' },
      { id: 2, caseId: 2, activityDate: '2026-02-20', activityType: 'Estudio psicológico', summary: 'Evaluación psicológica de los solicitantes.', signedBy: 'Equipo Técnico', pageRange: '3-4' },
    ],
  },
  {
    publicId: 'CASE-PENAL-1',
    internalId: 3,
    courtId: 'penal',
    docketNumber: 'EXP-2025-00101-PENAL',
    title: 'HURTO AGRAVADO',
    subject: 'Hurto con fuerza en morada',
    plaintiff: 'Estado Venezolano',
    defendant: 'Luis Martínez',
    attorney: null,
    amount: 0,
    status: 'Autos para Sentencia',
    pages: 30,
    filedAt: '2025-06-05',
    lastActivityAt: '2025-10-15',
    actuations: [
      { id: 1, caseId: 3, activityDate: '2025-06-10', activityType: 'Imputación formal', summary: 'Imputación formal al acusado.', signedBy: 'Ministerio Público', pageRange: '1-5' },
      { id: 2, caseId: 3, activityDate: '2025-08-20', activityType: 'Juicio oral', summary: 'Inicio de juicio oral y público.', signedBy: 'Tribunal Penal', pageRange: '6-20' },
      { id: 3, caseId: 3, activityDate: '2025-10-15', activityType: 'Alegatos', summary: 'Alegatos finales de las partes.', signedBy: 'Partes', pageRange: '21-30' },
    ],
  },
  {
    publicId: 'CASE-VCM-1',
    internalId: 4,
    courtId: 'violencia',
    docketNumber: 'EXP-2026-00101-VCM',
    title: 'VIOLENCIA INTRAFAMILIAR',
    subject: 'Medidas de protección por violencia doméstica',
    plaintiff: 'Ana Hernández',
    defendant: 'Pedro Sánchez',
    attorney: null,
    amount: 0,
    status: 'En Trámite',
    pages: 2,
    filedAt: '2026-04-01',
    lastActivityAt: '2026-04-01',
    actuations: [
      { id: 1, caseId: 4, activityDate: '2026-04-01', activityType: 'Medidas cautelares', summary: 'Medidas de protección urgentes.', signedBy: 'Juzgado VCM', pageRange: '1-2' },
    ],
  },
  {
    publicId: 'CASE-CIVIL-1',
    internalId: 5,
    courtId: 'civil',
    docketNumber: 'EXP-2025-00101-CIVIL',
    title: 'DIVORCIO POR CAUSAL',
    subject: 'Disolución de vínculo matrimonial',
    plaintiff: 'Roberto Martínez',
    defendant: 'Laura García',
    attorney: null,
    amount: 0,
    status: 'Sentencia Dictada',
    pages: 8,
    filedAt: '2025-03-10',
    lastActivityAt: '2025-05-10',
    actuations: [
      { id: 1, caseId: 5, activityDate: '2025-03-15', activityType: 'Demanda interpuesta', summary: 'Presentación formal de la demanda.', signedBy: 'Secretaría Civil', pageRange: '1-2' },
      { id: 2, caseId: 5, activityDate: '2025-05-10', activityType: 'Sentencia publicada', summary: 'Sentencia firme de disolución matrimonial.', signedBy: 'Juzgado Civil', pageRange: '7-8' },
    ],
  },
  {
    publicId: 'CASE-LAB-1',
    internalId: 6,
    courtId: 'laboral',
    docketNumber: 'EXP-2026-00101-LABORAL',
    title: 'COBRO DE PRESTACIONES SOCIALES',
    subject: 'Prestaciones sociales impagas',
    plaintiff: 'Pedro López',
    defendant: 'Constructora ABC C.A.',
    attorney: null,
    amount: 0,
    status: 'Apertura a Prueba',
    pages: 6,
    filedAt: '2026-03-15',
    lastActivityAt: '2026-04-05',
    actuations: [
      { id: 1, caseId: 6, activityDate: '2026-03-20', activityType: 'Reclamación previa', summary: 'Reclamación administrativa previa.', signedBy: 'Trabajador', pageRange: '1-3' },
      { id: 2, caseId: 6, activityDate: '2026-04-05', activityType: 'Conciliación obligatoria', summary: 'Audiencia de conciliación.', signedBy: 'Juzgado Laboral', pageRange: '4-6' },
    ],
  },
  {
    publicId: 'CASE-CONT-1',
    internalId: 7,
    courtId: 'contencioso',
    docketNumber: 'EXP-2025-00101-CONT',
    title: 'NULIDAD ADMINISTRATIVA',
    subject: 'Acción de nulidad contra acto administrativo municipal',
    plaintiff: 'Empresa XYZ S.A.',
    defendant: 'Municipio Capital',
    attorney: null,
    amount: 0,
    status: 'Archivado',
    pages: 45,
    filedAt: '2025-01-15',
    lastActivityAt: '2025-09-30',
    actuations: [
      { id: 1, caseId: 7, activityDate: '2025-01-20', activityType: 'Demanda admisida', summary: 'Admisión de la demanda contenciosa.', signedBy: 'Secretaría Contencioso', pageRange: '1-5' },
      { id: 2, caseId: 7, activityDate: '2025-09-30', activityType: 'Sentencia firme', summary: 'Sentencia firme - Archivo del caso.', signedBy: 'Juzgado Contencioso', pageRange: '40-45' },
    ],
  },
  {
    publicId: 'CASE-TSJ-1',
    internalId: 8,
    courtId: 'tsj_salas',
    docketNumber: 'EXP-2026-00101-TSJ',
    title: 'RECURSO DE CASACIÓN CIVIL',
    subject: 'Casación contra sentencia de apelación',
    plaintiff: 'Banco Nacional',
    defendant: 'Grupo Inmobiliario del Sur',
    attorney: null,
    amount: 0,
    status: 'En Trámite',
    pages: 12,
    filedAt: '2026-01-28',
    lastActivityAt: '2026-03-15',
    actuations: [
      { id: 1, caseId: 8, activityDate: '2026-02-01', activityType: 'Recurso admitido', summary: 'Admisión del recurso de casación.', signedBy: 'Sala Civil TSJ', pageRange: '1-10' },
      { id: 2, caseId: 8, activityDate: '2026-03-15', activityType: 'Designación de ponente', summary: 'Asignación de ponente para la ponencia.', signedBy: 'Sala Civil TSJ', pageRange: '11-12' },
    ],
  },
];

export function buildSeedCases(): LegalCase[] {
  return CASES_SEED.map((d) => {
    const actuations = d.actuations.map((a) =>
      CaseActivity.create({
        id: a.id,
        caseId: a.caseId,
        activityDate: a.activityDate,
        activityType: a.activityType,
        summary: a.summary,
        signedBy: a.signedBy,
        pageRange: a.pageRange,
      })
    );
    return LegalCase.create({
      publicId: d.publicId,
      internalId: d.internalId,
      courtId: d.courtId,
      docketNumber: d.docketNumber,
      title: d.title,
      subject: d.subject,
      plaintiff: d.plaintiff,
      defendant: d.defendant,
      attorney: d.attorney,
      amount: d.amount,
      status: d.status as CaseStatusValue,
      pages: d.pages,
      filedAt: d.filedAt,
      lastActivityAt: d.lastActivityAt,
      actuations,
      createdAt: d.filedAt ? new Date(d.filedAt) : new Date(),
    });
  });
}