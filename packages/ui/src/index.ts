/**
 * @consilium/ui — Dumb Components compartidos.
 *
 * REGLA: ningún componente aquí conoce el estado de red, hace fetch,
 * ni invoca casos de uso. Solo props + callbacks (ver skill
 * `ui-dumb-components`).
 */
export { DocumentRow, type DocumentRowProps } from './components/DocumentRow';
export {
  DocumentUploadList,
  type DocumentUploadListProps,
  type DocumentPayload
} from './components/DocumentUploadList';
export {
  DocumentStatusBadge,
  type DocumentStatusBadgeProps
} from './components/DocumentStatusBadge';