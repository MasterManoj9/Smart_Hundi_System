import React from 'react';
import { useHundi } from '../context/HundiContext';
import { PageHeader } from '../components/PageHeader';
import { DenominationCard } from '../components/DenominationCard';
import { StorageBar } from '../components/StorageBar';
import { Coins, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CoinsPage = () => {
  const { summary, transactions } = useHundi();
  const coinBoxes = summary?.coinBoxes || [];
  const totalCoinsCount = summary?.totalCoinsCount || 0;
  const totalCoinsAmount = summary?.totalCoinsAmount || 0;

  // Recent coin transactions
  const coinTxns = transactions.filter(t => t.type === 'COIN').slice(0, 6);

  const processingSteps = [
    { label: 'Coin Input', desc: 'Physical drop slot', icon: '🪙' },
    { label: 'Identification', desc: 'Inductive sensor', icon: '🔍' },
    { label: 'Sorting', desc: 'Denomination routing', icon: '⚙️' },
    { label: 'Storage', desc: 'Vault bins', icon: '🗄️' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <PageHeader icon={Coins} title="Coins" subtitle="Coin denomination management and sorting status" badge="Simulation Mode" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Total Coins</p>
          <p className="text-2xl font-extrabold text-white font-mono">{totalCoinsCount.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Across 4 denominations</p>
        </div>
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Total Value</p>
          <p className="text-2xl font-extrabold text-gold-400 font-mono">₹{totalCoinsAmount.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">₹1 + ₹2 + ₹5 + ₹10</p>
        </div>
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Sorting Status</p>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">Ready</p>
          <p className="text-xs text-slate-500 mt-1">All chutes operational</p>
        </div>
      </div>

      {/* Processing Flow */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white font-display mb-4">Coin Processing Pipeline</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 py-4">
          {processingSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-100 border border-surface-border min-w-[110px]">
                <span className="text-2xl">{step.icon}</span>
                <p className="text-xs font-semibold text-white">{step.label}</p>
                <p className="text-[10px] text-slate-500">{step.desc}</p>
              </div>
              {idx < processingSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gold-500/50 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Denomination Cards */}
      <div>
        <h3 className="text-sm font-bold text-white font-display mb-3">Denomination Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coinBoxes.map(box => (
            <DenominationCard key={`coin-${box.denomination}`} item={box} />
          ))}
        </div>
      </div>

      {/* Recent Coin Activity */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white font-display mb-3">Recent Coin Activity</h3>
        {coinTxns.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No recent coin transactions</p>
        ) : (
          <div className="space-y-2">
            {coinTxns.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-100 border border-surface-border/50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-medium text-white">₹{t.denomination} × {t.count}</p>
                    <p className="text-[10px] text-slate-500">{new Date(t.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gold-400 font-mono">₹{t.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
