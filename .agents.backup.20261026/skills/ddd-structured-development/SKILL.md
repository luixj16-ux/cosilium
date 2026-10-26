# Skill: DDD Structured Development

Use when creating, extending, or refactoring domain logic in `@consilium/core`
(aggregates, value objects, use cases, ports, infrastructure).

## Rules
1. **Domain is transport-agnostic** — no imports of RxDB, WebCrypto, Express,
   Apollo, or React inside `packages/core/src/domain`.
2. **One file per aggregate/value-object/use-case/port** — filename = the type.
3. **Dependencies point inward**: `application` → `domain`; `infrastructure`
   implements `domain/ports` but never changes domain types.
4. **Aggregate methods must enforce transitions** — a state change outside the
   allowed graph in `domain-rules.md` is rejected at the domain level, not
   silently allowed by the caller.
5. **Value objects are immutable** (`readonly` fields, factory functions).
6. **Ports are interfaces** declared in `domain/ports`; the real adapters (RxDB,
   WebCrypto, presign) live in `infrastructure` and are injected by the caller or
   the apps at composition time.
7. **Use cases orchestrate, never read the table** — they depend only on ports.

## Workflow
1. Read `packages/core/src/domain` and `.agents/rules/domain-rules.md`.
2. Add the new value object/entity → its transitions → ports → use case.
3. Write a failing test in `packages/core/__tests__/<layer>/` BEFORE the
   implementation (TDD) or alongside if extending an existing flow.
4. Run `npm run test --workspace @consilium/core`.
5. Run `npm run typecheck --workspace @consilium/core`.

## Red flags
- `infrastructure` imports `application` classes directly (must be injected).
- Aggregate exposes setters instead of behavior methods (`markAsUploaded`, …).
- `fileHash` typed `string` instead of `FileHash | null` where optional.
- Page count allowed past `MAX_OFFLINE_PAGE_COUNT` (500).