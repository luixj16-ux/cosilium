/**
 * Configuración de BullMQ para el Worker de salida (outbox).
 *
 * Patrón: el outbox local del cliente (RxDB) alimenta, vía API, la cola
 * `document_outbox` remota. Un Worker dedicado procesa cada elemento:
 *   1. registrar metadatos,
 *   2. emitir presigned URL,
 *   3. encolar el Webhook de notificación (integraciones n8n — fase 3).
 *
 * El backend NO sube binarios: solo metadatos + presign. La subida directa
 * del cliente a Object Storage evita saturar el API server (ADR-0006).
 */
export interface BullMqConfig {
  queues: {
    /** Cola principal de salida (entrada del API). */
    documentOutbox: {
      name: string;
      concurrency: number;
      attempts: number;
      backoff: { type: number; delay: number };
    };
    /** Cola de notificaciones/eventos hacia integraciones (n8n futuro). */
    notifications: {
      name: string;
      concurrency: number;
    };
  };
  redis: {
    host: string;
    port: number;
    db: number;
    maxRetriesPerRequest: number | null;
  };
}

export const bullMqConfig: BullMqConfig = {
  queues: {
    documentOutbox: {
      name: 'document_outbox',
      concurrency: 4,
      attempts: 5,
      backoff: { type: 2, delay: 2000 }
    },
    notifications: {
      name: 'consilium_notifications',
      concurrency: 8
    }
  },
  redis: {
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? 6379),
    db: Number(process.env.REDIS_DB ?? 0),
    maxRetriesPerRequest: null
  }
};

/** Nombre de las colas — importable sin instanciar conexión. */
export const QUEUES = {
  documentOutbox: 'document_outbox',
  notifications: 'consilium_notifications'
} as const;