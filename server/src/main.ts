/**
 * Main — Bootstrap del API server (FASE 2).
 *
 * Diferido a propósito: el foco actual es el cliente offline + contrato
 * GraphQL. Al activarse, este archivo arranca NestJS con ApolloServer,
 * monta DocumentsResolver y conecta el Worker BullMQ de `document_outbox`.
 */
console.log(
  'CONSILIUM server: fase 2 (backend) diferida. El contrato está en src/graphql/schema.graphql.'
);