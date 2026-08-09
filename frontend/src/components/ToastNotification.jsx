import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const styles = {
  success: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
  warning: 'bg-amber-500/10 border-amber-500/25 text-amber-300',
  error: 'bg-red-500/10 border-red-500/25 text-red-300',
  info: 'bg-sky-500/10 border-sky-500/25 text-sky-300',
};

const iconStyles = {
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
  info: 'text-sky-400',
};

const Toast = ({ id, type = 'info', message, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const Icon = icons[type] || icons.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(id), 200);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${styles[type]} ${exiting ? 'animate-toast-out' : 'animate-toast-in'}`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconStyles[type]}`} />
      <p className="text-xs font-medium flex-1">{message}</p>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(id), 200);
        }}
        className="text-slate-400 hover:text-white shrink-0 mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onDismiss={removeToast}
        />
      ))}
    </div>
  );
};
