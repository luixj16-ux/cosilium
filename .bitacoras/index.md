# 🗺️ MAPA DE BITÁCORAS — CONSILIUM

## ⚠️ IMPORTANTE - LEE ESTO PRIMERO
**Antes de continuar con cualquier tarea, DEBES leer `.bitacoras/actual.md` para obtener el contexto actual del proyecto.**

---

## 🚩 ESTADO ACTUAL
- **Tarea activa:** *ninguna*
- **Última completada:** `#002 - Eliminar CONSILIUM.md e Indexar Contenido`
- **Branch actual:** `dev` (feature branch: `docs/remove-consilium-md` pushed)
- **Historial:** `#001`, `#002` completadas.

---

## 📂 HISTORIAL DE TAREAS
*(se irá poblando conforme se completen tareas)*

- **#001** ✅ Configuración Agentica Inicial — 2026-10-25
- **#002** ✅ Eliminar CONSILIUM.md e Indexar Contenido — 2026-10-26

---

## 🛠️ REGLAS DE ORO (DE CUMPLIMIENTO OBLIGATORIO)

### 📋 PLANTILLA DE BITÁCORA (OBLIGATORIO SEGUIR)
> Todas las bitácoras DEBEN seguir la estructura definida en `00-plantilla.md`

**Ver plantilla completa:** [.bitacoras/00-plantilla.md](./00-plantilla.md)

---

### 📖 Documentación Obligatoria (LEER SIEMPRE)
> Estas son tus fuentes de verdad - NO NEGOCIABLE

1. **AGENTS.md** - Configuración del agente y reglas fundamentales
2. **.agent/rules/global-context/global-context.md** - Reglas globales del proyecto (Tech Stack, Arquitectura, Calidad)
3. **.agent/rules/checklist-verify.md** - Checklist obligatorio antes de cada tarea
4. **.agent/workflows/git-workflow.md** - Flujo de trabajo Git (commit directo en `dev`)

### 🎨 Design System
- **.agent/rules/design-system/index.md** - Tokens, colores, componentes dumb
- **Regla:** UI dumb = sin estilos propios, solo props/callbacks

### 🔧 Git Workflow (CUMPLIMIENTO OBLIGATORIO)
- **.agent/workflows/git-workflow.md** - Flujo de trabajo completo (10 pasos: 9.4 Commit Final + 9.5 PR)
- **Regla:** NUNCA trabajar en `main` ni en `dev`; trabajo directo solo en feature branch
- **Regla:** Usar `@git-branch-formatter` para naming
- **Regla:** Usar `@git-commit-formatter` para mensajes de commit
- **Regla:** PR — solo a `dev` tras aprobación, post-flight, **y commit final de bitácoras (git status limpio)**

### 📋 Checklist de Verificación
- **.agent/rules/checklist-verify.md** - Checklist obligatorio antes de cada tarea

---

## 📊 FLUJO DE TRABAJO RECOMENDADO

```
1.  **TRIAGE INICIAL:** Determinar el ámbito de la tarea.
    *   **¿Es EXENTA?** (Cambios en `.agent/`, `AGENTS.md`, `opencode.json`, docs, config).
        *   👉 Acción: Presentar Plan de Acción breve -> Obtener aprobación -> Ejecutar. (Fin del flujo).
    *   **¿Es TRACKEABLE?** (Código fuente en `packages/`, `apps/`, `rust/`, `server/`).
        *   👉 Acción: Continuar al paso 2.

2.  **INMERSIÓN DE CONTEXTO:**
    *   LEER `.bitacoras/index.md` (este archivo).
    *   LEER `.bitacoras/actual.md` para entender el estado de la misión.
    *   Consultar `.agent/rules/global-context/global-context.md` y `.agent/rules/design-system/index.md` para asegurar cumplimiento técnico y visual.

3.  **PREPARACIÓN DE ENTORNO (Git):**
    *   `git checkout dev && git pull` (sincronizar con dev).
    *   Crear rama de trabajo desde `dev` usando `@git-branch-formatter`.

4.  **PLANIFICACIÓN Y EJECUCIÓN:**
    *   Presentar Plan de Acción detallado (PLAN FIRST).
    *   Ejecutar **PRE-FLIGHT CHECK** antes de escribir código.
    *   Implementar cambios siguiendo estándares DDD, TDD, UI dumb, offline-first.

5.  **FINALIZACIÓN Y REGISTRO:**
    *   Ejecutar **BUILDS GATE** (6 comandos) antes de commit.
    *   Commit en rama de trabajo usando `@git-commit-formatter`.
    *   Push a rama de trabajo remota.
    *   **Confirmación usuario: tarea COMPLETADA.**
    *   Actualizar bitácoras (`.bitacoras/###-tarea.md`, `index.md`, `actual.md` → plantilla).
    *   **POST-FLIGHT:** self-maintenance.md → actualizar configs si aplica.
    *   **Commit final de cierre:** `git add .` → `@git-commit-formatter` → `git commit` → `git push` (bitácoras + post-flight).
    *   Verificar `git status` → **working tree clean (sin cambios pendientes)**.
    *   Crear **Pull Request hacia `dev`** (base: `dev`).
    *   Tras merge aprobado, la rama de trabajo puede eliminarse.
    *   Confirmar completado → cerrar tarea.
```

---

*Actualizado: 2026-10-26* *Tarea #002 completada: CONSILIUM.md eliminado, 12 archivos creados/actualizados en .agent/rules/, PR pendiente*