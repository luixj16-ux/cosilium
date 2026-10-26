# Skill: Naming Conventions

Use to keep names consistent across the monorepo. This project started with a
brand/typographic mismatch — project directory is `CONSILIUM/` (one I), brand is
CONSILIIUM (double I). Follow the conventions below and never mix them again.

## Naming map
| What | Convention | Example |
|---|---|---|
| Workspace/package | `@consilium/*` | `@consilium/core`, `@consilium/ui` |
| Root dirs | lower-case | `packages/`, `apps/`, `rust/`, `server/`, `docs/`, `legacy/` |
| Case classes (TS) | PascalCase, one per file | `DocumentAggregate.ts` |
| Use cases | `<Verb>...UseCase` | `QueueDocumentForUploadUseCase.ts` |
| Ports | `<Noun>Port` | `DocumentRepository`, `ObjectStorageUploader` |
| Value objects | PascalCase | `DocumentId`, `FileHash`, `PageCount` |
| Fakes/mocks | `Mock`/`Fake` prefix | `MockDocumentRepository`, `FakeUploader` |
| GraphQL fields | camelCase | `presignedUploadUrl`, `verifyDocumentsExistence` |
| Rust | `snake_case` funcs, `SCREAMING_SNAKE` consts | `sha256_hex`, `MAX_OFFLINE_PAGE_COUNT` |
| Rust dirs | kebab-case | `wasm-engine`, `tauri-native` |
| DB/collection | `snake_case` | `document_outbox` |
| N8n (future) | integrations labeled n8n-future | `.agents/n8n-future/` |

## Rules
1. **Brand text: CONSILIIUM** (double I) in prose/branding; **project dirs and
   packages use CONSILIUM** (single I). Do not "fix" one to match the other —
   that's baked into the plan (MASTER_INIT_PROMPT).
2. States are SCREAMING_SNAKE (`PENDING_UPLOAD`, `UPLOADED`, `FAILED`).
3. UI props use camelCase; events prefix `on` (`onRetry`, `onUpload`).
4. Spanish for comments/test scenario names; English for identifiers/API.
5. File naming mirrors the symbol it exports (case-sensitive).