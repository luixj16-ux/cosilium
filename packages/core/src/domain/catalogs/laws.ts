import type { LegalLawCategory } from '../LegalLaw';

export const VENEZUELAN_LAWS: LegalLawCategory[] = [
  {
    key: 'constitucional',
    label: 'Constitucional',
    items: [
      { title: 'Constitución de la República Bolivariana de Venezuela', meta: 'CRBV • Art. 1-188' },
      { title: 'Ley Orgánica del Poder Electoral', meta: 'LOPE • Art. 1-220' },
      { title: 'Ley Orgánica de Procesos Electorales', meta: 'LOPE • Art. 1-290' }
    ]
  },
  {
    key: 'civil',
    label: 'Civil y Mercantil',
    items: [
      { title: 'Código Civil', meta: 'C.C. • Art. 1-1.200' },
      { title: 'Código de Comercio', meta: 'C. Comercio • Art. 1-890' },
      { title: 'Ley de Propiedad Horizontal', meta: 'LPH • Art. 1-140' }
    ]
  },
  {
    key: 'penal',
    label: 'Penal',
    items: [
      { title: 'Código Orgánico Procesal Penal', meta: 'COPP • Art. 1-500' },
      { title: 'Ley contra la Corrupción', meta: 'LCC • Art. 1-180' },
      { title: 'Ley de Delitos Informáticos', meta: 'LDI • Art. 1-160' }
    ]
  },
  {
    key: 'laboral',
    label: 'Laboral',
    items: [
      { title: 'Ley Orgánica del Trabajo', meta: 'LOT • Art. 1-280' },
      { title: 'Ley del Estatuto del Trabajo', meta: 'LETT • Art. 1-320' },
      { title: 'Ley de Seguridad Social', meta: 'LSS • Art. 1-260' }
    ]
  },
  {
    key: 'administrativo',
    label: 'Administrativo',
    items: [
      { title: 'Ley Orgánica de Procedimientos Administrativos', meta: 'LOPA • Art. 1-240' },
      { title: 'Ley de Contrataciones Públicas', meta: 'LCP • Art. 1-200' },
      { title: 'Ley Orgánica de la Administración Pública', meta: 'LOAP • Art. 1-180' }
    ]
  }
];