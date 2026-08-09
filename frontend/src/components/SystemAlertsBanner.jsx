import React from 'react';
import { useHundi } from '../context/HundiContext';
import { AlertTriangle, AlertOctagon, Radio, ShieldAlert } from 'lucide-react';

export const SystemAlertsBanner = () => {
  const { summary } = useHundi();
  const status = summary?.machineStatus || {};

  const { isOnline = true, coinJam = false, noteJam = false, storageFullWarning = false } = status;

  const activeAlerts = [];
  if (!isOnline) {
    activeAlerts.push({
      id: 'offline',
      title: 'Machine Offline',
      desc: 'The ESP32 gateway has lost connection with the server.',
      icon: Radio,
      severity: 'high'
    });
  }
  if (coinJam) {
    activeAlerts.push({
      id: 'coin_jam',
      title: 'Coin Jam Alert',
      desc: 'Physical block detected in the coin sorting mechanism.',
      icon: AlertOctagon,
      severity: 'high'
    });
  }
  if (noteJam) {
    activeAlerts.push({
      id: 'note_jam',
      title: 'Note Jam Alert',
      desc: 'Jammed banknote detected in the feeder mechanism.',
      icon: AlertOctagon,
      severity: 'high'
    });
  }
  if (storageFullWarning) {
    activeAlerts.push({
      id: 'storage_full',
      title: 'Storage Nearing Capacity',
      desc: 'One or more denomination bins have reached over 85% capacity.',
      icon: AlertTriangle,
      severity: 'medium'
    });
  }

  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-5">
      {activeAlerts.map(alert => {
        const Icon = alert.icon;
        const isHigh = alert.severity === 'high';
        return (
          <div
            key={alert.id}
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
              isHigh
                ? 'bg-red-500/5 border-red-500/25 text-red-300'
                : 'bg-amber-500/5 border-amber-500/25 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isHigh ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">{alert.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{alert.desc}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
              isHigh ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
            }`}>
              Action Required
            </span>
          </div>
        );
      })}
    </div>
  );
};
