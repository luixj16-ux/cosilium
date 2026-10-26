# 🛠️ TAREA: Configuración Agentica Inicial
**ID:** #001 | **Estado:** 🟡 EN CURSO | **Fecha:** 2026-10-25

---

## 🎯 OBJETIVO FINAL
Validar configuración agentica completa (estructura .agent/, skills, workflows, bitácoras, opencode.json, AGENTS.md fusionado) y cerrar tarea #001.

---

## 🚦 PUNTO DE CONTROL (Contexto de Reanudación)
- **Lo último que funcionó:** Estructura .agent/ creada, archivos de reglas, skills, workflow, bitácoras, opencode.json generados.
- **Dónde se detuvo:** Pendiente ejecutar quality gates (typecheck, test, lint, cargo) y commit final.
- **Siguiente acción inmediata:** Ejecutar `npm run typecheck && npm run test && npm run lint:conventions && cargo check --workspace && cargo test --workspace && cargo check --workspace --target wasm32-unknown-unknown`.

---

## 📝 CAMBIOS TÉCNICOS CLAVE
- [x] Backup .agents → .agents.backup.20261025
- [x] Renombrar .agents → .agent (singular)
- [x] Crear carpetas .agent/rules/{design-system,global-context}, .agent/skills/{git-branch-formatter,git-commit-formatter}, .agent/workflows, .bitacoras
- [x] Mover rules existentes a .agent/rules/global-context/
- [x] Crear checklist-verify.md
- [x] Crear global-context/{index,global-context,development-invariants,route-map,technical-rules,naming-conventions,accessibility,local-deploy,push-notifications,reports-system,self-maintenance}.md
- [x] Crear design-system/{index,colors,specs,ui-elements,lists-tables,migration-mapping}.md
- [x] Crear skills git-branch-formatter y git-commit-formatter
- [x] Crear workflow git-workflow.md
- [x] Crear bitácoras 00-plantilla.md, index.md, actual.md
- [x] Crear opencode.json con 3 agentes (plan/build/code-reviewer)
- [ ] Fusionar AGENTS.md (reglas supremas + protocolo + sources)
- [ ] Añadir trigger: always_on a todos .agent/rules/**/*.md
- [ ] Ejecutar quality gates (6 comandos) → 0 errores
- [ ] Commit usando git-commit-formatter → push directo a dev
- [ ] Actualizar bitácora #001 → ✅ COMPLETADO
- [ ] Post-flight self-maintenance → "Sin cambios requeridos"

---

## ⚠️ NOTAS DE MEMORIA
- *Regla:* PLAN FIRST obligatorio antes de cualquier código (ya cumplido en plan).
- *Regla:* STOPS POR FASE — cada fase termina con builds gate + aprobación (simulada aquí).
- *Regla:* BUILDS GATE CONSILIUM = 6 comandos (typecheck, test, lint, cargo check, cargo test, cargo check wasm).
- *Regla:* NO PR — push directo a `dev` tras aprobación y post-flight.
- *Branch:* dev (trabajo directo).
- *Commit:* pendiente (usar @git-commit-formatter).