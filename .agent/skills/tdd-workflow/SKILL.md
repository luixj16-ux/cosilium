# Skill: TDD Workflow

Use whenever implementing or fixing behavior in `packages/core`, `rust/wasm-engine`,
`rust/tauri-native`, or `server/*` — the rule is red → green → refactor.

## Loop
1. **Red**: write the failing test first.
   - Core: `packages/core/__tests__/<layer>/<UseCase>.test.ts` (vitest).
   - Rust: `#[cfg(test)]` module at the bottom of the owning file.
2. **Green**: minimal implementation to pass.
3. **Refactor**: remove duplication, keep domain rules intact.
4. **Run the suite every step**:
   - `npm run test --workspace @consilium/core`
   - `cargo test --workspace` (cargo test needs `$HOME/.cargo/bin` in PATH)
5. Typecheck after green: `npm run typecheck`.

## Test style
- Domain tests exercise the aggregate via its public behavior (e.g.
  `markAsUploaded`, `isDuplicateOf`), not internals.
- Use case tests inject **fakes** from `__tests__/mocks/` (`MockDocumentRepository`,
  `MockDocumentHasher`, `FakeRemoteRegistry`, `FakeUploader`). Never hit the real
  DB or network.
- The canonical offline test (`QueueDocumentForUpload.test.ts`) simulates a
  connection drop mid-upload and asserts the document is `FAILED` and
  re-enqueueable.

## Golden rules
- No implementation without a failing test (unless merely renaming/moving code
  with coverage).
- Never mock the thing under test; make fakes for the ports it touches.
- Keep each test asserting one behavior; descriptive Spanish when naming
  scenarios (e.g. `un_corte_de_red_deja_el_documento_failed_y_reintentable`).