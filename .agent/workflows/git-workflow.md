---
trigger: always_on
---
# Git Workflow — CONSILIUM (9 pasos, commit directo en `dev`)

## 0. PRE-FLIGHT CHECK
- `git status` → confirmar rama actual.
- **Abortar si estás en `main`**. Trabajo directo en `dev`.

## 1. PLAN FIRST (Regla Suprema)
1. Crear plan detallado (objetivo, fases, archivos, riesgos).
2. Presentar al usuario en formato estructurado (tablas/listas).
3. **Esperar aprobación explícita** antes de escribir código.
4. Sin plan aprobado → NO hay código.

## 2. SYNC CON `dev`
```bash
git checkout dev
git pull
```

## 3. BRANCH — **NO SE CREA RAMA DE TRABAJO**
- Commit directo en `dev` (según política CONSILIUM).
- Si se requiere aislamiento temporal, crear rama local **solo** para experimentación y squash antes de commit en `dev`.

## 4. DESARROLLO POR FASES
Para cada fase del plan aprobado:
1. Identificar fase actual.
2. Implementar cambios.
3. **BUILDS GATE** (ejecutar y pasar):
   - `npm run typecheck`
   - `npm run test`
   - `npm run lint:conventions`
   - `cargo check --workspace`
   - `cargo test --workspace`
   - `cargo check --workspace --target wasm32-unknown-unknown`
4. Si **algún build falla** → CORREGIR, no commit.
5. Solo avanzar a siguiente fase cuando todo pase.

## 5. COMMIT
```bash
git add .
git commit -m "$(@git-commit-formatter)"
```
- Usar skill `git-commit-formatter` para mensaje Conventional Commits.

## 6. PUSH DIRECTO A `dev`
```bash
git push
```
- **Sin Pull Request**.

## 7. STOP — APROBACIÓN DE FASE
1. Mostrar resumen de lo implementado en la fase.
2. (Opcional) Re-ejecutar builds gate.
3. **Esperar aprobación explícita del usuario** para continuar.
4. Si hay más fases → volver a paso 4.
5. Si es última fase → paso 8.

## 8. SECUENCIA FINAL OBLIGATORIA
1. **Confirmación usuario**: esperar "TAREA COMPLETADA".
2. **Actualizar bitácoras**:
   - Crear/actualizar `.bitacoras/###-nombre-tarea.md`.
   - Actualizar `.bitacoras/index.md`.
   - Limpiar `.bitacoras/actual.md` (mantener formato plantilla).
3. **AUTO-MANTENIMIENTO (Post-Flight)**:
   - Leer `.agent/rules/global-context/self-maintenance.md`.
   - Aplicar matriz línea por línea.
   - Si hay cambios → actualizar archivos correspondientes.
   - Si NO → marcar "Sin cambios requeridos" en bitácora.
4. **Commit final en `dev`** (si hubieron cambios de post-flight) y push.

## Notas
- Los comandos de build usan `package.json` scripts y `cargo`.
- `npm run lint:conventions` ejecuta `.agents/scripts/check-conventions.mjs`.
- `cargo check --workspace --target wasm32-unknown-unknown` valida compilación WASM.
- Cualquier fallo en quality gates **bloquea** el commit.