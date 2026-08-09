import React, { useState } from 'react';
import { useHundi } from '../context/HundiContext';
import { X, Cpu, Zap, Terminal, CheckCircle2 } from 'lucide-react';

export const Esp32SimulatorModal = () => {
  const { isEsp32ModalOpen, setIsEsp32ModalOpen, refreshAll } = useHundi();
  const [pulseType, setPulseType] = useState('COIN');
  const [denom, setDenom] = useState(10);
  const [count, setCount] = useState(1);
  const [lastResponse, setLastResponse] = useState(null);
  const [sending, setSending] = useState(false);

  if (!isEsp32ModalOpen) return null;

  const mockPayload = {
    apiKey: "ESP32_HUNDI_API_KEY_SECRET",
    hundiId: "TH-MAIN-01",
    type: pulseType,
    denomination: Number(denom),
    count: Number(count),
    sensorChannel: pulseType === 'COIN' ? 'GPIO_14_INDUCTIVE' : 'GPIO_22_OPTICAL',
    firmware: "v2.8.4-ESP32-S3"
  };

  const API_BASE = import.meta.env.VITE_API_URL || '';

  const triggerEsp32Pulse = async () => {
    setSending(true);
    setLastResponse(null);
    try {
      const res = await fetch(`${API_BASE}/api/iot/pulse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPayload)
      });
      const data = await res.json();
      setLastResponse({ status: res.status, data });
      await refreshAll();
    } catch (err) {
      setLastResponse({ status: 'ERROR', message: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-6 w-full max-w-xl shadow-xl relative animate-scale-in">
        <button
          onClick={() => setIsEsp32ModalOpen(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-surface-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white font-display">ESP32 Pulse Simulator</h3>
            <p className="text-xs text-slate-500">Simulate hardware sensor events</p>
          </div>
          <span className="simulation-badge ml-auto">Simulation</span>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-3 gap-3 mb-4 p-3.5 rounded-xl bg-surface-100 border border-surface-border">
          <div>
            <label className="block text-[10px] text-slate-500 font-medium mb-1">Sensor Type</label>
            <select
              value={pulseType}
              onChange={e => {
                setPulseType(e.target.value);
                setDenom(e.target.value === 'COIN' ? 10 : 100);
              }}
              className="w-full bg-surface-50 border border-surface-border rounded-lg px-2 py-1.5 text-xs text-white"
            >
              <option value="COIN">Coin (Inductive)</option>
              <option value="NOTE">Note (Optical)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-medium mb-1">Denomination</label>
            <select
              value={denom}
              onChange={e => setDenom(Number(e.target.value))}
              className="w-full bg-surface-50 border border-surface-border rounded-lg px-2 py-1.5 text-xs text-white"
            >
              {pulseType === 'COIN'
                ? [1, 2, 5, 10].map(d => <option key={d} value={d}>₹{d}</option>)
                : [10, 20, 50, 100, 200, 500].map(d => <option key={d} value={d}>₹{d}</option>)
              }
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-medium mb-1">Count</label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              className="w-full bg-surface-50 border border-surface-border rounded-lg px-2 py-1.5 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Payload Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-mono">POST /api/iot/pulse</span>
            </span>
            <span className="text-gold-400 font-medium">Ready</span>
          </div>
          <pre className="p-3 rounded-xl bg-[#0C0E14] border border-surface-border text-xs text-gold-400/80 font-mono overflow-x-auto max-h-28">
            {JSON.stringify(mockPayload, null, 2)}
          </pre>
        </div>

        {/* Response */}
        {lastResponse && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs font-mono text-emerald-300">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Response Received</span>
            </div>
            <pre className="text-[10px] text-slate-400 max-h-20 overflow-y-auto">
              {JSON.stringify(lastResponse.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={triggerEsp32Pulse}
          disabled={sending}
          className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          <span>{sending ? 'Transmitting...' : 'Send Simulated Pulse'}</span>
        </button>
      </div>
    </div>
  );
};
