---
name: git-branch-formatter
description: Formatea nombres de ramas git según convención CONSILIUM. Usar cuando se cree una nueva rama (aunque en CONSILIUM se hace commit directo en dev, la skill sirve para命名 convenciones en otros contextos).
---

# Git Branch Naming Convention — CONSILIUM

Cuando se crea una rama (ej. para feature aislando), DEBE seguir esta estructura:
`<type>/<short-description>`

## Tipos permitidos
- **feat**: Nueva funcionalidad o módulo (ej. `feat/document-upload`).
- **fix**: Corrección de bug (ej. `fix/hash-collision`).
- **refactor**: Mejora sin nueva funcionalidad (ej. `refactor/outbox-repo`).
- **docs**: Actualización de documentación (ej. `docs/adr-0008`).
- **chore**: Mantenimiento, deps, config (ej. `chore/update-rust`).
- **hotfix**: Corrección urgente en producción.

## Reglas
1. **Lowercase only**.
2. **Kebab-case** para separar palabras.
3. **Máx 3 palabras** en descripción.
4. Si hay issue ID: prefix `<type>/#<id>-<desc>` (ej. `fix/#42-null-pointer`).

## Ejemplos
- `feat/document-upload`
- `fix/hash-dedup`
- `refactor/outbox-repo`
- `docs/adr-0008`
- `chore/update-deps`
- `hotfix/#123-critical-crash`