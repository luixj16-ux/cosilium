---
trigger: always_on
---
# Self-Maintenance: Actualización Post-Flight — CONSILIUM

## ⏱ Cuándo se ejecuta
**SOLO** después de que la bitácora de la tarea se marque como:
- `✅ FINALIZADO`
- `✅ COMPLETADO`

NO se ejecuta antes, durante, ni en medio de la tarea. Es un **post-flight check** al cierre del ciclo de vida de la tarea.

## 📊 Matriz de Actualización

| Si la tarea COMPLETADA implicó… | Entonces DEBES actualizar… |
|-----------------------------------|------------------------------|
| Nueva capa DDD / nuevo aggregate / VO / invariante | `global-context.md` (sección Domain) + `development-invariants.md` si cambia Root Cause |
| Nuevo Use Case / Puerto | `global-context.md` (Application) + `technical-rules.md` |
| Nuevo repositorio / adaptador (RxDB, WASM, FS) | `global-context.md` (Infrastructure) + `sync-architecture.md` si toca outbox |
| Nuevo componente dumb / patrón UI | `design-system/` (ui-elements, specs, lists-tables) + skill `ui-dumb-components` |
| Nueva función Rust (hash, binarizar, comprimir, nuevo) | `rust/wasm-engine` o `rust/tauri-native` + skill `rust-wasm-processing` |
| Cambio en stack (Turborepo, RxDB, Tauri, Capacitor, Rust toolchain) | `global-context.md` (Tech Stack) + `local-deploy.md` |
| Nueva ruta en apps / API GraphQL | `route-map.md` |
| Nueva regla de desarrollo (TDD, naming, DDD, offline) | `development-invariants.md` + `checklist-verify.md` |
| Nueva convención naming | **Solo** skill `naming-conventions` + `AGENTS.md` §Nomenclatura (no archivo duplicado) |
| Nueva regla de accesibilidad / contraste | `accessibility.md` + `design-system/colors.md` |
| Cambio en protocolo deploy local | `local-deploy.md` |
| Cambio en flujo Git / PR / commits | `AGENTS.md` + `git-workflow.md` |
| Cambio en checklist de verificación | `checklist-verify.md` |
| Cambio en prompts de agentes opencode | `opencode.json` |
| Nuevo ADR (decisión arquitectónica) | `docs/adr/NNNN-descripcion.md` + referenciar en `global-context.md` |
| Deprecación de regla existente | Archivo correspondiente + marcar `⚠️ DEPRECATED` |

## 🚦 Indicadores de Auto-Mantenimiento
Responde **SÍ** a alguna de estas preguntas al finalizar la tarea:
- [ ] ¿La tarea introdujo un nuevo patrón que no existía antes? (ej: nuevo aggregate, nuevo UseCase, nuevo puerto)
- [ ] ¿La tarea modificó la forma en que cliente y servidor se comunican? (GraphQL, presigned URL, outbox)
- [ ] ¿La tarea agregó una dependencia externa nueva (servicio, SDK, API, crate Rust)?
- [ ] ¿La tarea creó un nuevo tipo de componente dumb que se usará en múltiples lugares?
- [ ] ¿La tarea cambió reglas de estilo, colores, o componentes visuales?
- [ ] ¿La tarea modificó el flujo de trabajo (Git, PR, revisión, commits)?
- [ ] ¿La tarea agregó o eliminó una convención de desarrollo?

Si alguna respuesta es **SÍ** → actualizar el/los archivos según la matriz.

## 🛑 Regla de Oro
Documenta **SOLO** lo que la tarea realmente construyó, no lo que planeaste. La verdad la tiene el código completado, no el plan inicial. Si el cambio arquitectónico fue menor o no evidente, NO fuerces una actualización.

## Referencias
- `checklist-verify.md` (sección Post-Flight).
- `git-workflow.md` paso 8 (Final Sequence).
- `AGENTS.md` (Regla 0.5 – Secuencia Final Obligatoria).