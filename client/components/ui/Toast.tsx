'use client';

import * as React from 'react';
import { cn } from './utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: (id: string) => void;
  className?: string;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green" />,
  error: <AlertCircle className="h-5 w-5 text-red" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber" />,
  info: <Info className="h-5 w-5 text-blue" />,
};

const borderColors: Record<ToastType, string> = {
  success: 'border-l-green',
  error: 'border-l-red',
  warning: 'border-l-amber',
  info: 'border-l-blue',
};

const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  className,
}) => {
  React.useEffect(() => {
    if (duration === Infinity) return;

    const timer = setTimeout(() => {
      onClose?.(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 w-80 bg-card border border-border border-l-4 rounded-card p-4 shadow-lg',
        'animate-in slide-in-from-right-full fade-in-0 duration-300',
        borderColors[type],
        className
      )}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-medium text-text-primary">{title}</p>
        )}
        <p className={cn('text-sm text-text-secondary', title && 'mt-1')}>
          {message}
        </p>
      </div>
      <button
        onClick={() => onClose?.(id)}
        className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export interface ToastItem extends Omit<ToastProps, 'id'> {
  id: string;
}

export interface ToastContainerProps {
  toasts: ToastItem[];
  onClose?: (id: string) => void;
  className?: string;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  className,
}) => {
  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-[100] flex flex-col gap-2',
        className
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id || Math.random().toString(36).slice(2)}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Simple toast hook for quick usage
export interface UseToastReturn {
  toasts: ToastItem[];
  addToast: (toast: ToastItem) => void;
  removeToast: (id: string) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback((toast: ToastItem) => {
    const id = toast.id || Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

export { Toast, ToastContainer };
