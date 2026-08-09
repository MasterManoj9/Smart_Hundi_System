import React from 'react';
import { useHundi } from '../context/HundiContext';
import { PageHeader } from '../components/PageHeader';
import { DenominationCard } from '../components/DenominationCard';
import { Banknote, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const NotesPage = () => {
  const { summary, transactions } = useHundi();
  const noteBoxes = summary?.noteBoxes || [];
  const totalNotesCount = summary?.totalNotesCount || 0;
  const totalNotesAmount = summary?.totalNotesAmount || 0;

  const noteTxns = transactions.filter(t => t.type === 'NOTE').slice(0, 6);

  const processingSteps = [
    { label: 'Note Input', desc: 'Bill acceptor slot', icon: '💵' },
    { label: 'Feeding', desc: 'Roller mechanism', icon: '🔄' },
    { label: 'Detection', desc: 'Optical scanner', icon: '🔍' },
    { label: 'Sorting', desc: 'Denomination routing', icon: '⚙️' },
    { label: 'Storage', desc: 'Vault bins', icon: '🗄️' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <PageHeader icon={Banknote} title="Notes" subtitle="Banknote denomination management and processing status" badge="Simulation Mode" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Total Notes</p>
          <p className="text-2xl font-extrabold text-white font-mono">{totalNotesCount.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Across 6 denominations</p>
        </div>
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Total Value</p>
          <p className="text-2xl font-extrabold text-gold-400 font-mono">₹{totalNotesAmount.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">₹10 through ₹500</p>
        </div>
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Processing Status</p>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">Ready</p>
          <p className="text-xs text-slate-500 mt-1">Validator operational</p>
        </div>
      </div>

      {/* Processing Flow */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white font-display mb-4">Note Processing Pipeline</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 py-4">
          {processingSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-100 border border-surface-border min-w-[100px]">
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

      {/* AI Note Detection — Future */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-gold-500" />
          <h3 className="text-sm font-bold text-white font-display">AI Note Detection</h3>
          <span className="text-[10px] font-medium bg-surface-200 text-slate-400 px-2 py-0.5 rounded-md">Future Integration</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          AI-powered counterfeit detection and denomination verification will be integrated in a future release when the optical scanning hardware is connected.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {['UV Detection', 'IR Scanning', 'Pattern Matching'].map((feature, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-surface-100 border border-surface-border/50 text-center">
              <p className="text-xs font-medium text-slate-400">{feature}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Planned</p>
            </div>
          ))}
        </div>
      </div>

      {/* Denomination Cards */}
      <div>
        <h3 className="text-sm font-bold text-white font-display mb-3">Denomination Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {noteBoxes.map(box => (
            <DenominationCard key={`note-${box.denomination}`} item={box} />
          ))}
        </div>
      </div>

      {/* Recent Note Activity */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white font-display mb-3">Recent Note Activity</h3>
        {noteTxns.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No recent note transactions</p>
        ) : (
          <div className="space-y-2">
            {noteTxns.map(t => (
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
