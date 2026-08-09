import React from 'react';
import { useHundi } from '../context/HundiContext';
import { PageHeader } from '../components/PageHeader';
import { StorageBar } from '../components/StorageBar';
import { HardDrive, AlertTriangle } from 'lucide-react';

export const StoragePage = () => {
  const { summary } = useHundi();
  const coinBoxes = summary?.coinBoxes || [];
  const noteBoxes = summary?.noteBoxes || [];
  const allBoxes = [...coinBoxes, ...noteBoxes];

  const totalItems = allBoxes.reduce((a, b) => a + b.count, 0);
  const totalMax = allBoxes.reduce((a, b) => a + b.maxCapacity, 0);
  const overallPct = totalMax > 0 ? Number(((totalItems / totalMax) * 100).toFixed(1)) : 0;

  const criticalBoxes = allBoxes.filter(b => b.percentage >= 70);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader icon={HardDrive} title="Storage Monitor" subtitle="Visual storage capacity indicators for all denomination bins" badge="Simulation Mode" />

      {/* Overall Capacity */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white font-display mb-4">Overall System Capacity</h3>
        <StorageBar percentage={overallPct} size="lg" />
        <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-3 pt-3 border-t border-surface-border/60">
          <span>Used: <strong className="text-slate-300">{totalItems.toLocaleString()}</strong> units</span>
          <span>Max: <strong className="text-slate-300">{totalMax.toLocaleString()}</strong> units</span>
        </div>
      </div>

      {/* Coin Storage */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white font-display">Coin Storage Bins</h3>
          <span className="text-[11px] text-slate-500 font-mono">4 bins</span>
        </div>
        <div className="space-y-4">
          {coinBoxes.map(box => (
            <div key={`coin-${box.denomination}`} className="flex items-center gap-4">
              <div className="w-14 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center font-mono font-bold text-gold-400 text-sm shrink-0">
                ₹{box.denomination}
              </div>
              <div className="flex-1">
                <StorageBar
                  percentage={box.percentage}
                  label={`${box.count.toLocaleString()} coins — ₹${box.totalValue.toLocaleString()}`}
                  sublabel={`/ ${box.maxCapacity.toLocaleString()} max`}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note Storage */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white font-display">Note Storage Bins</h3>
          <span className="text-[11px] text-slate-500 font-mono">6 bins</span>
        </div>
        <div className="space-y-4">
          {noteBoxes.map(box => (
            <div key={`note-${box.denomination}`} className="flex items-center gap-4">
              <div className="w-14 h-10 rounded-lg bg-surface-200 border border-surface-border flex items-center justify-center font-mono font-bold text-slate-300 text-sm shrink-0">
                ₹{box.denomination}
              </div>
              <div className="flex-1">
                <StorageBar
                  percentage={box.percentage}
                  label={`${box.count.toLocaleString()} notes — ₹${box.totalValue.toLocaleString()}`}
                  sublabel={`/ ${box.maxCapacity.toLocaleString()} max`}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {criticalBoxes.length > 0 && (
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-display">Storage Alerts</h3>
          </div>
          <div className="space-y-2">
            {criticalBoxes.map(box => (
              <div key={`alert-${box.type}-${box.denomination}`} className={`p-3 rounded-xl border text-xs ${
                box.percentage >= 90 ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'
              }`}>
                <span className={`font-medium ${box.percentage >= 90 ? 'text-red-400' : 'text-amber-400'}`}>
                  ₹{box.denomination} {box.type.toLowerCase()} storage is at {box.percentage}% capacity
                </span>
                <span className="text-slate-500 ml-2">— {box.percentage >= 90 ? 'collection required immediately' : 'nearing capacity'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
