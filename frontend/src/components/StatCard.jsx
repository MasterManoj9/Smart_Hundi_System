import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, subtext, icon: Icon, trend, trendDown, color = 'gold', badge }) => {
  const isGold = color === 'gold';
  const isGreen = color === 'emerald';
  const isSky = color === 'sky';
  const isRose = color === 'rose';

  const iconBgClass = isGold
    ? 'bg-gold-500/10 border-gold-500/20 text-gold-500'
    : isGreen
    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    : isSky
    ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
    : 'bg-red-500/10 border-red-500/20 text-red-400';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`relative rounded-2xl p-5 border transition-all ${
        isGold
          ? 'card-surface-gold'
          : 'bg-surface-50 border-surface-border hover:border-surface-border-light'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold tracking-tight text-white font-mono">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl flex items-center justify-center border ${iconBgClass}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between pt-3 border-t border-surface-border/60 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          {trend && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              trendDown
                ? 'text-red-400 bg-red-500/10'
                : 'text-emerald-400 bg-emerald-500/10'
            }`}>
              {trendDown ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              <span>{trend}</span>
            </span>
          )}
          {subtext && <span className="text-slate-500 text-[11px] truncate">{subtext}</span>}
        </div>
        {badge && (
          <span className="text-[10px] font-medium text-slate-500 bg-surface-200 px-2 py-0.5 rounded-md">
            {badge}
          </span>
        )}
      </div>
    </motion.div>
  );
};
