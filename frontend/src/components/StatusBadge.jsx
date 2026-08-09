import React from 'react';

const variants = {
  online: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    text: 'text-emerald-400',
    pulse: true,
  },
  offline: {
    dot: 'bg-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    text: 'text-red-400',
    pulse: true,
  },
  warning: {
    dot: 'bg-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    text: 'text-amber-400',
    pulse: false,
  },
  success: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    text: 'text-emerald-400',
    pulse: false,
  },
  error: {
    dot: 'bg-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    text: 'text-red-400',
    pulse: false,
  },
  info: {
    dot: 'bg-sky-500',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/25',
    text: 'text-sky-400',
    pulse: false,
  },
  neutral: {
    dot: 'bg-slate-500',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/25',
    text: 'text-slate-400',
    pulse: false,
  },
};

export const StatusBadge = ({ variant = 'neutral', label, size = 'sm' }) => {
  const v = variants[variant] || variants.neutral;
  const isSmall = size === 'sm';

  return (
    <span className={`inline-flex items-center gap-1.5 ${isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'} rounded-full font-semibold border ${v.bg} ${v.border} ${v.text}`}>
      <span className="relative flex h-1.5 w-1.5">
        {v.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${v.dot} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${v.dot}`} />
      </span>
      <span>{label}</span>
    </span>
  );
};
