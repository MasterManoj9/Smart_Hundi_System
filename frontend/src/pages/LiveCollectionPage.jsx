import React from 'react';
import { useHundi } from '../context/HundiContext';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Radio, Coins, Banknote, CheckCircle2, Clock } from 'lucide-react';

export const LiveCollectionPage = () => {
  const { summary, transactions } = useHundi();

  const totalDonationAmount = summary?.totalDonationAmount ?? 0;
  const totalCoinsCount = summary?.totalCoinsCount ?? 0;
  const totalNotesCount = summary?.totalNotesCount ?? 0;
  const totalCoinsAmount = summary?.totalCoinsAmount ?? 0;
  const totalNotesAmount = summary?.totalNotesAmount ?? 0;
  const isOnline = summary?.machineStatus?.isOnline ?? true;

  // Last 10 transactions as live feed
  const recentTxns = transactions.slice(0, 10);

  // Denomination breakdown
  const coinBoxes = summary?.coinBoxes || [];
  const noteBoxes = summary?.noteBoxes || [];

  return (
    <div className="space-y-6 pb-8">
      <PageHeader icon={Radio} title="Live Collection" subtitle="Real-time collection monitoring and transaction feed" badge="Simulation Mode">
        <StatusBadge variant={isOnline ? 'online' : 'offline'} label={isOnline ? 'Live' : 'Offline'} size="md" />
      </PageHeader>

      {/* Session Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5 col-span-1 sm:col-span-2">
          <p className="text-xs text-slate-500 mb-1">Total Collection</p>
          <p className="text-3xl font-extrabold text-gold-400 font-mono">₹{totalDonationAmount.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Combined coins and notes</p>
        </div>
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Coins Collected</p>
          <div className="flex items-baseline gap-2">
            <Coins className="w-4 h-4 text-gold-500" />
            <p className="text-xl font-extrabold text-white font-mono">{totalCoinsCount.toLocaleString()}</p>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">₹{totalCoinsAmount.toLocaleString()}</p>
        </div>
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Notes Collected</p>
          <div className="flex items-baseline gap-2">
            <Banknote className="w-4 h-4 text-sky-400" />
            <p className="text-xl font-extrabold text-white font-mono">{totalNotesCount.toLocaleString()}</p>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">₹{totalNotesAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Feed */}
        <div className="lg:col-span-2 bg-surface-50 border border-surface-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Transaction Feed
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Auto-refreshing every 4s</span>
          </div>

          {recentTxns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Clock className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs">Waiting for transactions...</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[450px] overflow-y-auto scrollbar-hide">
              {recentTxns.map((t, idx) => {
                const isCoin = t.type === 'COIN';
                return (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      idx === 0 ? 'bg-gold-500/5 border-gold-500/20' : 'bg-surface-100 border-surface-border/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isCoin ? 'bg-gold-500/10 text-gold-400' : 'bg-sky-500/10 text-sky-400'}`}>
                        {isCoin ? <Coins className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">
                          ₹{t.denomination} {t.type.toLowerCase()} × {t.count}
                        </p>
                        <p className="text-[10px] text-slate-500">{new Date(t.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gold-400 font-mono">₹{t.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">{t.status || 'Verified'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Denomination Quick View */}
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white font-display mb-4">Denomination Breakdown</h3>

          <div className="space-y-1.5 mb-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Coins</p>
            {coinBoxes.map(box => (
              <div key={`live-coin-${box.denomination}`} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-100 border border-surface-border/50">
                <span className="text-xs font-medium text-slate-300">₹{box.denomination}</span>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white">{box.count.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 ml-2">₹{box.totalValue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Notes</p>
            {noteBoxes.map(box => (
              <div key={`live-note-${box.denomination}`} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-100 border border-surface-border/50">
                <span className="text-xs font-medium text-slate-300">₹{box.denomination}</span>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white">{box.count.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 ml-2">₹{box.totalValue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
