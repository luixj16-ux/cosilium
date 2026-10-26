# 🗺️ MAPA DE BITÁCORAS — CONSILIUM

## ⚠️ IMPORTANTE - LEE ESTO PRIMERO
**Antes de continuar con cualquier tarea, DEBES leer `.bitacoras/actual.md` para obtener el contexto actual del proyecto.**

---

## 🚩 ESTADO ACTUAL
- **Tarea activa:** *ninguna*
- **Última completada:** *Inicialización agentica*
- **Branch actual:** `dev`
- **Historial vacío** (empezar en `#001`).

---

## 📂 HISTORIAL DE TAREAS
*(se irá poblando conforme se completen tareas)*

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
- **.agent/workflows/git-workflow.md** - Flujo de trabajo completo (9 pasos)
- **Regla:** NUNCA trabajar en `main`; trabajo directo en `dev`
- **Regla:** Usar `@git-branch-formatter` para naming (aunque no se cree rama)
- **Regla:** Usar `@git-commit-formatter` para mensajes de commit
- **Regla:** NO PR — push directo a `dev` tras aprobación y post-flight

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
    *   *No se crea rama de trabajo* (commit directo en dev).

4.  **PLANIFICACIÓN Y EJECUCIÓN:**
    *   Presentar Plan de Acción detallado (PLAN FIRST).
    *   Ejecutar **PRE-FLIGHT CHECK** antes de escribir código.
    *   Implementar cambios siguiendo estándares DDD, TDD, UI dumb, offline-first.

5.  **FINALIZACIÓN Y REGISTRO:**
    *   Ejecutar **BUILDS GATE** (6 comandos) antes de commit.
    *   Commit usando `@git-commit-formatter`.
    *   Push directo a `dev`.
    *   Actualizar `.bitacoras/actual.md` y crear/actualizar bitácora correspondiente según `00-plantilla.md`.
    *   **POST-FLIGHT:** self-maintenance.md → actualizar configs si aplica.
    *   Confirmar completado → cerrar tarea.
```

---

*Actualizado: 2026-10-25* *Inicialización agentica completada — estructura .agent/, skills, workflows, bitácoras, opencode.json creados; quality gates pendientes*