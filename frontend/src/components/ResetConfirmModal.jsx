import React, { useState } from 'react';
import { useHundi } from '../context/HundiContext';
import { X, RotateCcw, AlertTriangle, Lock } from 'lucide-react';

export const ResetConfirmModal = () => {
  const { isResetConfirmOpen, setIsResetConfirmOpen, handleResetCounts } = useHundi();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [resetting, setResetting] = useState(false);

  if (!isResetConfirmOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Simple maintenance PIN check
    if (pin !== '1234' && pin !== 'admin') {
      setError('Invalid Security PIN. Enter 1234 to authorize.');
      return;
    }

    setResetting(true);
    const res = await handleResetCounts();
    setResetting(false);

    if (res.success) {
      setIsResetConfirmOpen(false);
      setPin('');
    } else {
      setError(res.message || 'Reset failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-50 border border-red-500/25 rounded-2xl p-6 w-full max-w-md shadow-xl relative animate-scale-in">
        <button
          onClick={() => setIsResetConfirmOpen(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-surface-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white font-display">Reset Vault Counts</h3>
            <p className="text-xs text-red-400 font-medium">Destructive Action — Requires Authorization</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-slate-300 mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>
            This will zero out all coin and note vault counts. Transaction history will be preserved.
          </span>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl mb-4 bg-red-500/10 text-red-300 text-xs font-medium border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Security PIN <span className="text-slate-600">(Default: 1234)</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={e => setPin(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-100 border border-surface-border text-white font-mono text-base"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(false)}
              className="w-1/2 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-border text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resetting}
              className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wide transition-colors disabled:opacity-50"
            >
              {resetting ? 'Resetting...' : 'Authorize Reset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
