import { Court } from '../../domain/Court';

export const SEED_COURTS_DATA: readonly Court[] = [
  Court.create({ id: 'lopnna', name: 'Tribunal de Protección de Niños, Niñas y Adolescentes', description: 'Jurisdicción especializada en protección de menores.', category: 'especial', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'penal', name: 'Tribunal Penal', description: 'Jurisdicción penal ordinaria.', category: 'penal', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'violencia', name: 'Tribunal de Violencia contra la Mujer', description: 'Jurisdicción especializada en violencia de género.', category: 'especial', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'civil', name: 'Tribunal Civil, Mercantil y del Tránsito', description: 'Jurisdicción civil, mercantil y tránsito.', category: 'civil', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'laboral', name: 'Tribunal del Trabajo', description: 'Jurisdicción laboral.', category: 'laboral', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'contencioso', name: 'Tribunal Contencioso Administrativo', description: 'Contencioso administrativo.', category: 'contencioso', jurisdiction: 'Nacional', active: true }),
  Court.create({ id: 'tsj_salas', name: 'Salas del Tribunal Supremo de Justicia', description: 'Máximo tribunal del país.', category: 'supremo', jurisdiction: 'Nacional', active: true }),
];

export function buildSeedCourts(): Court[] {
  return [...SEED_COURTS_DATA];
}