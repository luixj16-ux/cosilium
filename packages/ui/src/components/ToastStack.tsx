import React from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  kind: 'success' | 'error' | 'info';
}

export interface ToastStackProps {
  toasts: ToastMessage[];
  onDismiss?: (id: string) => void;
}

const TOAST_CLASS: Record<ToastMessage['kind'], string> = {
  success: 'success',
  error: 'warning',
  info: 'info'
};

const TOAST_ICON: Record<ToastMessage['kind'], string> = {
  success: 'fa-circle-check',
  error: 'fa-triangle-exclamation',
  info: 'fa-info-circle'
};

/**
 * ToastStack — Dumb Component. Notificaciones transitorias (máx. 4).
 * El padre alimenta los toasts y los autodestruye con retardo.
 */
export const ToastStack: React.FC<ToastStackProps> = ({ toasts, onDismiss }) => {
  void onDismiss;
  return (
    <div className="toast-stack" id="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-msg ${TOAST_CLASS[toast.kind]}`} data-kind={toast.kind}>
          <i className={`fa-solid ${TOAST_ICON[toast.kind]}`} />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};