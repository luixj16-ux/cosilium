import { Court } from '../../domain/Court';

export const SEED_COURTS_DATA: readonly Court[] = [
  Court.create({ id: 'lopnna', name: 'Tribunales de Protección (LOPNNA)', description: 'Salas de Juicio, Mediación y Sustanciación de Protección de Niños, Niñas y Adolescentes.', category: 'Ley Orgánica LOPNNA', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'penal', name: 'Jurisdicción Penal Ordinaria y Especial', description: 'Tribunales de Control, Juicio y Ejecución Penal. Ciberdelincuencia y Delitos Graves.', category: 'Código Orgánico (COPP)', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'violencia', name: 'Tribunales de Violencia Contra la Mujer', description: 'Juzgados Especiales de Control, Audiencias y Medidas Cautelares de Protección a la Mujer.', category: 'Ley Especial VCM', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'civil', name: 'Tribunales Civiles, Mercantiles y de Tránsito', description: 'Juzgados de Primera Instancia y Municipio. Contratos, Hipotecas y Sociedades Mercantiles.', category: 'Código de Proc. Civil', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'laboral', name: 'Tribunales del Trabajo y Agrarios', description: 'Juzgados de Sustanciación, Mediación y Ejecución Laboral. Reclamos e Indemnizaciones.', category: 'Ley Orgánica (LOTTT)', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'contencioso', name: 'Contencioso Administrativo y Tributario', description: 'Tribunales Superiores Estadales y Nacionales. Recursos de Nulidad y Reparaciones Fiscales.', category: 'Poder Público (LOJCA)', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'tsj_salas', name: 'Salas del Tribunal Supremo de Justicia', description: 'Sala Constitucional, Casación Penal, Casación Civil, Casación Social y Político-Administrativa.', category: 'Máxima Instancia TSJ', jurisdiction: 'Nacional', active: true }),
];

export function buildSeedCourts(): Court[] {
  return [...SEED_COURTS_DATA];
}