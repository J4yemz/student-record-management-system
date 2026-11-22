import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
          info: <CheckCircle2 className="w-5 h-5 text-sky-500" />,
        };

        const borders = {
          success: 'border-emerald-200 bg-white text-emerald-950',
          error: 'border-rose-200 bg-white text-rose-950',
          warning: 'border-amber-200 bg-white text-amber-950',
          info: 'border-sky-200 bg-white text-sky-950',
        };

        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-center justify-between p-3.5 rounded-xl border shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200',
              borders[toast.type]
            )}
          >
            <div className="flex items-center gap-3">
              {icons[toast.type]}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
