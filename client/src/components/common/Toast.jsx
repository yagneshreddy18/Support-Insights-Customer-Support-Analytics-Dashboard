import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let icon = <Info className="w-5 h-5 text-blue-400" />;
        let border = 'border-blue-500/30 bg-slate-900/95';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
          border = 'border-emerald-500/30 bg-slate-900/95';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-400" />;
          border = 'border-rose-500/30 bg-slate-900/95';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-md shadow-2xl text-slate-100 transition-all duration-300 animate-slide-up ${border}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
