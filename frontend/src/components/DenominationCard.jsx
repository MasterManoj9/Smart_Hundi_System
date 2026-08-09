import React from 'react';
import { motion } from 'framer-motion';
import { StorageBar } from './StorageBar';

export const DenominationCard = ({ item }) => {
  const { denomination, type, count, totalValue, maxCapacity, percentage, isFull } = item;
  const isCoin = type === 'COIN';

  let statusLabel = 'Normal';
  let statusClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  if (percentage >= 90) {
    statusLabel = 'Critical';
    statusClass = 'bg-red-500/10 text-red-400 border-red-500/20';
  } else if (percentage >= 75) {
    statusLabel = 'High';
    statusClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`rounded-2xl p-4 border transition-all ${
        isFull
          ? 'bg-surface-50 border-red-500/30'
          : 'bg-surface-50 border-surface-border hover:border-surface-border-light'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
            isCoin
              ? 'bg-gold-500 text-black'
              : 'bg-surface-200 border border-gold-500/30 text-gold-400'
          }`}>
            <span className="font-mono font-extrabold">₹{denomination}</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {isCoin ? 'Coin' : 'Note'} — ₹{denomination}
            </h4>
            <p className="text-[10px] text-slate-500">
              {isCoin ? 'Coin Vault' : 'Note Vault'}
            </p>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusClass}`}>
          {statusLabel}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3 p-3 rounded-xl bg-surface-100/50 border border-surface-border/50">
        <div>
          <p className="text-[10px] text-slate-500 mb-0.5">Count</p>
          <p className="text-base font-bold text-white font-mono">
            {count.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 mb-0.5">Value</p>
          <p className="text-base font-bold text-gold-400 font-mono">₹{totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Storage Bar */}
      <StorageBar
        percentage={percentage}
        label="Storage"
        sublabel={`/ ${maxCapacity.toLocaleString()} max`}
        size="sm"
      />
    </motion.div>
  );
};
