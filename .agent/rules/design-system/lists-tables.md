---
trigger: always_on
---
# Patrones de Listas y Tablas — CONSILIUM

Guía para renderizar listas / tablas en componentes dumb (`packages/ui/`).

## 1. Lista Simple (Outbox / Documentos)
```tsx
// DocumentUploadList.tsx – patrón canónico
<ul className="DocumentUploadList-list">
  {pendingDocuments.map(doc => (
    <li key={doc.id} className="DocumentUploadList-item">
      <DocumentRow
        documentId={doc.id}
        title={doc.name}
        status={doc.status}
        onAction={() => onCancelUpload(doc.id)}
      />
    </li>
  ))}
</ul>
```
- **Clave**: `key={doc.id}` (id único, nunca index).
- **Item**: componente dumb (`DocumentRow`) que recibe payload + callback.
- **Estado vacío**: mostrar mensaje `"Sin documentos pendientes"`.

## 2. Tabla de Datos (Casos, Usuarios, etc.)
```tsx
<table className="DataTable">
  <thead>
    <tr>
      <th scope="col">NUE</th>
      <th scope="col">Carátula</th>
      <th scope="col">Estado</th>
      <th scope="col">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {cases.map(c => (
      <tr key={c.id}>
        <td><code>{c.docketNumber}</code></td>
        <td>{c.title}</td>
        <td><DocumentStatusBadge status={c.status} /></td>
        <td>
          <button onClick={() => onOpen(c.id)}>Abrir</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```
- **Accesibilidad**: `scope="col"` en `<th>`, `tabIndex` en botones.
- **Responsive**: en móvil `<table>` → `<div class="DataTable-mobile">` con cards.

## 3. Lista con Acciones Múltiples (Outbox con retry)
```tsx
{pendingDocuments.map(doc => (
  <li key={doc.id} className="OutboxItem">
    <DocumentRow ... />
    <div className="OutboxItem-actions">
      {doc.status === 'FAILED' && (
        <button onClick={() => onRetry(doc.id)}>Reintentar</button>
      )}
      <button onClick={() => onCancel(doc.id)}>Cancelar</button>
    </div>
  </li>
))}
```

## 4. Estados de Lista
| Estado | UI |
|--------|----|
| Cargando | `<span className="List-skeleton">…</span>` (shimmer) |
| Vacío | `<p className="List-empty">Sin elementos</p>` |
| Error | `<p className="List-error" role="alert">{msg}</p>` + botón retry |

## 5. Convenciones CSS (BEM sugerido)
- `.List`, `.List-item`, `.List-item--status-pending`, `.List-empty`, `.List-error`.
- `.DataTable`, `.DataTable-header`, `.DataTable-row`, `.DataTable-cell`.

## 6. Testing
- Verificar que callbacks reciben `id` correcto.
- Renderizado condicional según `status`.
- Estados vacío / error.

## Referencias
- `design-system/ui-elements.md` (componentes disponibles).
- `design-system/specs.md` (contrato dumb).
- `design-system/colors.md` (tokens para badges, estados).