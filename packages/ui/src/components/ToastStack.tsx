import React from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  kind: 'success' | 'error' | 'info';
}

export interface ToastStackProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  autoDismissMs?: number;
}

/**
 * ToastStack — Dumb Component. Notificaciones transitorias. El padre
 * alimenta los toasts; el componente permite descartarlos.
 */
export const ToastStack: React.FC<ToastStackProps> = ({
  toasts,
  onDismiss,
  autoDismissMs
}) => {
  return (
    <div className="ToastStack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`ToastStack-toast ToastStack-toast-${toast.kind}`} data-kind={toast.kind}>
          <span className="ToastStack-message">{toast.message}</span>
          {autoDismissMs ? (
            <span className="ToastStack-timer" aria-hidden="true" />
          ) : (
            <button type="button" className="ToastStack-dismiss" aria-label="Cerrar aviso" onClick={() => onDismiss(toast.id)}>
              ×
            </button>
          )}
        </div>
      ))}
      {toasts.length === 0 ? null : (
        <button type="button" className="ToastStack-clear" onClick={() => toasts.forEach((t) => onDismiss(t.id))}>
          Cerrar todos
        </button>
      )}
    </div>
  );
};