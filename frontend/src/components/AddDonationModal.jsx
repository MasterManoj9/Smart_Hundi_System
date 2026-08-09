import React, { useState } from 'react';
import { useHundi } from '../context/HundiContext';
import { X, PlusCircle, Coins, Banknote } from 'lucide-react';

export const AddDonationModal = () => {
  const { isAddModalOpen, setIsAddModalOpen, handleAddDonation } = useHundi();
  const [type, setType] = useState('COIN');
  const [denomination, setDenomination] = useState('10');
  const [count, setCount] = useState('5');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  if (!isAddModalOpen) return null;

  const coinOptions = [1, 2, 5, 10];
  const noteOptions = [10, 20, 50, 100, 200, 500];
  const currentDenomOptions = type === 'COIN' ? coinOptions : noteOptions;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    const res = await handleAddDonation({
      type,
      denomination: Number(denomination),
      count: Number(count)
    });

    setSubmitting(false);
    if (res.success) {
      setMsg({ type: 'success', text: `Deposited ${count} × ₹${denomination} ${type.toLowerCase()}s` });
      setTimeout(() => {
        setMsg(null);
        setIsAddModalOpen(false);
      }, 1000);
    } else {
      setMsg({ type: 'error', text: res.message || 'Failed to add donation' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-6 w-full max-w-md shadow-xl relative animate-scale-in">
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-surface-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white font-display">Add Donation Entry</h3>
            <p className="text-xs text-slate-500">Manual vault deposit for testing</p>
          </div>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-xs font-medium ${
            msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'
          }`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Currency Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setType('COIN'); setDenomination('10'); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'COIN'
                    ? 'bg-gold-500 text-black border-gold-400'
                    : 'bg-surface-100 text-slate-400 border-surface-border hover:bg-surface-200'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>Coin</span>
              </button>
              <button
                type="button"
                onClick={() => { setType('NOTE'); setDenomination('100'); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'NOTE'
                    ? 'bg-gold-500 text-black border-gold-400'
                    : 'bg-surface-100 text-slate-400 border-surface-border hover:bg-surface-200'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Note</span>
              </button>
            </div>
          </div>

          {/* Denomination */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Denomination (₹)</label>
            <div className="grid grid-cols-3 gap-2">
              {currentDenomOptions.map(denom => (
                <button
                  type="button"
                  key={denom}
                  onClick={() => setDenomination(String(denom))}
                  className={`py-2 rounded-xl font-mono text-sm font-bold border transition-all ${
                    String(denomination) === String(denom)
                      ? 'bg-gold-500/15 text-gold-400 border-gold-500/40'
                      : 'bg-surface-100 text-slate-300 border-surface-border hover:border-surface-border-light'
                  }`}
                >
                  ₹{denom}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Quantity</label>
            <input
              type="number"
              min="1"
              max="500"
              value={count}
              onChange={e => setCount(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-surface-100 border border-surface-border text-white font-mono text-base"
            />
          </div>

          {/* Total */}
          <div className="p-3 rounded-xl bg-surface-100 border border-surface-border text-xs flex justify-between items-center">
            <span className="text-slate-400">Total Amount</span>
            <span className="font-mono text-lg font-extrabold text-gold-400">
              ₹{(Number(denomination) * Number(count || 0)).toLocaleString()}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wide transition-colors disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Confirm & Record'}
          </button>
        </form>
      </div>
    </div>
  );
};
