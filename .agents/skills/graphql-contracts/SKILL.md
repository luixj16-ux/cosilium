# Skill: GraphQL Contracts

Use when changing anything contract-facing: queries/mutations in
`server/src/graphql/schema.graphql`, types in `@consilium/contracts`, or how
apps consume data.

## Source of truth
`server/src/graphql/schema.graphql` is the single schema. From it, in
production, `graphql-codegen` generates `packages/contracts/src/graphql/generated-types.ts`.
That generated file is currently handwritten/kept in sync and MUST match the
schema — if you change one, change both.

## Rule of thumb
- **Schema first.** Define the wire contract, then implement the app against
  `@consilium/contracts` types (client lives on generated/types, not on server).
- Hashing and existence checks are **queries** (`verifyDocumentsExistence`).
- Upload-URL issue is a **mutation** (`presignedUploadUrl`).
- Avoid forcing transport-specific types into contracts (`packages/contracts`
  stays transport-neutral JSON).

## Conventions
1. Names camelCase; custom scalars declared (`DateTime`, `JSON`).
2. Every field the apps render must exist in both schema and generated-types.
3. Versioned changes: rename fields with a deprecation window (`@deprecated`)
   instead of breaking clients in this phase.

## Verification
- `npm run typecheck --workspace @consilium/contracts`
- Manually diff schema ↔ generated-types for parity.