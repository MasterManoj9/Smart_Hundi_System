import React from 'react';

export const PageHeader = ({ icon: Icon, title, subtitle, badge, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 animate-fade-in">
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white font-display tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className="simulation-badge">{badge}</span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
};
