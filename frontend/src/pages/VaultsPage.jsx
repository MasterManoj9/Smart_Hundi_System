import React, { useState } from 'react';
import { useHundi } from '../context/HundiContext';
import { PageHeader } from '../components/PageHeader';
import { DenominationCard } from '../components/DenominationCard';
import { SystemAlertsBanner } from '../components/SystemAlertsBanner';
import { StorageBar } from '../components/StorageBar';
import { HardDrive, RotateCcw } from 'lucide-react';

export const VaultsPage = () => {
  const { summary, setIsResetConfirmOpen } = useHundi();
  const [vaultTab, setVaultTab] = useState('ALL');

  const coinBoxes = summary?.coinBoxes || [];
  const noteBoxes = summary?.noteBoxes || [];
  const totalCoinsAmount = summary?.totalCoinsAmount || 0;
  const totalNotesAmount = summary?.totalNotesAmount || 0;
  const totalCoinsCount = summary?.totalCoinsCount || 0;
  const totalNotesCount = summary?.totalNotesCount || 0;

  const allBoxes = [...coinBoxes, ...noteBoxes];
  const totalItemsCount = allBoxes.reduce((acc, b) => acc + b.count, 0);
  const totalItemsMax = allBoxes.reduce((acc, b) => acc + b.maxCapacity, 0);
  const overallPercentage = totalItemsMax > 0 ? Number(((totalItemsCount / totalItemsMax) * 100).toFixed(1)) : 0;
  const fullBoxesCount = allBoxes.filter(b => b.percentage >= 85).length;

  const tabs = [
    { key: 'ALL', label: `All (${allBoxes.length})` },
    { key: 'COINS', label: `Coins (${coinBoxes.length})` },
    { key: 'NOTES', label: `Notes (${noteBoxes.length})` },
  ];

  return (
    <div className="space-y-6 pb-8">
      <PageHeader icon={HardDrive} title="Storage Vaults" subtitle="Denomination-wise storage bin management" badge="Simulation Mode">
        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Counts</span>
        </button>
      </PageHeader>

      <SystemAlertsBanner />

      {/* Capacity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface-50 border border-surface-border rounded-2xl p-5">
          <StorageBar percentage={overallPercentage} label="Total Vault Occupancy" size="lg" />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-3 pt-3 border-t border-surface-border/60">
            <span>Occupied: <strong className="text-slate-300">{totalItemsCount.toLocaleString()} pcs</strong></span>
            <span>Capacity: <strong className="text-slate-300">{totalItemsMax.toLocaleString()} pcs</strong></span>
          </div>
        </div>

        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">Vault Health</p>
            <p className="text-2xl font-extrabold text-white font-mono">
              {fullBoxesCount > 0 ? `${fullBoxesCount} Bins Alert` : 'All Optimal'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {fullBoxesCount > 0 ? 'Action required' : 'All bins within limits'}
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-surface-border/60 font-mono">
            Total Value: <strong className="text-gold-400">₹{(totalCoinsAmount + totalNotesAmount).toLocaleString()}</strong>
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center bg-surface-100 p-0.5 rounded-lg border border-surface-border w-fit text-xs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setVaultTab(tab.key)}
            className={`px-4 py-1.5 rounded-md font-medium transition-all ${
              vaultTab === tab.key ? 'bg-gold-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Coin Boxes */}
      {(vaultTab === 'ALL' || vaultTab === 'COINS') && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white font-display">Coin Vaults</h3>
            <span className="text-[11px] text-slate-500 font-mono">₹{totalCoinsAmount.toLocaleString()} ({totalCoinsCount.toLocaleString()} pcs)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coinBoxes.map(box => (
              <DenominationCard key={`coin-${box.denomination}`} item={box} />
            ))}
          </div>
        </div>
      )}

      {/* Note Boxes */}
      {(vaultTab === 'ALL' || vaultTab === 'NOTES') && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white font-display">Note Vaults</h3>
            <span className="text-[11px] text-slate-500 font-mono">₹{totalNotesAmount.toLocaleString()} ({totalNotesCount.toLocaleString()} pcs)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {noteBoxes.map(box => (
              <DenominationCard key={`note-${box.denomination}`} item={box} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
