# 🛠️ TAREA: Eliminar CONSILIUM.md e Indexar Contenido en Reglas Agénticas
**ID:** #002 | **Estado:** 🟡 EN CURSO | **Fecha:** 2026-10-26

---

## 🎯 OBJETIVO FINAL
Eliminar archivo legacy CONSILIUM.md y migrar todo el conocimiento de dominio judicial relevante a `.agent/rules/` (global-context + design-system) con `trigger: always_on`.

---

## 🚦 PUNTO DE CONTROL (Contexto de Reanudación)
- **Lo último que funcionó:** Fase 4 completada - 6 quality gates PASSED
- **Dónde se detuvo:** Fase 5 - Commit y push a feature branch
- **Siguiente acción inmediata:** Stage changes, commit con @git-commit-formatter, push, crear PR

---

## 📝 CAMBIOS TÉCNICOS CLAVE
- [x] **Fase 1:** Auditoría y extracción de gaps de CONSILIUM.md
- [x] **Fase 2:** Crear/actualizar archivos en `.agent/rules/global-context/` y `.agent/rules/design-system/`
  - `global-context/domain-context.md` - Identidad, jurisdicciones, estados, leyes, glosario
  - `global-context/legacy-stack.md` - Stack tecnológico legacy reference
  - `global-context/legacy-architecture.md` - Arquitectura legacy reference
  - `global-context/legacy-api.md` - Endpoints legacy reference
  - `global-context/domain-model.md` - Schema SQLite + mapeo DDD
  - `global-context/auth-model.md` - Auth, roles, permisos, riesgos
  - `global-context/n8n-legacy.md` - Config n8n/MCP legacy reference
  - `global-context/domain-seed-data.md` - Datos semilla (courts, cases, laws, news)
  - `global-context/deployment-legacy.md` - Despliegue legacy reference
  - `design-system/legacy-tokens.md` - Tokens diseño legacy completos
  - `design-system/colors.md` - Actualizado con paleta TSJ oficial
  - `design-system/specs.md` - Actualizado con componentes legacy a migrar
- [x] **Fase 3:** Eliminar CONSILIUM.md del repositorio
- [x] **Fase 4:** Ejecutar 6 quality gates (builds gate) ✅ ALL PASSED
  - `npm run typecheck` → 0 errores
  - `npm run test` → 164 tests passed
  - `npm run lint:conventions` → sin violaciones
  - `cargo check --workspace` → 0 errores
  - `cargo test --workspace` → 17 tests passed
  - `cargo check --workspace --target wasm32-unknown-unknown` → 0 errores
- [ ] **Fase 5:** Feature branch → PR → merge a dev

---

## ⚠️ NOTAS DE MEMORIA
- *Regla:* PLAN FIRST aprobado por usuario (respuestas: 1=Sí legacy, 2=Sí preservar domain knowledge, 3=Sí trigger always_on)
- *Regla:* Feature branch `docs/remove-consilium-md` → PR → merge a dev
- *Regla:* BUILDS GATE = 6 comandos (typecheck, test, lint, cargo check, cargo test, cargo check wasm)
- *Branch:* docs/remove-consilium-md (desde dev)
- *Commit:* pendiente (usar @git-commit-formatter)