import React from 'react';
import { motion } from 'framer-motion';

export const StorageBar = ({ percentage = 0, label, sublabel, showPercentage = true, size = 'md', animate = true }) => {
  const pct = Math.min(100, Math.max(0, percentage));

  let barClass = 'progress-safe';
  let textClass = 'text-emerald-400';
  let statusLabel = 'Normal';

  if (pct >= 90) {
    barClass = 'progress-critical';
    textClass = 'text-red-400';
    statusLabel = 'Critical';
  } else if (pct >= 70) {
    barClass = 'progress-warning';
    textClass = 'text-amber-400';
    statusLabel = 'Warning';
  }

  const heightClass = size === 'lg' ? 'h-3' : size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          <div>
            {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
            {sublabel && <span className="text-[10px] text-slate-500 ml-2">{sublabel}</span>}
          </div>
          {showPercentage && (
            <span className={`text-xs font-mono font-bold ${textClass}`}>
              {pct}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${heightClass} rounded-full bg-surface-300/60 overflow-hidden`}>
        {animate ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${barClass}`}
          />
        ) : (
          <div
            style={{ width: `${pct}%` }}
            className={`h-full rounded-full ${barClass} transition-all duration-500`}
          />
        )}
      </div>
    </div>
  );
};
