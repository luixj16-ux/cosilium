---
trigger: always_on
---
# Datos Semilla de Dominio — CONSILIUM (Legacy Reference)

> **Datos demo/judiciales** extraídos del sistema legacy para uso en tests, desarrollo y seeding de la nueva arquitectura.

---

## 7 Jurisdicciones (Courts Seed)

| ID | Título | Categoría | Tags | Emblema SVG |
|---|---|---|---|---|
| `lopnna` | Tribunales de Protección (LOPNNA) | Ley Orgánica LOPNNA | Manutención, Régimen de Visitas, Colocación Familiar, Patria Potestad | Manos doradas + niño + balanza |
| `penal` | Jurisdicción Penal Ordinaria y Especial | COPP | Control Garantías, Juicio Oral, Delitos Informáticos, Ejecución Penal | Escudo + espada + mazo + balanza |
| `violencia` | Tribunales Violencia Contra la Mujer | Ley VCM | Medidas Protección, Violencia Psicológica, Feminicidio, Medidas Cautelares | Flor púrpura + silueta femenina + equidad |
| `civil` | Tribunales Civiles, Mercantiles y Tránsito | Código Proc. Civil | Cobro Bolívares, Hipotecas, Sociedades Mercantiles, Tránsito | Frontispicio + columnas romanas + pergamino |
| `laboral` | Tribunales Trabajo y Agrarios | LOTTT | Prestaciones Sociales, Despido, Juicio Laboral, Agrario | Engranaje + espiga + balanza |
| `contencioso` | Contencioso Administrativo y Tributario | LOJCA | Nulidad Actos, Reparos Tributarios, Contratos Públicos, SENIAT | Capitolio + columnas + escudo fiscal |
| `tsj_salas` | Salas Tribunal Supremo Justicia | Máxima Instancia TSJ | Casación, Interpretación Constitucional, Avocamiento, Plenaria | Códice constitucional + 8 estrellas |

**Paleta emblemas:** Fondo `#092C53`/`#061C38`, anillo `#D4AF37`, acentos `#C59B27`, `#0D47A1`, blanco.

---

## 8 Casos Demo Iniciales (Cases Seed)

| ID | NUE | Jurisdicción | Estado | Fojas |
|---|---|---|---|---|
| `CASE-LOPNNA-1` | `EXP-2026-00104-LOPNNA` | lopnna | En Trámite | 84 |
| `CASE-LOPNNA-2` | `EXP-2026-00188-LOPNNA` | lopnna | Autos para Sentencia | 140 |
| `CASE-PENAL-1` | `EXP-2026-00215-PENAL` | penal | Apertura a Prueba | 260 |
| `CASE-VIOLENCIA-1` | `EXP-2026-00302-VCM` | violencia | En Trámite | 95 |
| `CASE-CIVIL-1` | `EXP-2026-00440-CIVIL` | civil | Sentencia Dictada | 188 |
| `CASE-LABORAL-1` | `EXP-2026-00512-LAB` | laboral | En Trámite | 75 |
| `CASE-CONT-1` | `EXP-2026-00609-CONT` | contencioso | Apertura a Prueba | 310 |
| `CASE-TSJ-1` | `EXP-2026-00701-SCON` | tsj_salas | Autos para Sentencia | 520 |

**Formato NUE:** `EXP-YYYY-NNN-CÓDIGO` (NNN secuencial, CÓDIGO = ID jurisdicción mayúsculas)

---

## Tipos de Actuaciones Demo (Case Activities Seed)

Demanda Inicial, Medida Cautelar, Informe Multidisciplinario, Acusación Fiscal, Audiencia Preliminar, Prueba Digital, Imposición de Medidas, Informe Psiquiátrico, Libelo de Demanda, Sentencia Definitiva, Acta de Audiencia, Recurso Contencioso, Auto de Admisión, Solicitud Constitucional, Fijación de Ponencia.

---

## Biblioteca Jurídica (15 Leyes, 5 Categorías)

| Categoría | Leyes (Rango Artículos) |
|---|---|
| **Constitucional** | CRBV (1-188), LOPE (1-220), LOPPE (1-290) |
| **Civil y Mercantil** | Código Civil (1-1200), Código Comercio (1-890), Ley Propiedad Horizontal (1-140) |
| **Penal** | COPP (1-500), Ley Corrupción (1-180), Ley Delitos Informáticos (1-160) |
| **Laboral** | LOT (1-280), LETT (1-320), Ley Seguridad Social (1-260) |
| **Administrativo** | LOPA (1-240), LCP (1-200), LOAP (1-180) |

---

## Noticias Carrusel (4 Items Seed)

| Tag | Título | Impacto | Fecha |
|---|---|---|---|
| Reforma normativa | Ajuste plazos procesales protección menores | Tribunales Protección | 01 sep 2026 |
| Actualización legal | Modificación criterios ejecuciones tributarias | Contencioso Administrativo | 26 ago 2026 |
| Boletín judicial | Revisión medidas cautelares violencia mujer | Violencia Género | 18 ago 2026 |
| Análisis normativo | Nuevas directrices expedientes digitales/firma electrónica | Sala Constitucional | 09 ago 2026 |

*Imágenes: Unsplash CDN (`auto=format&fit=crop&w=1200&q=85`)*

---

## Uso en Nueva Arquitectura

### Para Tests (Vitest)
```typescript
// tests/fixtures/domain-seed.ts
export const seedCourts = [ ... ]  // 7 jurisdicciones
export const seedCases = [ ... ]   // 8 casos
export const seedLaws = { ... }    // 15 leyes
export const seedNews = [ ... ]    // 4 noticias
```

### Para Seeding RxDB (Development)
```typescript
// packages/core/infrastructure/rxdb/seeds.ts
import { seedCourts, seedCases, seedLaws } from '@consilium/tests/fixtures'

export async function seedDevelopmentDb(db: RxDatabase) {
  await db.courts.bulkInsert(seedCourts)
  await db.cases.bulkInsert(seedCases)
  await db.laws.bulkInsert(seedLaws)
}
```

### Para Storybook / UI Development
```typescript
// packages/ui/stories/fixtures.ts
export const mockCourt = seedCourts[0]
export const mockCase = seedCases[0]
export const mockLaw = seedLaws.constitucional[0]
```

---

## Migración a Nueva Arquitectura

| Dato Legacy | Destino Actual |
|---|---|
| 7 courts en `app.js` | `CourtRepositoryPort` + RxDB collection `courts` |
| 8 casos en localStorage | `CaseRepositoryPort` + RxDB `cases` + outbox sync |
| 15 leyes en `app.js` | `LawRepositoryPort` + RxDB `laws` (read-only) |
| 4 noticias en `app.js` | `NewsRepositoryPort` + RxDB `news` (remote sync) |
| Actuaciones demo | `CaseActivityVO` dentro de `CaseAggregate` |

**Nota:** En arquitectura actual, los datos son **offline-first** (RxDB local) con sync diferido a PostgreSQL remoto via GraphQL.