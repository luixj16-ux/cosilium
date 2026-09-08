# MASTER_INIT_PROMPT.md — Prompt Maestro de Inicialización Agentica

> **Documento de control:** Este archivo es el **prompt maestro**. Se copia y pega completo como prompt a un agente de IA para que éste cree **toda la estructura agentica** (rules, skills, workflows y archivos auxiliares) necesaria para desarrollar la aplicación **de forma perfecta, sin errores y escalable**.
>
> Es una **especificación ejecutable**, no una descripción: cada sección contiene instrucciones directas que el agente debe convertir en archivos, reglas y estructura.
>
> **Relación con otros documentos:**
> - `CONSILIUM.md` → describe **qué** existe (estado actual).
> - `CONSILIUM_RULES.md` → explica **por qué / para qué** de las decisiones agénticas y de despliegue (puntos 10, 11, 12, 16).
> - `MASTER_INIT_PROMPT.md` (**este archivo**) → **qué debe crear el agente** desde cero para la nueva aplicación (CONSILIUM — Gestión de Expedientes Digital).

---

## Instrucción de Uso (Leer Antes de Ejecutar)

**Para el operador humano / CTO:**
1. Copia el **bloque completo** de `## PROMPT DEL AGENTE` (Secciones 1–9) y pégalo como prompt al agente.
2. Indica al agente la **ruta destino** del nuevo proyecto (p. ej. `ged/` o un repo separado). Si no se indica, usar la raíz actual.
3. Entrega al agente el contenido de `CONSILIUM.md` y `CONSILIUM_RULES.md` como **contexto** (opcional, útil para que respete las convenciones agénticas del repo).
4. Exige que el agente confirme, al terminar, una **checklist de verificación** (Sección 9) antes de dar el trabajo por cerrado.

**Contratos de calidad (no negociables):**
- El resultado debe ser **cero errores de lint/typecheck/test** al primer intento de ejecución.
- Todo archivo generado debe estar **documentado** y seguir las convenciones de este documento.
- La estructura debe ser **preparada para escalar** — nada de código hardcodeado de datos de dominio en la capa de UI.

---

---

# PROMPT DEL AGENTE

Actúa como **Arquitecto de Software Principal (CTO)** y **Ingeniero de IA**. Tu tarea es **generar toda la estructura agentica y de código** de una aplicación nueva llamada **CONSILIUM (Gestión de Expedientes Digital)** según la especificación DDD/TDD/arquitectura offline que sigue. No improvises fuera de esta especificación: **cada archivo que crees debe obedecer una regla aquí definida**. Al final, verifica tu trabajo contra la **checklist obligatoria** de la Sección 9 y declara explícitamente cada verificación cumplida o fallida.

---

## 1. Estructura y Principios Fundamentales

### 1.1 Arquitectura DDD (Domain-Driven Design)

Organiza **todo** el código en torno al **dominio**, con la **capa de dominio como el centro inexpugnable**. Debes respetar estrictamente las **4 capas tácticas de DDD**, con sus dependencias apuntando SIEMPRE hacia adentro (el dominio no conoce a la infraestructura, nunca al revés):

```
┌───────────────────────────────────────────────┐
│          USER INTERFACE (UI Layer)            │  ← apps visuales (web/desktop/mobile) + dumb components
├───────────────────────────────────────────────┤
│          APPLICATION (Application Layer)      │  ← use cases, orchestradores, outbox queue, client GraphQL/REST
├───────────────────────────────────────────────┤
│          DOMAIN (Domain Layer)                │  ← entidades, invariantes, value objects, reglas PURAS
├───────────────────────────────────────────────┤
│          INFRASTRUCTURE (Infra Layer)         │  ← repositorios reales, adaptadores de red, storage (RxDB/SQLite), FS
└───────────────────────────────────────────────┘
```

**Reglas de dependencia (invariantes estructurales):**
- `Domain` **no dependa** de nada externo (ni frameworks, ni librerías de red, ni UI). Solo TypeScript puro (y lógica Rust compilada a Wasm expuesta como servicio).
- `Application` depende de `Domain` y define `ports` (interfaces) que `Infrastructure` implementa.
- `Infrastructure` implementa los puertos; nunca define reglas de negocio.
- `UI` consume `Application`, nunca el dominio directamente.

**Crea los siguientes archivos de reglas agénticas** (en la ruta de configuración agentica del repo, p. ej. `.agents/rules/`):

1. `.agents/rules/domain-rules.md` — define las invariantes de dependencia, qué vive en cada capa, qué está prohibido en Domain (nada de React/fetch/console, solo lógica pura), y la convención de nombrado DDD.
2. `.agents/rules/code-conventions.md` — las convenciones de código de la Sección 4 (PascalCase/camelCase, dumb components, strict TS).
3. `.agents/rules/sync-architecture.md` — las reglas de la arquitectura *append-only offline* (Sección 5): outbox, conflictos de ids, hash, no mutación de X-Request-Id, etc.
4. `.agents/skills/` — genera los skills necesarios como biblioteca de conocimiento agéntico (ver Sección 7). Cada skill es una carpeta con `SKILL.md`.

### 1.2 Patrones de Desarrollo

Debes imponer y documentar los siguientes patrones como **no negociables**:

- **TDD (Test-Driven Development):** Toda funcionalidad de dominio y de aplicación se desarrolla con el ciclo **Red → Green → Refactor**. Las pruebas se escriben **antes** que el código. Herramientas: **Vitest** para TypeScript y **cargo test** para Rust. Esto aplica de forma crítica a todo lo relacionado con el funcionamiento **offline** (ver Sección 6).
- **Naming — PascalCase (obligatorio) para:**
  - Componentes React: `DocumentUploader.tsx`, `DocumentRow.tsx`
  - Clases de Dominio: `ScannedDocument.ts`
  - Interfaces y Types: `DocumentMetadata.ts`
  - Structs de Rust: `struct DocumentPayload`
  - Tipos GraphQL: `DocumentPayload`, `UploadResult`
- **Naming — camelCase (obligatorio) para:**
  - Variables, instancias de métodos, funciones utilitarias.
  - Archivos que **no** exporten componentes ni clases: `queueDocumentForUpload.ts`.
- **Dumb Components:** Todos los componentes visuales son **puros y ciegos al estado de red**. Reciben datos por **props** y notifican acciones por **callbacks**. Prohibido que un componente visual haga `fetch`, llame a un use case, o conozca el estado de conectividad. La lógica vive siempre en la capa de aplicación/dominio.

### 1.3 Alcance: Automatización n8n EXCLUIDA (Dejar para Escalabilidad)

> **IMPORTANTE — NO CREAR NADA de n8n en esta tarea.** La automatización con n8n está **fuera de alcance** para la estructura inicial y se resolverá en una fase posterior.

Sin embargo, **debes dejar**:

1. **Un archivo de especificación diferida:** `.agents/n8n-future/FUTURE_README.md` que:
   - Documente que la automatización (n8n) **se implementará después**, cuando la aplicación base esté consolidada.
   - Enumere los **puntos de integración previstos** (webhooks de notificación, reportes, ingestas masivas, alertas).
   - Precise que los **contratos de entrada/salida** de esos puntos deben ser neutrales (JSON puro) para no acoplarse a n8n.
2. **Los placeholders de contrato documentados** (no implementados): p. ej. `docs/integrations/notifications.contract.md`, `docs/integrations/ingestion.contract.md` — definen shape de datos futuros sin codificarlos.
3. **Una nota en `AGENTS.md`** indicando que, **cuando se requiera implementar n8n**, el agente DEBE consultar la librería de skills n8n del proyecto (si la hay: `using-n8n-mcp-skills`, `n8n-workflow-patterns`, `n8n-self-hosting`, según `CONSILIUM.md` / `CONSILIUM_RULES.md`) y seguir el proceso de validación multi-nivel antes de cualquier activación.

**Qué NO debes crear para n8n:** credenciales, MCP config con claves, workflows, nodos, deployment n8n. Solo la especificación diferida anterior.

### 1.4 Arquitectura General — "APPEND-ONLY OFFLINE ARCHITECTURE"

El núcleo de la aplicación (Domain, Application y la lógica de Sincronización) se empaqueta en un **Core Único escrito en TypeScript/Rust**. Este Core se ejecuta **de forma idéntica** en la Web, en la app de escritorio y en la app móvil. Debes replicar y respetar este diagrama:

```
+----------------------------------------------------------------------+
|                        CAPA DE PRESENTACIÓN                          |
|   Web App (React)  |  Desktop App (Tauri)  |  Mobile App (Capacitor) |
|                    +-----------------------+                         |
|                        [ Dumb Components ]                           |
+------------------------------------+---------------------------------+
                                     |
                                     v
+------------------------------------+---------------------------------+
|                    CAPA DE APLICACIÓN (TS Core)                      |
|   - Handlers de Comandos           - Cola de Mutaciones (Outbox)     |
|   - Orquestador de Sincronización  - Cliente GraphQL / REST          |
+------------------------------------+---------------------------------+
                                     |
                                     v
+------------------------------------+---------------------------------+
|                      CAPA DE DOMINIO (DDD)                           |
|   - Entidades e Invariantes        - Value Objects (FileHash, etc)   |
|   - Reglas de Validación Puras     - Wasm Engine (Rust: Compresión)  |
+------------------------------------+---------------------------------+
                                     |
                                     v
+------------------------------------+---------------------------------+
|                    CAPA DE INFRAESTRUCTURA LOCAL                     |
|   - RxDB / SQLite (Storage)        - File System (Tauri/Capacitor)   |
+----------------------------------------------------------------------+
```

**Regla maestra (Append-Only):** Los metadatos de documentos son **inmutables** pragmáticamente — nunca se edita un registro existente salvo para su estado de sincronización. Las correcciones producen **nuevos registros** (nuevo id). Esto evita conflictos offline y garantiza auditabilidad.

---

## 2. Stack Tecnológico — Definición de Estructura del Monorepo

Monta un **monorepo** con **Turborepo o Nx** (elige uno y documenta por qué). Es **vital** para separar el código de dominio `@ged/core` de las aplicaciones visuales `@ged/web`, `@ged/desktop`, `@ged/mobile`. Genera la estructura de paquetes y la configuración de cada uno.

### 2.1 Estructura de Paquetes (monorepo)

```
cosilium/
├── apps/
│   ├── web/            # React + Vite (SPA)
│   ├── desktop/        # Tauri v2 + React (mismo core)
│   └── mobile/         # Capacitor v6 (Ionic) + React
├── packages/
│   ├── core/           # @ged/core — DOMINIO + APLICACIÓN + SYNC (el corazón)
│   ├── domain/         # (o integrado en core) — capa de dominio puro
│   ├── ui/             # @ged/ui — librería de dumb components compartidos
│   └── contracts/      # @ged/contracts — Tipos GraphQL y DTOs compartidos
├── rust/
│   ├── wasm-engine/    # crate Rust → Wasm (binarización, compresión, sha256)
│   └── tauri-native/   # lógica nativa Tauri (file watching, fs masivo)
├── server/             # Backend: NestJS + GraphQL + BullMQ (opcional en esta fase, ver 2.4)
├── docs/
│   ├── architecture/
│   ├── integrations/
│   └── adr/            # Architecture Decision Records
├── .agents/            # configuración agentica (rules + skills)
├── AGENTS.md
└── package.json (workspace root) + turbo.json / nx.json
```

### 2.2 Stack por Capa

| Capa | Tecnología | Rol / Configuración a generar |
|---|---|---|
| **Monorepo** | Turborepo o Nx | `turbo.json` o `nx.json`, task pipelines, cache |
| **Core** | TypeScript puro | `packages/core` con capas domain/application/infrastructure |
| **UI Framework** | React + TypeScript | `apps/web`, componentes en `packages/ui` |
| **Desktop** | Tauri v2 | `apps/desktop`, canal bidireccional seguro hacia Rust, manejo nativo de archivos masivos en disco |
| **Mobile** | Capacitor v6 (Ionic) | `apps/mobile`, WebView que ejecuta la app React, acceso a cámara vía plugins TS |
| **Procesamiento Doc** | Rust → Wasm (`wasm-bindgen`) | `rust/wasm-engine`, corre en un Web Worker; misión: binarización de imágenes, compresión con crate `image`, hash con `sha2` |
| **BD Local / Offline** | RxDB | motor TS para IndexedDB (web) y móvil; **Outbox Pattern** vía colección `document_outbox` con estado `PENDING` |
| **Backend / Cloud** | GraphQL (Apollo Server o async-graphql) + NestJS + BullMQ (Redis) | API gateway; streaming de mutaciones masivas; verificar ids únicos antes de subir binario |
| **Almacenamiento** | AWS S3 o MinIO | Presigned URL para subida directa y sin saturar el servidor |
| **BD Principal** | PostgreSQL | almacenamiento central |

### 2.3 Justificación de Móvil (Capacitor sobre React Native)

Documenta en un ADR que se elige **Capacitor v6 en lugar de React Native** porque: ejecuta la app web de React dentro de un **WebView nativo de altísimo rendimiento** (sin reescribir la UI con componentes primitivos), y da acceso a la cámara mediante **plugins de TypeScript**. El código se comparte ~100%.

### 2.4 Backend — alcance en esta primera fase

En la **primera fase de inicialización**, genera la **estructura y contratos** del backend (NestJS modules con DDD, tipos GraphQL, esquema de presigned URLs, configuración BullMQ/Redis, plantilla PostgreSQL) pero **marca como "fase backend"** los endpoints que requieran despliegue. La prioridad de esta tarea es la **estructura agéntica + core offline + apps**. No dejes nada a medias en core: ese sí debe estar completo y testeado (TDD).

---

## 3. Patrones y Diseño de Arquitectura Local (DDD / TDD / Componentes)

### 3.1 Convención de Código Estricta

Genera en `AGENTS.md` (y en `.agents/rules/code-conventions.md`) la convención completa, incluyendo las reglas de la Sección 1.2 de este documento. Ejemplo obligatorio de **Dumb Component** que el agente debe incorporar como plantilla canónica en `.agents/skills/ui-dumb-components/`:

```tsx
// ui/components/DocumentUploadList.tsx (Dumb Component)
import React from 'react';
import { DocumentRow } from './DocumentRow';

interface DocumentPayload {
  id: string;
  name: string;
  sizeInBytes: number;
}

interface DocumentUploadListProps {
  pendingDocuments: DocumentPayload[];
  onCancelUpload: (id: string) => void;
}

export const DocumentUploadList: React.FC<DocumentUploadListProps> = ({
  pendingDocuments,
  onCancelUpload
}) => {
  return (
    <div className="DocumentUploadList-container">
      <h2>Documentos pendientes por subir ({pendingDocuments.length})</h2>
      {pendingDocuments.map((doc) => (
        <DocumentRow
          key={doc.id}
          title={doc.name}
          status="PENDING_UPLOAD"
          onAction={() => onCancelUpload(doc.id)}
        />
      ))}
    </div>
  );
};
```

### 3.2 Arquitectura DDD en el Cliente Offline

El dominio vive dentro de `@ged/core` con **4 capas tácticas**:

- **Domain Layer:** `DocumentAggregate`. Valida reglas de negocio **en frío** (p. ej. un documento no puede tener más de 500 páginas offline; formato de extensión válido). **TypeScript puro, sin dependencias de frameworks.**
- **Application Layer:** casos de uso como `QueueDocumentForUploadUseCase.ts`. Orquesta la lectura del archivo, llama al procesador de Rust (Wasm) e inserta el registro en el almacenamiento local.
- **Infrastructure Layer:** repositorios reales (`RxDBDocumentRepository.ts`), adaptadores de red, llamadas GraphQL.
- **UI Layer:** las apps de React, Tauri y Capacitor que consumen la capa de aplicación.

### 3.3 Ciclo de Desarrollo TDD

Las pruebas unitarias se escriben **antes que el código**, usando **Vitest** (TS) y **cargo test** (Rust). Se **simula la pérdida de conexión** mediante **mocks del repositorio de infraestructura de red** para garantizar el comportamiento offline. Plantilla canónica obligatoria (incorporar como ejemplo en los skills TDD):

```typescript
// __tests__/QueueDocumentForUpload.test.ts
import { describe, it, expect, vi } from 'vitest';
import { QueueDocumentUseCase } from '../application/QueueDocumentUseCase';
import { MockDocumentRepository } from './mocks/MockDocumentRepository';

describe('Dado que el usuario escanea un documento estando offline', () => {
  it('Debe guardar el documento en la cola local con estado PENDING_UPLOAD', async () => {
    // Arrange
    const mockRepo = new MockDocumentRepository();
    const useCase = new QueueDocumentUseCase(mockRepo);
    const fakeFile = { name: 'factura.pdf', size: 1024, buffer: Buffer.from([]) };

    // Act
    const result = async () => await useCase.execute({ file: fakeFile, userId: 'usr_123' });

    // Assert
    await expect(result()).resolves.not.toThrow();
    const queuedDocs = await mockRepo.getPendingUploads();
    expect(queuedDocs).toHaveLength(1);
    expect(queuedDocs[0].status).toBe('PENDING_UPLOAD');
  });
});
```

---

## 4. Value Objects y Reglas de Dominio a Implementar

Genera el código del **dominio** (`packages/core/src/domain/`) que implemente como mínimo:

- **`DocumentId` (Value Object):** wrapper tipado del id de documento (append-only, no reutilizable).
- **`FileHash` (Value Object):** representa el SHA-256 del binario; valida formato hexadecimal de 64 chars; usado para deduplicación y verificación de integridad.
- **`PageCount` / límite de páginas offline:** invariante que un documento no puede exceder 500 páginas en estado offline.
- **`DocumentStatus`** con al menos los estados del outbox: `PENDING` / `PENDING_UPLOAD` / `UPLOADED` / `FAILED`.
- **`DocumentAggregate` (Agregado):** entidad raíz que encapsula metadatos, filehash, pagecount, status, y expone métodos que **validan invariantes** (ej. `queueForUpload()`, `markAsUploaded(existingHashes)`).
- **Reglas de extensión válidas** (PDF, JPEG, PNG) como invariantes puras.

Cada clase de dominio DEBE tener su **prueba TDD en `__tests__/domain/`**.

---

## 5. Arquitectura de Sincronización y Outbox (Append-Only Offline)

Genera la **lógica de sincronización** en `packages/core/src/application/` + `infrastructure/`:

1. **Cola de mutaciones (Outbox):** `document_outbox` en RxDB. Toda mutación offline se guarda como registro con estado. **No interfiere con nada más** (colección aislada).
2. **Handlers de comandos:** `QueueDocumentForUploadUseCase`, `SynchronizePendingDocumentsUseCase`, `VerifyRemoteExistenceUseCase`.
3. **Orquestador de sincronización:** cuando hay red, drena el outbox en orden, verifica con GraphQL qué ids ya existen (`where in`), y sube solo los binarios faltantes **usando presigned URLs** directas al storage de objetos (S3/MinIO) para no saturar el servidor API.
4. **Resolución de conflictos (append-only):** como los metadatos no se mutan, los conflictos se resuelven por **inmutabilidad + hash**: el servidor descarta duplicados por `FileHash`. Documenta este algoritmo en `.agents/rules/sync-architecture.md` y en un ADR.

### 5.1 Flujo técnico detallado (a documentar en el ADR de sincronización)

1. Cliente escanea/capta documento → ejecuta Core DDD → calcula `FileHash` (Rust Wasm) → guarda localmente en `document_outbox` con `PENDING`.
2. Sin red: queda en cola, sin afectar nada más.
3. Con red: orquestador solicita a GraphQL los **ids que ya existen** en la nube (para no re-subir binarios duplicados).
4. Para los nuevos: obtiene **presigned URL** por GraphQL, sube el binario directamente al storage, y marca el outbox como `UPLOADED`.

---

## 6. Procesamiento en el Cliente con Rust en el Edge (Web Worker + Wasm)

Genera la crate **`rust/wasm-engine`** y el **puente TS-Wasm**. Debes configurar:

- **`wasm-bindgen`** para exportar funciones a TypeScript.
- **Web Worker** para mover el procesamiento pesado fuera del hilo principal.
- Misiones de Rust:
  1. **Binarización de imágenes:** convertir a blanco y negro puro (mejora legibilidad y reduce drásticamente el tamaño).
  2. **Compresión:** usando la crate `image` de Rust.
  3. **`FileHash` criptográfico:** usando la crate `sha2` (SHA-256).
- **TDD en Rust:** `cargo test` para cada función de procesamiento (testear que la binarización funciona, que la compresión reduce tamaño, que el hash es correcto y estable).

---

## 7. Biblioteca de Skills Agénticos a Generar

Crea bajo `.agents/skills/` cada skill como una carpeta con su `SKILL.md` (siguiendo el patrón y calidad de la librería de skills n8n ya existente en el repo, adaptada al desarrollo de esta app):

1. **`ddd-structured-development`/** — guía para construir respetando capas DDD, invariantes de dominios, dependencias hacia adentro.
2. **`tdd-workflow`/** — ciclo Red/Green/Refactor, cómo escribir tests antes del código, mocks de red para offline.
3. **`ui-dumb-components`/** — plantilla canónica de dumb components y reglas de props/callbacks.
4. **`rust-wasm-processing`/** — cómo escribir y publicar lógica Rust→Wasm (binarización, compresión, hashing) y exponerla vía Web Worker.
5. **`offline-sync`/** — arquitectura append-only, outbox, drenaje, verificación de existencia, presigned URLs.
6. **`react-tauri-capacitor`/** — cómo esstrenar el core compartido entre web/desktop/mobile sin duplicar lógica.
7. **`naming-conventions`/** — las reglas PascalCase/camelCase, cuándo aplica cada una.
8. **`graphql-contracts`/** — generación y uso de tipos GraphQL compartidos en `@ged/contracts`.

Cada `SKILL.md` debe incluir: **cuándo usar el skill**, **reglas no negociables**, **checklist de verificación** y un **ejemplo canónico** (adaptado del dominio GED).

---

## 8. Valor Inicial y Estructura de Archivos de Reglas

Además de los skills, genera **obligatoriamente**:

1. **`AGENTS.md`** (raíz) — rol del agente, principios (ejecución silenciosa, plantillas primero, validación multi-nivel, nunca confiar en defaults, TDD obligatorio), y proceso de trabajo. Incluir la nota de la Sección 1.3 sobre n8n diferido.
2. **`docs/architecture/`** — diagramas y descripciones de la arquitectura append-only offline, DDD, monorepo.
3. **`docs/adr/`** — al menos estos ADRs (Architecture Decision Records):
   - `0001-use-capacitor-over-react-native.md`
   - `0002-append-only-offline-metadata.md`
   - `0003-outbox-pattern-for-sync.md`
   - `0004-rust-wasm-for-client-processing.md`
   - `0005-monorepo-with-turborepo-or-nx.md`
   - `0006-defer-n8n-automation.md`
   - `0007-presigned-url-upload-to-object-storage.md`
4. **`.gitignore`** — excluye `node_modules`, `dist`, `.env`, `*.sqlite` (según política), bins de Rust, etc.
5. **`tsconfig.base.json`** + configs por paquete con **strict mode** habilitado.
6. **`vitest.config.*`** y **`Cargo.toml`** por crate.

---

## 9. Checklist Obligatoria de Verificación (el agente DEBE ejecutarla y reportarla)

Al finalizar, el agente debe ejecutar y reportar el estado (**✅ CUMPLIDO** / **❌ FALLIDO / ⚠️ PARCIAL**) de cada ítem:

- [ ] **A. Estructura monorepo creada** (Turborepo o Nx) con `apps/web`, `apps/desktop`, `apps/mobile`, `packages/core`, `packages/ui`, `packages/contracts`, `rust/`.
- [ ] **B. Capas DDD correctas** en `@ged/core` (domain/application/infrastructure) con dependencias hacia adentro verificables.
- [ ] **C. Configuración agentica** (`AGENTS.md` + `.agents/rules/` + `.agents/skills/`) completa y coherente con este documento.
- [ ] **D. Archivo de n8n diferido** (`.agents/n8n-future/FUTURE_README.md`) creado, con puntos de integración y contratos neutrales. **Sin código n8n.**
- [ ] **E. Dumb components** demostrados con la plantilla canónica (`DocumentUploadList`).
- [ ] **F. TDD aplicado:** existen pruebas (Vitest) en dominio y aplicación; existe al menos un `__tests__/QueueDocumentForUpload.test.ts` que simula offline (mock de red).
- [ ] **G. Rust crate** `wasm-engine` con binarización, compresión (`image`) y hashing (`sha2`), con `cargo test` pasando.
- [ ] **H. Outbox/append-only:** colección `document_outbox` + casos de uso de enqueue y drenaje documentados/implementados.
- [ ] **I. Convención de código** (PascalCase/camelCase) aplicada en los archivos generados.
- [ ] **J. Lint + typecheck** con **cero errores** (`.ts`, `.tsx`, Rust `cargo check`).
- [ ] **K. ADRs** creados (mínimo los 7 listados en Sección 8).
- [ ] **L. Reporte final** con el estado de cada ítem de esta checklist.

---

**FIN DEL PROMPT DEL AGENTE**

---

---

## Notas de Configuración Posterior (Contexto, no parte del prompt)

- **Puntos de integración de n8n futuros:** notificaciones, reportes automáticos, ingesta masiva y alertas. Implementar según `CONSILIUM_RULES.md` punto 12 (patrones) y punto 16 (self-hosting) cuando se decida.
- **Soberanía de datos:** el backend es *self-hostable* (GraphQL + NestJS + PostgreSQL + MinIO). Relevante en contexto judicial.
- **Escalabilidad del storage:** la subida por **presigned URL** mantiene el servidor API libre de la carga binaria.

---

*Documento generado el 8 de septiembre de 2026. Especificación ejecutable para el agente; depende de `CONSILIUM.md` (estado actual) y `CONSILIUM_RULES.md` (razonamiento).*
