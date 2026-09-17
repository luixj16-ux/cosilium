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

export {
  PortalHeader,
  type PortalHeaderProps,
  type TabId
} from './components/PortalHeader';
export { RoleBadge, type RoleBadgeProps } from './components/RoleBadge';
export { CourtsGrid, type CourtsGridProps } from './components/CourtsGrid';
export { CasesList, type CasesListProps } from './components/CasesList';
export { CaseCard, type CaseCardProps } from './components/CaseCard';
export {
  CaseDetailModal,
  type CaseDetailModalProps
} from './components/CaseDetailModal';
export {
  ActuationTimeline,
  type ActuationTimelineProps
} from './components/ActuationTimeline';
export { AuthForm, type AuthFormProps } from './components/AuthForm';
export { NewCaseForm, type NewCaseFormProps } from './components/NewCaseForm';
export {
  AddActuationForm,
  type AddActuationFormProps
} from './components/AddActuationForm';
export { LawsCatalog, type LawsCatalogProps } from './components/LawsCatalog';
export { NewsList, type NewsListProps } from './components/NewsList';
export {
  AdminUsersList,
  type AdminUsersListProps
} from './components/AdminUsersList';
export { ToastStack, type ToastStackProps, type ToastMessage } from './components/ToastStack';
export { SearchBox, type SearchBoxProps } from './components/SearchBox';
export { PublicNoticeBanner } from './components/PublicNoticeBanner';
export { Breadcrumb, type BreadcrumbProps } from './components/Breadcrumb';
export {
  InstitutionPanel,
  type InstitutionPanelProps
} from './components/InstitutionPanel';
export { ServicesPanel, type ServicesPanelProps } from './components/ServicesPanel';
export { AgendaPanel, type AgendaPanelProps } from './components/AgendaPanel';
export {
  VirtualAssistant,
  type VirtualAssistantProps
} from './components/VirtualAssistant';