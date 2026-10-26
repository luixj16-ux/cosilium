---
trigger: always_on
---
# Inventario de UI Elements — CONSILIUM (`packages/ui/src/components/`)

Lista de componentes dumb existentes. Cada uno sigue `specs.md`.

| Componente | Archivo | Props principales | Callbacks |
|------------|---------|-------------------|-----------|
| `DocumentUploadList` | `DocumentUploadList.tsx` | `pendingDocuments: DocumentPayload[]` | `onCancelUpload(id)` |
| `DocumentRow` | `DocumentRow.tsx` | `documentId`, `title`, `status`, `size?` | `onAction` |
| `DocumentStatusBadge` | `DocumentStatusBadge.tsx` | `status: 'PENDING'|'PENDING_UPLOAD'|'UPLOADED'|'FAILED'` | — |
| `ToastStack` | `ToastStack.tsx` | `toasts: ToastPayload[]` | `onDismiss(id)` |
| `VirtualAssistant` | `VirtualAssistant.tsx` | `messages: MessagePayload[]` | `onSend(text)` |
| `CaseCard` | `CaseCard.tsx` | `case: CasePayload` | `onOpen`, `onAction` |
| `CasesList` | `CasesList.tsx` | `cases: CasePayload[]` | `onOpen(id)` |
| `ActuationTimeline` | `ActuationTimeline.tsx` | `actuations: ActuationPayload[]` | — |
| `AddActuationForm` | `AddActuationForm.tsx` | `initial?` | `onSubmit(data)`, `onCancel` |
| `AdminUsersList` | `AdminUsersList.tsx` | `users: UserPayload[]` | `onPromote(id)`, `onDelete(id)` |
| `AgendaPanel` | `AgendaPanel.tsx` | `events: EventPayload[]` | — |
| `AppHeader` | `AppHeader.tsx` | `user?: UserPayload` | `onLogout`, `onThemeToggle` |
| `Breadcrumb` | `Breadcrumb.tsx` | `crumbs: CrumbPayload[]` | `onNavigate(path)` |
| `CaseDetailModal` | `CaseDetailModal.tsx` | `case: CaseDetailPayload`, `isOpen` | `onClose`, `onAction` |
| `CourtsGrid` | `CourtsGrid.tsx` | `courts: CourtPayload[]` | `onSelect(id)` |
| `InstitutionPanel` | `InstitutionPanel.tsx` | — | — |
| `LawsCatalog` | `LawsCatalog.tsx` | `laws: LawPayload[]` | `onOpen(id)` |
| `NewsList` | `NewsList.tsx` | `news: NewsPayload[]` | `onOpen(id)` |
| `NewCaseForm` | `NewCaseForm.tsx` | `courtId` | `onSubmit(data)`, `onCancel` |
| `PortalHeader` | `PortalHeader.tsx` | `title`, `actions?` | `onAction` |
| `PublicNoticeBanner` | `PublicNoticeBanner.tsx` | `message` | `onDismiss` |
| `RoleBadge` | `RoleBadge.tsx` | `role: 'public'|'admin'` | — |
| `SearchBox` | `SearchBox.tsx` | `placeholder`, `value` | `onChange(text)`, `onSubmit(text)` |
| `ServicesPanel` | `ServicesPanel.tsx` | — | — |

> **Nota**: La lista se actualiza automáticamente via self-maintenance cuando se añade/elimina componente dumb.

## Convenciones de Nombres de Archivos
- PascalCase + `.tsx` (`DocumentUploadList.tsx`).
- Exportar tipos `*Payload` y `*Props` (ver `specs.md`).

## Referencias
- `design-system/specs.md` (contrato).
- `design-system/colors.md` (tokens).
- `design-system/lists-tables.md` (patrones de lista).
- `ui-dumb-components` skill (plantilla canónica).