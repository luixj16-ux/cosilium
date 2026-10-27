/**
 * Punto de entrada del paquete @consilium/server.
 */
export { QUEUES, bullMqConfig } from './config/bullmq.config';
export type { BullMqConfig } from './config/bullmq.config';
export { DocumentService } from './documents/documents.service';
export type { PresignedUrlProvider, PresignedUploadPayload } from './documents/documents.service';
export { createDocumentsModule } from './documents/documents.module';