/**
 * ==========================================================================
 * SISTEMA DE GESTIÓN JUDICIAL - TRIBUNAL SUPREMO DE JUSTICIA (TSJ)
 * Lógica de Tribunales Venezolanos & Emblemas Realistas Vectoriales
 * ==========================================================================
 */

// ESTADO GLOBAL
const TSJ_STATE = {
    currentView: 'courts', // 'courts' | 'court-cases' | 'new-case'
    currentCourtId: null,
    userRole: 'public', // 'public' (por defecto) | 'admin'
    theme: 'light',
    activeCaseId: null,
    courts: [
        {
            id: 'lopnna',
            title: 'Tribunales de Protección (LOPNNA)',
            desc: 'Salas de Juicio, Mediación y Sustanciación de Protección de Niños, Niñas y Adolescentes.',
            category: 'Ley Orgánica LOPNNA',
            tags: ['Manutención', 'Régimen de Visitas', 'Colocación Familiar', 'Patria Potestad'],
            svgEmblem: `
        <svg viewBox="0 0 100 100" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47" fill="#092C53" stroke="#D4AF37" stroke-width="2.5"/>
          <circle cx="50" cy="50" r="40" fill="#0D47A1" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3 2"/>
          <!-- Manos Protectoras Doradas -->
          <path d="M22 66 C22 46 36 34 50 34 C64 34 78 46 78 66 C70 76 30 76 22 66 Z" fill="#C59B27" opacity="0.25"/>
          <path d="M24 64 C28 44 42 36 50 44 C58 36 72 44 76 64 C64 72 36 72 24 64 Z" fill="#D4AF37"/>
          <!-- Silueta Familia / Niño Protegido -->
          <circle cx="50" cy="30" r="7" fill="#FFFFFF"/>
          <circle cx="38" cy="36" r="5.5" fill="#FFFFFF" opacity="0.9"/>
          <circle cx="62" cy="36" r="5.5" fill="#FFFFFF" opacity="0.9"/>
          <!-- Balanza de Protección -->
          <path d="M40 76 L60 76 M50 68 L50 76" stroke="#D4AF37" stroke-width="2"/>
          <circle cx="50" cy="68" r="2.5" fill="#D4AF37"/>
        </svg>
      `
        },
        {
            id: 'penal',
            title: 'Jurisdicción Penal Ordinaria y Especial',
            desc: 'Tribunales de Control, Juicio y Ejecución Penal. Ciberdelincuencia y Delitos Graves.',
            category: 'Código Orgánico (COPP)',
            tags: ['Control de Garantías', 'Juicio Oral', 'Delitos Informáticos', 'Ejecución Penal'],
            svgEmblem: `
        <svg viewBox="0 0 100 100" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47" fill="#061C38" stroke="#D4AF37" stroke-width="2.5"/>
          <!-- Escudo Táctico de Acero y Oro -->
          <path d="M50 16 C32 16 24 24 24 42 C24 68 50 82 50 82 C50 82 76 68 76 42 C76 24 68 16 50 16 Z" fill="#0D47A1" stroke="#D4AF37" stroke-width="2"/>
          <!-- Espada de la Ley Cruzada -->
          <line x1="28" y1="28" x2="72" y2="72" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
          <line x1="32" y1="24" x2="24" y2="32" stroke="#D4AF37" stroke-width="3"/>
          <circle x="72" y="72" r="3" fill="#D4AF37"/>
          <!-- Mazo Judicial (Gavel) -->
          <line x1="72" y1="28" x2="28" y2="72" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
          <rect x="62" y="22" width="16" height="10" rx="3" fill="#C59B27" stroke="#FFFFFF" stroke-width="1.2" transform="rotate(45 70 27)"/>
          <!-- Balanza Central -->
          <circle cx="50" cy="50" r="6" fill="#D4AF37"/>
        </svg>
      `
        },
        {
            id: 'violencia',
            title: 'Tribunales de Violencia Contra la Mujer',
            desc: 'Juzgados Especiales de Control, Audiencias y Medidas Cautelares de Protección a la Mujer.',
            category: 'Ley Especial VCM',
            tags: ['Medidas de Protección', 'Violencia Psicológica', 'Feminicidio', 'Medidas Cautelares'],
            svgEmblem: `
        <svg viewBox="0 0 100 100" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47" fill="#3B0764" stroke="#D4AF37" stroke-width="2.5"/>
          <circle cx="50" cy="50" r="40" fill="#581C87" stroke="#F3E8FF" stroke-width="1"/>
          <!-- Lazo / Flor de Protección Púrpura y Oro -->
          <path d="M50 18 C38 18 30 28 30 42 C30 62 50 78 50 78 C50 78 70 62 70 42 C70 28 62 18 50 18 Z" fill="#7E22CE" stroke="#D4AF37" stroke-width="1.8"/>
          <!-- Silueta Femenina y Símbolo de Equidad -->
          <circle cx="50" cy="38" r="9" fill="#FFFFFF"/>
          <path d="M38 60 C38 48 44 44 50 44 C56 44 62 48 62 60 Z" fill="#FFFFFF"/>
          <circle cx="50" cy="80" r="3" fill="#D4AF37"/>
          <line x1="50" y1="74" x2="50" y2="86" stroke="#D4AF37" stroke-width="2"/>
          <line x1="44" y1="80" x2="56" y2="80" stroke="#D4AF37" stroke-width="2"/>
        </svg>
      `
        },
        {
            id: 'civil',
            title: 'Tribunales Civiles, Mercantiles y de Tránsito',
            desc: 'Juzgados de Primera Instancia y Municipio. Contratos, Hipotecas y Sociedades Mercantiles.',
            category: 'Código de Proc. Civil',
            tags: ['Cobro de Bolívares', 'Hipotecas', 'Sociedades Mercantiles', 'Tránsito'],
            svgEmblem: `
        <svg viewBox="0 0 100 100" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47" fill="#092C53" stroke="#D4AF37" stroke-width="2.5"/>
          <!-- Frontispicio y Columnas Romanas Clásicas -->
          <polygon points="50,18 20,32 80,32" fill="#D4AF37" stroke="#FFFFFF" stroke-width="1"/>
          <rect x="24" y="32" width="52" height="4" fill="#C59B27"/>
          <!-- 4 Columnas -->
          <rect x="28" y="36" width="6" height="34" fill="#FFFFFF"/>
          <rect x="42" y="36" width="6" height="34" fill="#FFFFFF"/>
          <rect x="52" y="36" width="6" height="34" fill="#FFFFFF"/>
          <rect x="66" y="36" width="6" height="34" fill="#FFFFFF"/>
          <!-- Base -->
          <rect x="20" y="70" width="60" height="6" fill="#D4AF37"/>
          <rect x="16" y="76" width="68" height="4" fill="#C59B27"/>
          <!-- Pergamino con Sello de Lacre -->
          <circle cx="50" cy="52" r="7" fill="#DC2626" stroke="#D4AF37" stroke-width="1.5"/>
        </svg>
      `
        },
        {
            id: 'laboral',
            title: 'Tribunales del Trabajo y Agrarios',
            desc: 'Juzgados de Sustanciación, Mediación y Ejecución Laboral. Reclamos e Indemnizaciones.',
            category: 'Ley Orgánica (LOTTT)',
            tags: ['Prestaciones Sociales', 'Calificación de Despido', 'Juicio Laboral', 'Agrario'],
            svgEmblem: `
        <svg viewBox="0 0 100 100" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47" fill="#061C38" stroke="#D4AF37" stroke-width="2.5"/>
          <!-- Engranaje Industrial Dorado -->
          <circle cx="50" cy="50" r="32" fill="#0D47A1" stroke="#D4AF37" stroke-width="3" stroke-dasharray="14 5"/>
          <circle cx="50" cy="50" r="22" fill="#092C53" stroke="#D4AF37" stroke-width="2"/>
          <!-- Espiga de Trigo / Campo Agrario -->
          <path d="M40 76 C40 46 50 30 60 22" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
          <circle cx="58" cy="24" r="3" fill="#D4AF37"/>
          <circle cx="52" cy="32" r="3" fill="#D4AF37"/>
          <circle cx="48" cy="42" r="3" fill="#D4AF37"/>
          <circle cx="44" cy="54" r="3" fill="#D4AF37"/>
          <!-- Balanza de la Justicia Social -->
          <rect x="48" y="34" width="4" height="26" fill="#FFFFFF"/>
          <line x1="34" y1="40" x2="66" y2="40" stroke="#FFFFFF" stroke-width="2"/>
        </svg>
      `
        },
        {
            id: 'contencioso',
            title: 'Contencioso Administrativo y Tributario',
            desc: 'Tribunales Superiores Estadales y Nacionales. Recursos de Nulidad y Reparaciones Fiscales.',
            category: 'Poder Público (LOJCA)',
            tags: ['Nulidad de Actos', 'Reparos Tributarios', 'Contratos Públicos', 'SENIAT'],
            svgEmblem: `
        <svg viewBox="0 0 100 100" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47" fill="#092C53" stroke="#D4AF37" stroke-width="2.5"/>
          <!-- Capitolio / Cúpula del Estado -->
          <path d="M50 18 C32 18 28 32 28 42 L72 42 C72 32 68 18 50 18 Z" fill="#D4AF37"/>
          <circle cx="50" cy="14" r="3" fill="#FFFFFF"/>
          <!-- Columnas del Palacio de Justicia -->
          <rect x="30" y="44" width="40" height="4" fill="#C59B27"/>
          <rect x="32" y="48" width="5" height="24" fill="#FFFFFF"/>
          <rect x="42" y="48" width="5" height="24" fill="#FFFFFF"/>
          <rect x="53" y="48" width="5" height="24" fill="#FFFFFF"/>
          <rect x="63" y="48" width="5" height="24" fill="#FFFFFF"/>
          <rect x="26" y="72" width="48" height="6" fill="#D4AF37"/>
          <!-- Escudo de Control Fiscal -->
          <circle cx="50" cy="60" r="6" fill="#0D47A1" stroke="#D4AF37" stroke-width="1.5"/>
        </svg>
      `
        },
        {
            id: 'tsj_salas',
            title: 'Salas del Tribunal Supremo de Justicia',
            desc: 'Sala Constitucional, Casación Penal, Casación Civil, Casación Social y Político-Administrativa.',
            category: 'Máxima Instancia TSJ',
            tags: ['Recurso de Casación', 'Interpretación Constitucional', 'Avocamiento', 'Plenaria'],
            svgEmblem: `
        <svg viewBox="0 0 100 100" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47" fill="#061C38" stroke="#D4AF37" stroke-width="3"/>
          <circle cx="50" cy="50" r="40" fill="#0D47A1" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="3 1.5"/>
          <!-- Códice Constitucional con Sello de Oro -->
          <rect x="34" y="24" width="32" height="44" rx="3" fill="#FFFFFF" stroke="#D4AF37" stroke-width="2"/>
          <line x1="40" y1="32" x2="60" y2="32" stroke="#092C53" stroke-width="2"/>
          <line x1="40" y1="40" x2="60" y2="40" stroke="#092C53" stroke-width="2"/>
          <line x1="40" y1="48" x2="54" y2="48" stroke="#092C53" stroke-width="2"/>
          <!-- 8 Estrellas Doradas TSJ -->
          <circle cx="50" cy="58" r="5" fill="#D4AF37"/>
          <polygon points="50,74 52,78 57,78 53,81 55,86 50,83 45,86 47,81 43,78 48,78" fill="#D4AF37"/>
        </svg>
      `
        }
    ],
    cases: []
};

// BASE DE DATOS DE EXPEDIENTES POR TRIBUNALES VENEZOLANOS
const INITIAL_TSJ_CASES = [
    // LOPNNA
    {
        id: 'CASE-LOPNNA-1',
        courtId: 'lopnna',
        nue: 'EXP-2026-00104-LOPNNA',
        caratula: 'PÉREZ, MARÍA C/ RAMÍREZ, JUAN S/ RÉGIMEN DE CONVIVENCIA FAMILIAR Y OBLIGACIÓN DE MANUTENCIÓN',
        juzgado: 'Tribunal Primero de Primera Instancia de Protección LOPNNA (Área Metropolitana)',
        objeto: 'Fijación de Cuota de Manutención y Régimen de Visitas',
        actor: 'María Pérez (C.I. V-18.450.210)',
        demandado: 'Juan Ramírez (C.I. V-16.890.114)',
        letrado: 'Dra. Carmen Silva (INPREABOGADO N° 45.120)',
        monto: 0,
        estado: 'En Trámite',
        fojas: 84,
        fecha: '2026-08-28',
        actuaciones: [
            { fecha: '12/03/2026', tipo: 'Demanda Inicial LOPNNA', texto: 'Presentación formal de solicitud de alimentos y convivencia familiar.', firmante: 'Dra. Carmen Silva', fojas: '1-20' },
            { fecha: '25/03/2026', tipo: 'Medida Cautelar de Manutención', texto: 'Fíjase cuota provisional de manutención del 30% del ingreso mensual.', firmante: 'Juez de Protección LOPNNA', fojas: '21-28' },
            { fecha: '28/08/2026', tipo: 'Informe de Equipo Multidisciplinario', texto: 'Presentación de informe psicológico y social del núcleo familiar.', firmante: 'Lic. Psicología Forense TSJ', fojas: '29-84' }
        ]
    },
    {
        id: 'CASE-LOPNNA-2',
        courtId: 'lopnna',
        nue: 'EXP-2026-00188-LOPNNA',
        caratula: 'CONSEJO DE PROTECCIÓN S/ MEDIDA DE ABRIGO Y COLOCACIÓN FAMILIAR DE N.N.',
        juzgado: 'Tribunal Segundo de Mediación y Sustanciación LOPNNA',
        objeto: 'Homologación de Medida de Protección de Abrigo',
        actor: 'Consejo Municipal de Protección de Niños y Adolescentes',
        demandado: 'Progenitores de Origen',
        letrado: 'Defensor Público de Niños, Niñas y Adolescentes',
        monto: 0,
        estado: 'Autos para Sentencia',
        fojas: 140,
        fecha: '2026-08-30',
        actuaciones: [
            { fecha: '10/01/2026', tipo: 'Medida de Abrigo', texto: 'Remisión de expediente administrativo con solicitud de colocación familiar sustituta.', firmante: 'Consejero de Protección', fojas: '1-45' },
            { fecha: '30/08/2026', tipo: 'Pase a Sentencia', texto: 'Autos para decisión de homologación de colocación definitiva.', firmante: 'Juez de Protección', fojas: '120-140' }
        ]
    },

    // PENAL
    {
        id: 'CASE-PENAL-1',
        courtId: 'penal',
        nue: 'EXP-2026-00215-PENAL',
        caratula: 'MINISTERIO PÚBLICO C/ GÓMEZ, LUIS S/ DELITOS INFORMÁTICOS Y DEFRAUDACIÓN BANCARIA',
        juzgado: 'Juzgado Tercero de Primera Instancia en Funciones de Control Penal',
        objeto: 'Acceso Indebido y Fraude Electrónico',
        actor: 'Ministerio Público (Fiscalía 8° con Competencia en Delitos Informáticos)',
        demandado: 'Luis Gómez (C.I. V-22.104.990)',
        letrado: 'Dr. Roberto Mendoza (Defensor Público)',
        monto: 18500000,
        estado: 'Apertura a Prueba',
        fojas: 260,
        fecha: '2026-08-31',
        actuaciones: [
            { fecha: '14/02/2026', tipo: 'Acusación Fiscal', texto: 'Presentación formal de acusación por vulneración de sistemas y desvío de fondos.', firmante: 'Fiscalía 8° TSJ', fojas: '1-60' },
            { fecha: '20/05/2026', tipo: 'Audiencia Preliminar', texto: 'Admisión total de la acusación fiscal y auto de apertura a juicio oral.', firmante: 'Juez de Control Penal', fojas: '61-110' },
            { fecha: '31/08/2026', tipo: 'Prueba Digital Incorporada', texto: 'Informe de extracción de evidencia digital y trazabilidad de cuentas.', firmante: 'División contra Delitos Informáticos', fojas: '111-260' }
        ]
    },

    // VIOLENCIA CONTRA LA MUJER
    {
        id: 'CASE-VIOLENCIA-1',
        courtId: 'violencia',
        nue: 'EXP-2026-00302-VCM',
        caratula: 'MINISTERIO PÚBLICO C/ MORALES, PEDRO S/ VIOLENCIA PSICOLÓGICA Y AMENAZAS',
        juzgado: 'Tribunal Especial Primero de Primera Instancia en Funciones de Control y Audiencias VCM',
        objeto: 'Medidas de Protección y Seguridad a la Víctima',
        actor: 'Ministerio Público (Fiscalía 45° VCM) / Víctima Ciudadana',
        demandado: 'Pedro Morales (C.I. V-15.320.100)',
        letrado: 'Dra. Sonia Delgado (Abogada Privada)',
        monto: 0,
        estado: 'En Trámite',
        fojas: 95,
        fecha: '2026-08-29',
        actuaciones: [
            { fecha: '05/04/2026', tipo: 'Imposición de Medidas de Seguridad', texto: 'Orden de desalojo del agresor y prohibición absoluta de acercamiento.', firmante: 'Jueza Especial VCM', fojas: '1-30' },
            { fecha: '29/08/2026', tipo: 'Informe Psiquiátrico Forense', texto: 'Evaluación de daño psicológico y riesgo de la víctima.', firmante: 'Médico Forense TSJ', fojas: '31-95' }
        ]
    },

    // CIVIL Y MERCANTIL
    {
        id: 'CASE-CIVIL-1',
        courtId: 'civil',
        nue: 'EXP-2026-00440-CIVIL',
        caratula: 'INVERSIONES CARACAS C.A. C/ DISTRIBUIDORA ORIENTAL S.R.L. S/ CUMPLIMIENTO DE CONTRATO',
        juzgado: 'Juzgado Segundo de Primera Instancia en lo Civil, Mercantil y del Tránsito',
        objeto: 'Cobro de Bolívares y Resolución de Contrato de Suministro',
        actor: 'Inversiones Caracas C.A. (RIF J-30495820-1)',
        demandado: 'Distribuidora Oriental S.R.L.',
        letrado: 'Dr. Alejandro Varela (INPREABOGADO N° 34.890)',
        monto: 45000000,
        estado: 'Sentencia Dictada',
        fojas: 188,
        fecha: '2026-08-20',
        actuaciones: [
            { fecha: '15/09/2025', tipo: 'Libelo de Demanda', texto: 'Demanda mercantil por incumplimiento de entrega y cobro de factura aceptada.', firmante: 'Dr. Alejandro Varela', fojas: '1-35' },
            { fecha: '20/08/2026', tipo: 'Sentencia Definitiva', texto: 'Se declara con lugar la demanda mercantil condenando al pago de la acreencia con indexación.', firmante: 'Juez de Primera Instancia Civil', fojas: '150-188' }
        ]
    },

    // LABORAL
    {
        id: 'CASE-LABORAL-1',
        courtId: 'laboral',
        nue: 'EXP-2026-00512-LAB',
        caratula: 'HERRERA, JOSÉ C/ EMPRESA METALÚRGICA NACIONAL S.A. S/ COBRO DE PRESTACIONES SOCIALES',
        juzgado: 'Juzgado Cuarto de Sustanciación, Mediación y Ejecución del Trabajo',
        objeto: 'Reclamo de Prestaciones Sociales, Vacaciones y Salarios Caídos',
        actor: 'José Herrera (C.I. V-14.890.320)',
        demandado: 'Empresa Metalúrgica Nacional S.A.',
        letrado: 'Dra. Silvina Romero (INPREABOGADO N° 55.320)',
        monto: 12000000,
        estado: 'En Trámite',
        fojas: 75,
        fecha: '2026-08-25',
        actuaciones: [
            { fecha: '01/04/2026', tipo: 'Demanda Laboral', texto: 'Solicitud de calificación de despido e indemnización por antigüedad (LOTTT).', firmante: 'Dra. Silvina Romero', fojas: '1-25' },
            { fecha: '25/08/2026', tipo: 'Acta de Audiencia Preliminar', texto: 'Celebración de sesión de mediación. No habiendo acuerdo, pasa a fase de juicio.', firmante: 'Juez de Mediación Laboral', fojas: '26-75' }
        ]
    },

    // CONTENCIOSO ADMINISTRATIVO
    {
        id: 'CASE-CONT-1',
        courtId: 'contencioso',
        nue: 'EXP-2026-00609-CONT',
        caratula: 'CÁMARA DE COMERCIO C/ SERVICIO MUNICIPAL DE ADMINISTRACIÓN TRIBUTARIA S/ RECURSO CONTENCIOSO',
        juzgado: 'Juzgado Superior Contencioso Administrativo y Tributario',
        objeto: 'Recurso Contencioso Tributario de Anulación de Acto Administrativo',
        actor: 'Cámara de Comercio Regional',
        demandado: 'Administración Tributaria Municipal',
        letrado: 'Dr. Lucas Pellegrini (INPREABOGADO N° 60.102)',
        monto: 0,
        estado: 'Apertura a Prueba',
        fojas: 310,
        fecha: '2026-08-26',
        actuaciones: [
            { fecha: '10/02/2026', tipo: 'Recurso Contencioso', texto: 'Solicitud de nulidad absoluta de reparo fiscal por violación del principio de legalidad.', firmante: 'Dr. Lucas Pellegrini', fojas: '1-80' },
            { fecha: '26/08/2026', tipo: 'Auto de Admisión y Lapso Probatorio', texto: 'Se abre el lapso de evacuación de pruebas periciales contables.', firmante: 'Juez Superior Contencioso', fojas: '81-310' }
        ]
    },

    // SALAS TSJ
    {
        id: 'CASE-TSJ-1',
        courtId: 'tsj_salas',
        nue: 'EXP-2026-00701-SCON',
        caratula: 'ACCIÓN POPULAR S/ RECURSO DE INTERPRETACIÓN CONSTITUCIONAL ART. 26 CRBV',
        juzgado: 'Sala Constitucional del Tribunal Supremo de Justicia',
        objeto: 'Interpretación de Alcance de Tutela Judicial Efectiva y Digitalización',
        actor: 'Colegio de Abogados de Venezuela',
        demandado: 'Interés Público General',
        letrado: 'Dr. Magistrado Ponente',
        monto: 0,
        estado: 'Autos para Sentencia',
        fojas: 520,
        fecha: '2026-09-01',
        actuaciones: [
            { fecha: '10/01/2026', tipo: 'Solicitud Constitucional', texto: 'Recurso de interpretación sobre validez probatoria de firmas electrónicas en expedientes.', firmante: 'Colegio de Abogados', fojas: '1-120' },
            { fecha: '01/09/2026', tipo: 'Fijación de Ponencia', texto: 'Designación de Ponente y pase a Sala Plena para decisión vinculante.', firmante: 'Presidente Sala Constitucional TSJ', fojas: '121-520' }
        ]
    }
];

// INICIALIZACIÓN
function startTSJApp() {
    const savedCases = localStorage.getItem('tsj_venezuela_cases_v3');
    const savedRole = localStorage.getItem('tsj_user_role_v3');
    const savedTheme = localStorage.getItem('tsj_theme_v3');

    TSJ_STATE.cases = savedCases ? JSON.parse(savedCases) : [...INITIAL_TSJ_CASES];
    if (savedRole) TSJ_STATE.userRole = savedRole;
    if (savedTheme) {
        TSJ_STATE.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', TSJ_STATE.theme);
        updateThemeIcon();
    }

    saveTSJData();
    updateRoleUI();
    renderCourtsGrid();
}

function saveTSJData() {
    localStorage.setItem('tsj_venezuela_cases_v3', JSON.stringify(TSJ_STATE.cases));
    localStorage.setItem('tsj_user_role_v3', TSJ_STATE.userRole);
}

// CONTROL DE ROLES Y AUTENTICACIÓN
function loginAsRole(role) {
    TSJ_STATE.userRole = role;
    saveTSJData();
    updateRoleUI();
    closeModal('modal-login');

    if (role === 'admin') {
        showTSJToast('Sesión iniciada como Personal Judicial TSJ (Permisos Totales)', 'success');
    } else {
        showTSJToast('Modo Consulta Pública activo (Solo Lectura y Descarga)', 'info');
    }

    if (TSJ_STATE.currentView === 'court-cases') {
        renderCourtCasesList();
    }
}

function updateRoleUI() {
    const tag = document.getElementById('role-indicator-tag');
    const name = document.getElementById('role-display-name');
    const loginBtn = document.getElementById('btn-login-header');
    const publicNotice = document.getElementById('public-notice-banner');
    const adminNewBtn = document.getElementById('btn-admin-new-case');

    if (TSJ_STATE.userRole === 'admin') {
        tag.className = 'role-tag-indicator role-tag-admin';
        tag.textContent = 'Funcionario TSJ';
        name.textContent = 'Dr. Carlos Rivas (Acceso Total)';
        loginBtn.innerHTML = '<i class="fa-solid fa-user-check"></i> Modo Funcionario Activo';
        if (publicNotice) publicNotice.style.display = 'none';
        if (adminNewBtn) adminNewBtn.style.display = 'inline-flex';
    } else {
        tag.className = 'role-tag-indicator role-tag-public';
        tag.textContent = 'Público';
        name.textContent = 'Consulta General (Solo Lectura)';
        loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión / Rol';
        if (publicNotice) publicNotice.style.display = 'flex';
        if (adminNewBtn) adminNewBtn.style.display = 'none';
    }
}

function openLoginModal() {
    openModal('modal-login');
}

// RENDERIZADO DEL GRID DE TRIBUNALES VENEZOLANOS (CON EMBLEMAS REALISTAS)
function renderCourtsGrid() {
    const container = document.getElementById('tribunales-grid-container');
    if (!container) return;
    container.innerHTML = '';

    TSJ_STATE.courts.forEach(court => {
        const count = TSJ_STATE.cases.filter(c => c.courtId === court.id).length;
        const card = document.createElement('div');
        card.className = 'tribunal-card';
        card.onclick = () => selectCourt(court.id);

        const tagsHTML = court.tags.map(t => `<span class="competency-tag">${t}</span>`).join('');

        card.innerHTML = `
      <div>
        <div class="tribunal-card-top">
          <div class="court-realistic-emblem">${court.svgEmblem}</div>
          <div style="flex: 1;">
            <span class="tribunal-category-pill">${court.category}</span>
            <div class="tribunal-title">${court.title}</div>
          </div>
        </div>
        <p class="tribunal-desc">${court.desc}</p>
        <div class="tribunal-tags-wrap">${tagsHTML}</div>
      </div>

      <div class="tribunal-footer">
        <span class="tribunal-count-pill">${count} Expedientes Activos</span>
        <span class="tribunal-enter-btn">Consultar Expedientes <i class="fa-solid fa-arrow-right"></i></span>
      </div>
    `;
        container.appendChild(card);
    });
}

// NAVEGACIÓN A UN TRIBUNAL
function selectCourt(courtId) {
    const court = TSJ_STATE.courts.find(c => c.id === courtId);
    if (!court) return;

    TSJ_STATE.currentCourtId = courtId;
    TSJ_STATE.currentView = 'court-cases';

    // Actualizar encabezados
    document.getElementById('court-header-category').textContent = court.category;
    document.getElementById('court-header-title').textContent = court.title;
    document.getElementById('court-header-desc').textContent = court.desc;

    // Breadcrumb
    document.getElementById('breadcrumb-separator').style.display = 'inline';
    const currentBread = document.getElementById('breadcrumb-current-court');
    currentBread.style.display = 'inline';
    currentBread.textContent = court.title;

    // Switch de vistas
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.getElementById('view-court-cases').classList.add('active');

    const search = document.getElementById('court-cases-search');
    if (search) search.value = '';

    updateRoleUI();
    renderCourtCasesList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToHomeCourts() {
    TSJ_STATE.currentCourtId = null;
    TSJ_STATE.currentView = 'courts';

    document.getElementById('breadcrumb-separator').style.display = 'none';
    document.getElementById('breadcrumb-current-court').style.display = 'none';

    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.getElementById('view-courts').classList.add('active');

    renderCourtsGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function returnToCurrentCourt() {
    if (TSJ_STATE.currentCourtId) {
        selectCourt(TSJ_STATE.currentCourtId);
    } else {
        goToHomeCourts();
    }
}

// LISTA DE EXPEDIENTES DEL TRIBUNAL
function renderCourtCasesList(filterTerm = '') {
    const container = document.getElementById('court-cases-list');
    if (!container) return;
    container.innerHTML = '';

    const courtCases = TSJ_STATE.cases.filter(c => c.courtId === TSJ_STATE.currentCourtId);
    const q = filterTerm.toLowerCase().trim();

    const filtered = courtCases.filter(c => {
        return !q ||
            c.nue.toLowerCase().includes(q) ||
            c.caratula.toLowerCase().includes(q) ||
            c.actor.toLowerCase().includes(q) ||
            c.demandado.toLowerCase().includes(q) ||
            c.juzgado.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
        container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: var(--bg-card); border-radius: var(--radius-md); border: 1.5px solid var(--border-card); color: var(--text-muted); box-shadow: var(--shadow-card);">
        <i class="fa-solid fa-folder-open" style="font-size: 42px; color: var(--tsj-blue-primary); margin-bottom: 12px;"></i>
        <h3 style="color: var(--tsj-blue-dark); margin-bottom: 4px;">No se encontraron causas registradas</h3>
        <p>No hay expedientes que coincidan con el término de búsqueda ingresado en este Tribunal.</p>
      </div>
    `;
        return;
    }

    filtered.forEach(c => {
        let badgeClass = 'badge-blue';
        if (c.estado === 'Autos para Sentencia') badgeClass = 'badge-purple';
        if (c.estado === 'Sentencia Dictada') badgeClass = 'badge-green';
        if (c.estado === 'Apertura a Prueba') badgeClass = 'badge-amber';

        const item = document.createElement('div');
        item.className = 'case-clean-item';
        item.innerHTML = `
      <div class="case-clean-main">
        <span class="case-nue-tag">${c.nue}</span>
        <div class="case-clean-title">${c.caratula}</div>
        <div class="case-clean-sub">
          <span><i class="fa-solid fa-building-columns" style="color: var(--tsj-blue-primary);"></i> ${c.juzgado}</span>
          <span><i class="fa-solid fa-file-lines" style="color: var(--tsj-blue-primary);"></i> ${c.fojas} fojas foliadas</span>
          <span><i class="fa-solid fa-clock" style="color: var(--tsj-blue-primary);"></i> Última actuación: ${c.fecha}</span>
        </div>
      </div>

      <div class="case-clean-actions">
        <span class="clean-badge ${badgeClass}">${c.estado}</span>
        <button class="btn-main btn-primary-clean" onclick="openCaseDetail('${c.id}')">
          <i class="fa-solid fa-eye"></i> Ver Expediente & Descargar
        </button>
      </div>
    `;
        container.appendChild(item);
    });
}

function filterCourtCases(term) {
    renderCourtCasesList(term);
}

// FICHA 360° DEL EXPEDIENTE (MODAL)
function openCaseDetail(caseId) {
    const c = TSJ_STATE.cases.find(item => item.id === caseId);
    if (!c) return;

    TSJ_STATE.activeCaseId = caseId;

    document.getElementById('detail-nue').textContent = c.nue;
    document.getElementById('detail-caratula').textContent = c.caratula;
    document.getElementById('detail-juzgado').textContent = c.juzgado;
    document.getElementById('detail-actor').textContent = c.actor;
    document.getElementById('detail-demandado').textContent = c.demandado;
    document.getElementById('detail-letrado').textContent = c.letrado;
    document.getElementById('detail-fojas').textContent = `${c.fojas} fojas foliadas`;

    // Barra de progreso según estado
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');

    [step1, step2, step3, step4].forEach(s => s.className = 'step-item');

    if (c.estado === 'En Trámite') {
        step1.className = 'step-item completed';
        step2.className = 'step-item active';
    } else if (c.estado === 'Apertura a Prueba') {
        step1.className = 'step-item completed';
        step2.className = 'step-item completed';
        step3.className = 'step-item active';
    } else if (c.estado === 'Autos para Sentencia') {
        step1.className = 'step-item completed';
        step2.className = 'step-item completed';
        step3.className = 'step-item completed';
        step4.className = 'step-item active';
    } else if (c.estado === 'Sentencia Dictada') {
        step1.className = 'step-item completed';
        step2.className = 'step-item completed';
        step3.className = 'step-item completed';
        step4.className = 'step-item completed';
    }

    // Actuaciones
    const list = document.getElementById('detail-history-list');
    list.innerHTML = '';

    c.actuaciones.forEach(act => {
        const box = document.createElement('div');
        box.style.cssText = 'background: var(--tsj-blue-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px 16px;';
        box.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <strong style="color: var(--tsj-blue-primary); font-size: 0.9rem;">${act.tipo} (Fs. ${act.fojas})</strong>
        <span style="font-size: 0.78rem; color: var(--text-sub); font-weight: 600;"><i class="fa-regular fa-clock"></i> ${act.fecha}</span>
      </div>
      <div style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5;">${act.texto}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; font-weight: 600;">
        <i class="fa-solid fa-signature"></i> Firmado: ${act.firmante}
      </div>
    `;
        list.appendChild(box);
    });

    // Control de botones según ROL (Modificar vs Solo Lectura)
    const btnDelete = document.getElementById('btn-admin-delete');
    const btnAddAct = document.getElementById('btn-admin-add-act');

    if (TSJ_STATE.userRole === 'admin') {
        btnDelete.style.display = 'inline-flex';
        btnAddAct.style.display = 'inline-flex';
    } else {
        btnDelete.style.display = 'none';
        btnAddAct.style.display = 'none';
    }

    openModal('modal-case-detail');
}

// RADICAR NUEVA CAUSA (SOLO ADMINISTRATIVOS)
function openNewCaseForCurrentCourt() {
    if (TSJ_STATE.userRole !== 'admin') {
        showTSJToast('Permiso denegado: Solo el personal judicial del TSJ puede registrar causas.', 'warning');
        return;
    }

    const court = TSJ_STATE.courts.find(c => c.id === TSJ_STATE.currentCourtId);
    if (!court) return;

    TSJ_STATE.currentView = 'new-case';
    document.getElementById('new-case-court-subtitle').textContent = `Radicación en ${court.title}`;
    document.getElementById('anc-juzgado').value = court.title;

    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.getElementById('view-new-case').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleAdminSubmitNewCase(e) {
    e.preventDefault();
    if (TSJ_STATE.userRole !== 'admin') return;

    const caratula = document.getElementById('anc-caratula').value.trim().toUpperCase();
    const juzgado = document.getElementById('anc-juzgado').value;
    const objeto = document.getElementById('anc-objeto').value.trim();
    const actor = document.getElementById('anc-actor').value.trim();
    const demandado = document.getElementById('anc-demandado').value.trim();
    const letrado = document.getElementById('anc-letrado').value.trim();
    const monto = parseFloat(document.getElementById('anc-monto').value) || 0;

    const nextNum = TSJ_STATE.cases.length + 101;
    const code = TSJ_STATE.currentCourtId.toUpperCase();
    const nue = `EXP-2026-00${nextNum}-${code}`;
    const today = new Date().toLocaleDateString('es-AR');

    const newCase = {
        id: 'CASE-' + Date.now(),
        courtId: TSJ_STATE.currentCourtId,
        nue: nue,
        caratula: caratula,
        juzgado: juzgado,
        objeto: objeto,
        actor: actor,
        demandado: demandado,
        letrado: letrado,
        monto: monto,
        estado: 'En Trámite',
        fojas: 10,
        fecha: today,
        actuaciones: [
            { fecha: today, tipo: 'Radicación de Causa', texto: `Ingreso formal del escrito y auto de radicación en ${juzgado}.`, firmante: letrado, fojas: '1-10' }
        ]
    };

    TSJ_STATE.cases.unshift(newCase);
    saveTSJData();
    showTSJToast(`Expediente ${nue} radicado y foliado con éxito en el TSJ`, 'success');
    document.getElementById('admin-new-case-form').reset();
    selectCourt(TSJ_STATE.currentCourtId);
}

// AGREGAR ACTUACIÓN (SOLO ADMINISTRATIVOS)
function openAddActuationModal() {
    if (TSJ_STATE.userRole !== 'admin') {
        showTSJToast('Permiso denegado: El público solo tiene acceso de lectura.', 'warning');
        return;
    }
    openModal('modal-add-actuation');
}

function handleSaveActuation(e) {
    e.preventDefault();
    if (TSJ_STATE.userRole !== 'admin') return;

    const c = TSJ_STATE.cases.find(item => item.id === TSJ_STATE.activeCaseId);
    if (!c) return;

    const tipo = document.getElementById('act-tipo').value;
    const texto = document.getElementById('act-texto').value.trim();
    const firmante = document.getElementById('act-firmante').value.trim();
    const today = new Date().toLocaleDateString('es-AR');

    const startFoja = c.fojas + 1;
    const endFoja = c.fojas + 2;
    c.fojas = endFoja;
    c.fecha = today;

    c.actuaciones.push({
        fecha: today,
        tipo: tipo,
        texto: texto,
        firmante: firmante,
        fojas: `${startFoja}-${endFoja}`
    });

    saveTSJData();
    showTSJToast(`Actuación foliada en Fs. ${startFoja}-${endFoja} incorporada`, 'success');
    closeModal('modal-add-actuation');
    openCaseDetail(TSJ_STATE.activeCaseId);
    renderCourtCasesList();
}

// DAR DE BAJA EXPEDIENTE (SOLO ADMINISTRATIVOS)
function deleteActiveCase() {
    if (TSJ_STATE.userRole !== 'admin') {
        showTSJToast('Permiso denegado: El público no puede eliminar causas.', 'warning');
        return;
    }

    if (confirm('¿Confirma dar de baja este expediente del registro oficial del Tribunal?')) {
        TSJ_STATE.cases = TSJ_STATE.cases.filter(c => c.id !== TSJ_STATE.activeCaseId);
        saveTSJData();
        showTSJToast('Expediente dado de baja del registro', 'warning');
        closeModal('modal-case-detail');
        renderCourtCasesList();
        renderCourtsGrid();
    }
}

// UTILIDADES MODALES Y TOASTS
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
}

function showTSJToast(msg, type = 'info') {
    const stack = document.getElementById('toast-stack');
    if (!stack) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-info-circle'}"></i>
    <span>${msg}</span>
  `;
    stack.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

function toggleTheme() {
    TSJ_STATE.theme = TSJ_STATE.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', TSJ_STATE.theme);
    localStorage.setItem('tsj_theme_v3', TSJ_STATE.theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = TSJ_STATE.theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
}

// INICIAR AL CARGAR
document.addEventListener('DOMContentLoaded', startTSJApp);
