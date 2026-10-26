---
trigger: always_on
---
# Dumb Component Specs — CONSILIUM

Contrato que **todo** componente en `packages/ui/src/components/` debe cumplir.

## 1. Principio: Dumb = Props + Callbacks Only
- **Props** (entrada): datos puros, primitivos o interfaces `*Payload`.
- **Callbacks** (salida): funciones `on<Event>` que notifican acción al padre.
- **Sin**: estado interno derivado de red, `fetch`, `useEffect` de side-effects, imports de `@consilium/core`, routers, stores.

## 2. Estructura de Archivo
```tsx
// ComponenteEjemplo.tsx
import React from 'react';

interface EjemploPayload {
  id: string;
  title: string;
  status: 'PENDING' | 'PENDING_UPLOAD' | 'UPLOADED' | 'FAILED';
}

interface EjemploProps {
  items: EjemploPayload[];
  onCancel: (id: string) => void;
  onRetry?: (id: string) => void;   // opcional
}

export type { EjemploPayload, EjemploProps };

export const Ejemplo: React.FC<EjemploProps> = ({ items, onCancel, onRetry }) => (
  <div className="Ejemplo-container">
    {items.map(item => (
      <div key={item.id} className="Ejemplo-item">
        <span>{item.title}</span>
        <span className={`status-${item.status}`}>{item.status}</span>
        <button onClick={() => onCancel(item.id)}>Cancelar</button>
        {onRetry && item.status === 'FAILED' && (
          <button onClick={() => onRetry!(item.id)}>Reintentar</button>
        )}
      </div>
    ))}
  </div>
);
```

## 3. Reglas de Props
- **Nombres**: `items`, `on<Accion>` (`onCancel`, `onRetry`, `onSelect`).
- **Tipos**: exportar `*Payload` y `*Props` para consumidores.
- **Opcionales**: usar `?` y default en destructuring.
- **No** pasar funciones que muten estado interno del padre; solo notificar.

## 4. Estilos
- **No** CSS-in-JS, no `style={{}}`, no `className` con lógica de tema.
- Usar **clases CSS externas** (archivo `.css` importado por la app shell) o tokens CSS (`var(--color-primary)`).
- Clases BEM sugeridas: `Componente-contenedor`, `Componente-item`, `Componente-item--status-pending`.

## 5. Accesibilidad (mínimo)
- `aria-label` en botones solo-icono.
- `role="button"` solo si elemento no nativo.
- `tabIndex={0}` + `onKeyDown` (Enter/Space) en elementos clicables no nativos.
- `aria-live="polite"` en listas que se actualizan async.

## 6. Testing
- Unit test en `packages/ui/__tests__/ComponenteEjemplo.test.tsx` (render + callbacks).
- Verificar que callbacks se llaman con args correctos.
- No testear estilos.

## 7. Ejemplo Canónico
Ver `DocumentUploadList.tsx` en `packages/ui/src/components/` (coincide con MASTER_INIT_PROMPT §3.1).

## Referencias
- `design-system/index.md` (regla: UI dumb sin estilos propios).
- `design-system/colors.md` (tokens CSS).
- `ui-dumb-components` skill (plantilla + checklist).
- `technical-rules.md` (Fullstack Integrity → UI dumb).