import { useEffect, useState, useCallback } from 'react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const typeStyles: Record<string, { bg: string; border: string; icon: string }> = {
  success: { bg: 'var(--color-success)', border: 'var(--color-success)', icon: '✓' },
  error: { bg: 'var(--color-danger)', border: 'var(--color-danger)', icon: '✕' },
  warning: { bg: 'var(--color-warning)', border: 'var(--color-warning)', icon: '!' },
  info: { bg: 'var(--color-info)', border: 'var(--color-info)', icon: 'i' },
};

function Toast({ toast, onDismiss }: ToastProps) {
  const style = typeStyles[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-sm) var(--space-md)',
        background: 'var(--color-surface)',
        border: 'var(--border-width) solid',
        borderColor: style.border,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        minWidth: 300,
        maxWidth: 420,
        fontSize: 'var(--font-size-base)',
      }}
    >
      <span style={{ color: style.bg, fontWeight: 600 }}>{style.icon}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        ✕
      </button>
    </div>
  );
}

let toastCounter = 0;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    (window as any).__addToast = (message: string, type: ToastItem['type'] = 'info', duration?: number) => {
      const id = `toast-${++toastCounter}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      return id;
    };
    return () => {
      delete (window as any).__addToast;
    };
  }, []);

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 'var(--space-md)',
        right: 'var(--space-md)',
        zIndex: 'var(--z-toast)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}

export const toastService = {
  success: (message: string, duration?: number) => (window as any).__addToast?.(message, 'success', duration),
  error: (message: string, duration?: number) => (window as any).__addToast?.(message, 'error', duration),
  warning: (message: string, duration?: number) => (window as any).__addToast?.(message, 'warning', duration),
  info: (message: string, duration?: number) => (window as any).__addToast?.(message, 'info', duration),
};
