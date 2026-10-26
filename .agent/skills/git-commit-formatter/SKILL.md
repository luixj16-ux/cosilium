---
name: git-commit-formatter
description: Formatea mensajes de commit git según Conventional Commits adaptado a CONSILIUM. Usar en cada commit.
---

# Git Commit Formatter — CONSILIUM

## Formato
`<type>[optional scope]: <description>`

## Tipos permitidos
- **feat**: Nueva funcionalidad
- **fix**: Corrección de bug
- **docs**: Solo documentación
- **style**: Formato, whitespace, sin cambio de lógica
- **refactor**: Cambio de código que no fix ni feat
- **perf**: Mejora de rendimiento
- **test**: Agregar/fix tests
- **chore**: Build, deps, tooling, docs internas
- **adr**: Nuevo ADR (Architecture Decision Record)

## Reglas
1. Analizar cambios → determinar `type` primario.
2. Identificar `scope` si aplica (ej. `core`, `ui`, `rust`, `docs`, `agent`).
3. Descripción **imperativo**, concisa (< 72 chars): `"add feature"` no `"added feature"`.
4. Si **BREAKING CHANGE**: footer `BREAKING CHANGE: <descripción>`.
5. Body opcional con motivación / contexto (wrap 72 cols).

## Ejemplos
- `feat(core): add DocumentAggregate queueForUpload method`
- `fix(rust): correct SHA-256 padding in wasm hash`
- `docs(adr): add ADR-0008 for Capacitor plugins`
- `chore(agent): add git-branch-formatter skill`
- `refactor(ui): extract DocumentRow to dumb component`
- `test(core): add MockDocumentRepository for offline tests`
- `perf(rust): optimize image compression in wasm-engine`
- `adr: add 0008-capacitor-plugin-camera.md`

## Commit Message Template (para git config)
```
<type>(<scope>): <subject>

<body>

BREAKING CHANGE: <description>
```