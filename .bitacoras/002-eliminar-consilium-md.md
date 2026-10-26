# 🛠️ TAREA: Eliminar CONSILIUM.md e Indexar Contenido en Reglas Agénticas
**ID:** #002 | **Estado:** 🟡 EN CURSO | **Fecha:** 2026-10-26

---

## 🎯 OBJETIVO FINAL
Eliminar archivo legacy CONSILIUM.md y migrar todo el conocimiento de dominio judicial relevante a `.agent/rules/` (global-context + design-system) con `trigger: always_on`.

---

## 🚦 PUNTO DE CONTROL (Contexto de Reanudación)
- **Lo último que funcionó:** Commit 34916a7 en dev corrigiendo AGENTS.md
- **Dónde se detuvo:** Iniciando fase 1 - auditoría de contenido CONSILIUM.md
- **Siguiente acción inmediata:** Extraer conocimiento único no presente en reglas actuales

---

## 📝 CAMBIOS TÉCNICOS CLAVE
- [ ] **Fase 1:** Auditoría y extracción de gaps de CONSILIUM.md
- [ ] **Fase 2:** Crear/actualizar archivos en `.agent/rules/global-context/` y `.agent/rules/design-system/`
- [ ] **Fase 3:** Eliminar CONSILIUM.md del repositorio
- [ ] **Fase 4:** Ejecutar 6 quality gates (builds gate)
- [ ] **Fase 5:** Feature branch → PR → merge a dev

---

## ⚠️ NOTAS DE MEMORIA
- *Regla:* PLAN FIRST aprobado por usuario (respuestas: 1=Sí legacy, 2=Sí preservar domain knowledge, 3=Sí trigger always_on)
- *Regla:* Feature branch `docs/remove-consilium-md` → PR → merge a dev
- *Regla:* BUILDS GATE = 6 comandos (typecheck, test, lint, cargo check, cargo test, cargo check wasm)
- *Branch:* docs/remove-consilium-md (desde dev)
- *Commit:* pendiente (usar @git-commit-formatter)
