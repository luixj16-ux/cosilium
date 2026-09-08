# Skill: UI Dumb Components

Use when building or editing React UI in `packages/ui` or `apps/*`. The goal:
**components stay "tontos"** — they render props and emit callbacks, they hold
no domain logic and never query data on their own.

## Rules
1. **Props in, events out.** A component receives data and callbacks
   (`onUpload`, `onRetry`, …). It does not import `@consilium/core` use cases.
2. **No data fetching or storage in components.** An app page fetches from the
   repository, maps to a plain shape, then passes it down. (Fase actual: estado
   en memoria / fakes; el wiring a RxDB vive en las apps, no en UI.)
3. **No router imports in `packages/ui`** — routers belong to the app shell.
4. **Types from `@consilium/contracts`** (`DocumentPayload`) as props, not from
   core aggregates, to keep UI decoupled from persistence details.
5. **State derivation stays in the component** (local, e.g. pressing state);
   business state transitions come from the parent/use-case.
6. **Accessible**: buttons are `<button>`, actions have `aria-label` when icon-only.

## Shape
```
const DocumentRow = ({ document, onRetry }: { document: DocumentPayload; onRetry?: (id: string) => void })
```
- Never `import { useDocuments }` style hooks in `packages/ui`.
- Empty/loading/error states are explicit props (`variant="error"`) or simple
  conditional renders, not thrown exceptions.

## Verification
- `npm run typecheck --workspace @consilium/ui`
- Check no `@consilium/core` imports sneak into `packages/ui`.