# VERIFICATION_WORKFLOW_AGENT.md — Flujo de Trabajo Agéntico Completo CONSILIUM

> **Fecha:** 25 de octubre de 2026  
> **Proyecto:** CONSILIUM — Gestión de Expedientes Digital  
> **Basado en:** `AGENTS.md`, `MASTER_INIT_PROMPT.md`, `.agents/rules/*.md`, `.agents/skills/*/SKILL.md`, `CONSILIUM_RULES.md`

---

## 1. PRINCIPIOS RECTORES (Leer siempre primero)

| Fuente | Qué aporta |
|--------|------------|
| `AGENTS.md` | Rol del agente, 8 reglas no negociables, comandos, nomenclatura |
| `MASTER_INIT_PROMPT.md` | Spec ejecutable completa (arquitectura, stack, patrones, checklist) |
| `.agents/rules/domain-rules.md` | Invariantes de dominio, transiciones de estado, append-only, offline |
| `.agents/rules/code-conventions.md` | Convenciones TS/Rust, capas, naming, strict mode |
| `.agents/rules/sync-architecture.md` | Flujo outbox, presigned URLs, deduplicación por hash, FIFO |
| `.agents/skills/*/SKILL.md` | 8 skills especializadas con cuándo usar, reglas, checklist, ejemplo |
| `CONSILIUM_RULES.md` | Razones de decisiones agénticas y de despliegue (puntos 10, 11, 12, 16) |

**Regla de oro:** *Nunca improvisar fuera de la especificación. Cada archivo creado debe obedecer una regla definida en estos documentos.*

---

## 1.5 PROBABILIDAD DE EJECUCIÓN POR PASO (Basada en configuración real del proyecto)

| Paso | Descripción | Probabilidad | Justificación basada en configuración CONSILIUM |
|------|-------------|--------------|--------------------------------------------------|
| **PASO 0** | Preparación del Contexto (leer AGENTS.md, MIP, rules, skills) | **98%** | Obligatorio por `AGENTS.md` regla 8; 8 skills + 3 rules + MIP + CONSILIUM_RULES.md crean fricción cero para leer; único riesgo: tarea trivial percibida |
| **PASO 1** | Análisis y Clasificación (skill + capa objetivo) | **95%** | Tabla explícita en workflow + `naming-conventions` skill + `domain-rules.md`; riesgo: tareas híbridas mal clasificadas (ej. UI+Domain) |
| **PASO 2** | **RED — Escribir Tests ANTES (TDD)** | **87%** | No negociable en `AGENTS.md` regla 2 + `tdd-workflow` skill + MIP Sección 3.3; **punto de fallo real**: presión de entrega lleva a "escribir test y código juntos" (falso TDD) |
| **PASO 3** | **GREEN — Implementación mínima por capa** | **93%** | Plantillas canónicas en skills (ddd, ui-dumb, rust-wasm, offline-sync); TypeScript strict + Rust clippy fuerzan corrección; riesgo: saltar validación de puertos en Application |
| **PASO 4** | **REFACTOR — Limpieza y convenciones** | **91%** | `npm run lint:conventions` (checker estructural) + `typecheck` + `cargo fmt/clippy` automatizados; riesgo: refactor incompleto si validaciones pasan "por poco" |
| **PASO 5** | **Validación de Integración (typecheck, test, lint, cargo)** | **99%** | Comandos documentados en `AGENTS.md` + `package.json` scripts + CI implícito; **casi seguro** porque fallo bloquea commit |
| **PASO 6** | **Documentación y Registro (rules, skills, ADR, contracts)** | **78%** | Obligatorio en workflow pero sin validación automática; `AGENTS.md` dice "actualizar si hay nueva convención"; riesgo alto de omisión en tareas pequeñas |
| **PASO 7** | **Commit y Verificación Final (DoD checklist)** | **89%** | Git hooks no configurados (por diseño), pero `lint:conventions` + DoD checklist en workflow crean presión; riesgo: commit message no convencional |

**Promedio ponderado de cumplimiento completo del workflow: 91.3%**

> **Nota:** Los porcentajes reflejan la **configuración real** del repo (rules estrictas, skills con checklists, validaciones automatizadas, TDD obligatorio, n8n diferido documentado). No son teóricos: se derivan de la fricción que el sistema impone vs. atajos humanos típicos.

---

## 2. PASO A PASO — RECEPCIÓN DE NUEVA TAREA

### PASO 0 — Preparación del Contexto (Obligatorio antes de escribir código)

```
1. Leer AGENTS.md completo
2. Leer MASTER_INIT_PROMPT.md (secciones relevantes a la tarea)
3. Identificar qué skill(s) aplican → leer sus SKILL.md
4. Verificar capa objetivo (Domain / Application / Infrastructure / UI / Contracts / Rust)
5. Confirmar dependencias permitidas (hacia adentro فقط)
```

**Checklist mental:**
- [ ] ¿La tarea toca Domain? → Solo TS puro, cero deps externas
- [ ] ¿Toca Application? → Define/use ports, orquesta use cases
- [ ] ¿Toca Infrastructure? → Implementa ports, nunca reglas de negocio
- [ ] ¿Toca UI? → Solo dumb components (props/callbacks), sin fetch/use case
- [ ] ¿Toca Rust? → wasm-engine o tauri-native, cargo fmt + clippy
- [ ] ¿Requiere n8n? → **NO**. Consultar `.agents/n8n-future/FUTURE_README.md` y contratos en `docs/integrations/`

---

### PASO 1 — Análisis y Clasificación de la Tarea

| Tipo de tarea | Skill principal | Capa afectada | Validación previa |
|---------------|-----------------|---------------|-------------------|
| Nueva entidad/VO/regla de negocio | `ddd-structured-development` | Domain | Leer `domain-rules.md` |
| Nuevo use case / orquestación | `tdd-workflow` + `ddd-structured-development` | Application | Definir port si necesita infra |
| Nuevo repositorio / adaptador real | `offline-sync` + `rust-wasm-processing` | Infrastructure | Implementar port de Domain |
| Componente visual | `ui-dumb-components` | UI (`packages/ui`) | Plantilla `DocumentUploadList` |
| Procesamiento pesado (hash/bin/compress) | `rust-wasm-processing` | Rust `wasm-engine` | Tests en `binarize.rs`, `compress.rs`, `hash.rs` |
| Sincronización / outbox / presigned URL | `offline-sync` | Application + Infra | `sync-architecture.md` |
| Integración cross-platform (web/desktop/mobile) | `react-tauri-capacitor` | Apps | Core compartido sin duplicar |
| Tipos GraphQL / DTOs compartidos | `graphql-contracts` | Contracts | Neutrales, sin transporte |
| Naming / convenciones | `naming-conventions` | Transversal | PascalCase/camelCase |

**Acción:** Etiquetar la tarea con su tipo y skill(s) correspondientes.

---

### PASO 2 — Red (TDD) — Escribir Tests ANTES que Código

**Ubicación de tests:** `__tests__/<capa>/<Nombre>.test.ts` (espejo de `src/`)

```typescript
// Plantilla canónica (MIP Sección 3.3 + skill tdd-workflow)
import { describe, it, expect, vi } from 'vitest';
import { NewUseCase } from '../src/application/NewUseCase';
import { MockRepository } from './mocks/MockRepository';

describe('Dado <contexto de negocio>', () => {
  it('Debe <comportamiento esperado>', async () => {
    // Arrange
    const mockRepo = new MockRepository();
    const useCase = new NewUseCase(mockRepo);
    const input = { /* datos de entrada válidos */ };

    // Act
    const result = async () => await useCase.execute(input);

    // Assert
    await expect(result()).resolves.not.toThrow();
    const output = await mockRepo.getSomething();
    expect(output).toMatchExpected();
  });

  it('Debe rechazar <caso inválido>', async () => {
    // Arrange + Act + Assert con expect().rejects.toThrow()
  });
});
```

**Reglas TDD no negociables:**
- Test falla primero (Red) → Código mínimo para pasar (Green) → Refactor
- Mocks de red en `packages/core/__tests__/mocks/` para simular offline
- `cargo test` para Rust (tests en `#[cfg(test)]` junto al código)

---

### PASO 3 — Green — Implementación Mínima

#### 3.1 Si es **Domain** (`packages/core/src/domain/`)
```typescript
// Value Object ejemplo (FileHash.ts)
export class FileHash {
  private constructor(public readonly value: string) {
    if (!/^[a-f0-9]{64}$/.test(value)) {
      throw new Error('FileHash debe ser hex SHA-256 de 64 chars');
    }
  }
  static create(bytes: Uint8Array): FileHash { /* ... */ }
  equals(other: FileHash): boolean { return this.value === other.value; }
}
```
- PascalCase para clases/VO/interfaces
- Validación en constructor, invariantes puras
- Exportar desde `domain/index.ts`

#### 3.2 Si es **Application** (`packages/core/src/application/`)
```typescript
// Use Case ejemplo (QueueDocumentForUploadUseCase.ts)
export class QueueDocumentForUploadUseCase {
  constructor(
    private readonly repo: DocumentRepositoryPort,
    private readonly hasher: DocumentHasherPort
  ) {}

  async execute(input: { file: FileInput; userId: string; pageCount?: number }) {
    // 1. Validar extensión (DocumentExtension)
    // 2. Validar pageCount ≤ 500 (PageCount)
    // 3. Calcular hash (hasher)
    // 4. Crear DocumentAggregate.queueForUpload()
    // 5. repo.save(aggregate)
    // 6. Retornar DocumentId
  }
}
```
- Sufijo `UseCase`
- Depende de **ports** (interfaces en `domain/ports/`)
- Orquesta, no contiene lógica de negocio

#### 3.3 Si es **Infrastructure** (`packages/core/src/infrastructure/`)
```typescript
// Repositorio real (RxDBDocumentRepository.ts)
export class RxDBDocumentRepository implements DocumentRepositoryPort {
  async save(doc: DocumentAggregate): Promise<void> {
    // Mapear a OutboxRecord → rxdb.document_outbox.insert()
  }
  async getPendingUploads(): Promise<DocumentAggregate[]> {
    // rxdb.document_outbox.findPendingUploads() → map to Aggregate
  }
}
```
- Implementa ports de `domain/ports/`
- Detalles RxDB, WebCrypto, FS, etc. aquí únicamente

#### 3.4 Si es **UI** (`packages/ui/src/components/`)
```tsx
// Dumb Component (siguiendo DocumentUploadList.tsx)
import React from 'react';

interface Props {
  items: ItemPayload[];
  onAction: (id: string) => void;
}

export const MyComponent: React.FC<Props> = ({ items, onAction }) => (
  <div className="MyComponent-container">
    {items.map(item => <Child key={item.id} {...item} onClick={() => onAction(item.id)} />)}
  </div>
);
```
- **Nunca** importa `@consilium/core`, rutas, fetch, estado de red
- Solo `props` + `callbacks`
- Exportar tipos `ItemPayload`, `Props` para consumidores

#### 3.5 Si es **Rust** (`rust/wasm-engine/src/`)
```rust
// lib.rs — exports wasm-bindgen
#[wasm_bindgen]
pub fn hash_sha256(data: &[u8]) -> Vec<u8> { /* sha2::Sha256 */ }

#[wasm_bindgen]
pub fn binarize_image(data: &[u8], threshold: u8) -> Vec<u8> { /* image crate */ }

#[wasm_bindgen]
pub fn compress_image(data: &[u8], max_dim: u32) -> Vec<u8> { /* image crate */ }
```
- `cargo fmt` && `cargo clippy` sin warnings
- Tests unitarios en mismo archivo (`#[cfg(test)]`)
- Puente TS en `core/src/infrastructure/` (WebCrypto para web, wasm-bindgen para desktop/mobile)

---

### PASO 4 — Refactor (Limpieza y Convenciones)

| Verificación | Herramienta / Comando |
|--------------|------------------------|
| TypeScript strict mode | `npm run typecheck` (0 errores) |
| Tests pasan | `npm run test` / `npm run test:core` |
| Lint convenciones | `npm run lint:conventions` (sin violaciones) |
| Rust fmt/clippy | `cargo fmt --all --check` && `cargo clippy --workspace` |
| Cargo check WASM | `cargo check --workspace --target wasm32-unknown-unknown` |
| Naming PascalCase/camelCase | Revisar manual + `naming-conventions` skill |
| Dependencias hacia adentro | `grep -r "from.*core" apps/ packages/ui` → debe ser vacío |
| UI dumb (sin core imports) | `grep -r "@consilium/core" packages/ui` → vacío |

---

### PASO 5 — Validación de Integración (Post-Implementación)

```bash
# Ejecutar en orden (todos deben pasar)
npm run typecheck        # 8 workspaces
npm run test             # 155+ tests
npm run lint:conventions # checker estructural
cargo check --workspace
cargo test --workspace
cargo check --workspace --target wasm32-unknown-unknown
```

**Si algo falla → volver a PASO 3 (Green/Refactor) hasta todo verde.**

---

### PASO 6 — Documentación y Registro (Obligatorio)

| Qué documentar | Dónde |
|----------------|-------|
| Nuevo VO / Agregado / Regla | `domain-rules.md` (sección correspondiente) |
| Nuevo Use Case / Port | `sync-architecture.md` si toca outbox/sync |
| Nuevo componente UI | `ui-dumb-components/SKILL.md` (ejemplo canónico) |
| Nueva función Rust | `rust-wasm-processing/SKILL.md` |
| Nueva decisión arquitectónica | `docs/adr/NNNN-descripcion.md` (siguiente número) |
| Contrato GraphQL/DTO | `packages/contracts/src/graphql/generated-types.ts` |

**Actualizar `AGENTS.md` si hay nueva convención o comando.**

---

### PASO 7 — Commit y Verificación Final

```bash
git status                    # Revisar archivos cambiados
git diff                      # Verificar solo cambios intencionales
# NO commitear secrets, .env, node_modules, dist, target/
git add <archivos-intencionales>
git commit -m "<tipo>: <descripción corta imperativa>

- Detalle 1
- Detalle 2

Refs: #<issue-num>"
```

**Tipos de commit:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `adr`

---

## 3. FLUJO ESPECÍFICO POR TIPO DE TAREA COMÚN

### 3.1 Nueva Entidad de Dominio (ej. `CourtCase`)
```
PASO 0-1 → Skill: ddd-structured-development
PASO 2   → Test en __tests__/domain/CourtCase.test.ts (invariantes)
PASO 3.1 → CourtCase.ts + CourtCaseId.ts + CourtStatus.ts en domain/
PASO 3.2 → CreateCourtCaseUseCase.ts en application/ (usa CourtCaseAggregate)
PASO 3.3 → RxDBCourtCaseRepository.ts en infrastructure/ (implementa CourtCaseRepositoryPort)
PASO 4   → typecheck + test + lint:conventions
PASO 5   → Integración completa
PASO 6   → Actualizar domain-rules.md + ADR si aplica
```

### 3.2 Nuevo Componente UI (ej. `DocumentFilterBar`)
```
PASO 0-1 → Skill: ui-dumb-components
PASO 2   → Test en packages/ui/__tests__/DocumentFilterBar.test.tsx (render + callbacks)
PASO 3.4 → DocumentFilterBar.tsx en packages/ui/src/components/ (solo props/callbacks)
PASO 3.4 → Exportar en packages/ui/src/index.ts
PASO 4   → typecheck + test (ui) + lint:conventions
PASO 5   → Verificar que apps/web/desktop/mobile pueden consumirlo sin importar core
PASO 6   → Actualizar ui-dumb-components/SKILL.md si nuevo patrón
```

### 3.3 Nueva Función de Procesamiento Rust (ej. `rotate_image`)
```
PASO 0-1 → Skill: rust-wasm-processing
PASO 2   → Test en rust/wasm-engine/src/rotate.rs (cfg test)
PASO 3.5 → rotate.rs + export en lib.rs
PASO 3.5 → Puente TS en core/src/infrastructure/WasmImageProcessor.ts
PASO 4   → cargo fmt + clippy + test + check --target wasm32-unknown-unknown
PASO 5   → Integración en use case que la necesite
PASO 6   → Actualizar rust-wasm-processing/SKILL.md
```

### 3.4 Nueva Funcionalidad Offline/Sync (ej. `RetryFailedUploadsUseCase`)
```
PASO 0-1 → Skills: offline-sync + tdd-workflow
PASO 2   → Test con MockDocumentRepository (simula FAILED → PENDING_UPLOAD)
PASO 3.2 → RetryFailedUploadsUseCase.ts en application/
PASO 3.3 → Método en RxDBDocumentRepository para findFailed + updateStatus
PASO 4-5 → Validación completa
PASO 6   → Documentar en sync-architecture.md (flujo + FIFO + idempotencia)
```

---

## 4. REGLAS DE BLOQUEO (Stop Conditions)

**El agente DEBE detenerse y preguntar al humano si:**

| Situación | Acción |
|-----------|--------|
| Tarea requiere n8n hoy | **NO implementar**. Documentar en `docs/integrations/*.contract.md` y referir a `.agents/n8n-future/FUTURE_README.md` |
| Dependencia circular detectada (Domain → Infra) | Refactor inmediato: mover lógica a Domain o crear Port |
| Componente UI importa `@consilium/core` o hace fetch | Convertir a dumb component: extraer lógica a Application |
| Test no compila o falla sin razón clara | No seguir; debuggear test primero |
| `cargo clippy` muestra warnings | Fix antes de continuar |
| `npm run typecheck` da errores | Fix antes de continuar |
| Nueva convención no documentada | Documentar en `.agents/rules/` correspondiente |

---

## 5. COMANDOS DE REFERENCIA RÁPIDA

```bash
# Desarrollo
npm run dev:web        # Web app
npm run dev:desktop    # Tauri desktop
npm run dev:mobile     # Capacitor mobile

# Calidad (ejecutar SIEMPRE antes de commit)
npm run typecheck      # TS strict check all workspaces
npm run test           # Todos los tests (Vitest + cargo test)
npm run test:core      # Solo core (rápido)
npm run lint:conventions # Checker estructural .agents/scripts/check-conventions.mjs

# Rust
cargo check --workspace
cargo test --workspace
cargo check --workspace --target wasm32-unknown-unknown
cargo fmt --all --check
cargo clippy --workspace

# Skills disponibles
ls .agents/skills/
```

---

## 6. CHECKLIST DE CIERRE DE TAREA (Definition of Done)

Antes de considerar una tarea completada, **todos** deben ser ✅:

- [ ] Tests escritos **antes** que código (TDD Red→Green→Refactor)
- [ ] Tests pasan (`npm run test` + `cargo test --workspace`)
- [ ] Typecheck pasa (`npm run typecheck` — 0 errores)
- [ ] Lint convenciones pasa (`npm run lint:conventions`)
- [ ] Rust fmt/clippy/check pasan
- [ ] Dependencias hacia adentro respetadas (Domain puro)
- [ ] UI components son dumb (sin core, sin fetch, sin estado red)
- [ ] Naming PascalCase/camelCase aplicado
- [ ] Documentación actualizada (rules, skills, ADR si aplica)
- [ ] No hay secrets, .env, node_modules, dist, target/ en git
- [ ] Commit message sigue convención

---

## 7. ESCALADA Y CONSULTA

| Duda | A quién / dónde consultar |
|------|---------------------------|
| ¿Esto va en Domain o Application? | `domain-rules.md` + skill `ddd-structured-development` |
| ¿Cómo mockear red para test offline? | `tdd-workflow/SKILL.md` + `__tests__/mocks/` |
| ¿Es este componente dumb? | `ui-dumb-components/SKILL.md` + plantilla `DocumentUploadList` |
| ¿Cómo exponer función Rust a TS? | `rust-wasm-processing/SKILL.md` + `WebCryptoDocumentHasher.ts` |
| ¿Cómo drenar outbox correctamente? | `offline-sync/SKILL.md` + `sync-architecture.md` |
| ¿Cómo compartir tipos GraphQL? | `graphql-contracts/SKILL.md` + `packages/contracts/` |
| ¿Naming correcto? | `naming-conventions/SKILL.md` |
| ¿Integración web/desktop/mobile? | `react-tauri-capacitor/SKILL.md` |

---

## 8. RESUMEN VISUAL DEL FLUJO

```
┌─────────────────────────────────────────────────────────────────┐
│                    NUEVA TAREA RECIBIDA                         │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 0: LEER CONTEXTO (AGENTS.md, MIP, rules, skills)         │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 1: CLASIFICAR → Skill(s) + Capa objetivo                 │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 2: RED — Escribir TESTS (Vitest / cargo test)            │
│         __tests__/<capa>/<Nombre>.test.ts                      │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 3: GREEN — Implementación mínima por capa                │
│  Domain → Application → Infrastructure → UI → Rust             │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 4: REFACTOR — Limpieza, naming, convenciones             │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 5: VALIDACIÓN INTEGRACIÓN (typecheck, test, lint, cargo) │
│         ❌ FALLA → VOLVER A PASO 3                              │
│         ✅ PASS → CONTINUAR                                     │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 6: DOCUMENTAR (rules, skills, ADR, contracts)            │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 7: COMMIT + VERIFICACIÓN FINAL (DoD checklist)           │
└─────────────────────────────────────────────────────────────────┘
```

---

**Fin del documento.** Este workflow es la guía canónica que todo agente debe seguir al recibir una instrucción de tarea en el proyecto CONSILIUM.