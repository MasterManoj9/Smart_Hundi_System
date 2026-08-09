import React from 'react';
import { useHundi } from '../context/HundiContext';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Bell, Radio, AlertOctagon, AlertTriangle, ShieldCheck, CheckCircle2, Info } from 'lucide-react';

export const AlertsPage = () => {
  const { summary, handleToggleAlert } = useHundi();
  const status = summary?.machineStatus || {};

  const { isOnline = true, coinJam = false, noteJam = false, storageFullWarning = false } = status;

  const allAlerts = [
    {
      id: 'offline',
      category: 'ERROR',
      title: 'System Offline',
      desc: 'The ESP32 gateway has lost connection with the server. Check Wi-Fi and power supply.',
      icon: Radio,
      active: !isOnline,
      toggleKey: 'isOnline',
      toggleValue: true,
    },
    {
      id: 'coin_jam',
      category: 'ERROR',
      title: 'Coin Jam Detected',
      desc: 'Physical block detected in the coin sorting chute. Manual inspection required.',
      icon: AlertOctagon,
      active: coinJam,
      toggleKey: 'coinJam',
      toggleValue: false,
    },
    {
      id: 'note_jam',
      category: 'ERROR',
      title: 'Note Jam Detected',
      desc: 'Jammed banknote in the feeder mechanism. Check note validator roller.',
      icon: AlertOctagon,
      active: noteJam,
      toggleKey: 'noteJam',
      toggleValue: false,
    },
    {
      id: 'storage_warning',
      category: 'WARNING',
      title: 'Storage Nearing Capacity',
      desc: 'One or more denomination bins have reached over 85% capacity. Physical collection needed.',
      icon: AlertTriangle,
      active: storageFullWarning,
      toggleKey: null,
    },
    {
      id: 'sync_ok',
      category: 'SUCCESS',
      title: 'Data Synchronized',
      desc: 'All vault counts and transaction logs are in sync with the dashboard.',
      icon: CheckCircle2,
      active: isOnline,
      toggleKey: null,
    },
    {
      id: 'security_ok',
      category: 'INFO',
      title: 'System Security Active',
      desc: 'Physical door lock is secured. API key authentication is enabled for all IoT endpoints.',
      icon: ShieldCheck,
      active: true,
      toggleKey: null,
    },
  ];

  const activeAlerts = allAlerts.filter(a => a.active && (a.category === 'ERROR' || a.category === 'WARNING'));
  const infoAlerts = allAlerts.filter(a => a.active && (a.category === 'SUCCESS' || a.category === 'INFO'));

  const categoryStyles = {
    ERROR: { bg: 'bg-red-500/5', border: 'border-red-500/20', iconBg: 'bg-red-500/10', iconColor: 'text-red-400' },
    WARNING: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
    SUCCESS: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
    INFO: { bg: 'bg-sky-500/5', border: 'border-sky-500/20', iconBg: 'bg-sky-500/10', iconColor: 'text-sky-400' },
  };

  const renderAlert = (alert) => {
    const Icon = alert.icon;
    const style = categoryStyles[alert.category];
    return (
      <div key={alert.id} className={`p-4 rounded-xl border ${style.bg} ${style.border} flex items-start justify-between gap-3`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${style.iconBg} ${style.iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
              <StatusBadge
                variant={alert.category === 'ERROR' ? 'error' : alert.category === 'WARNING' ? 'warning' : alert.category === 'SUCCESS' ? 'success' : 'info'}
                label={alert.category}
              />
            </div>
            <p className="text-xs text-slate-400">{alert.desc}</p>
          </div>
        </div>
        {alert.toggleKey && (
          <button
            onClick={() => handleToggleAlert(alert.toggleKey, alert.toggleValue)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-surface-200 hover:bg-surface-300 border border-surface-border text-slate-300 transition-colors shrink-0"
          >
            Resolve
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-8">
      <PageHeader icon={Bell} title="Alert Center" subtitle="System alerts, warnings, and notifications" badge="Simulation Mode" />

      {/* Active Alerts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white font-display">Active Alerts</h3>
          <span className="text-[10px] text-slate-500 font-mono">{activeAlerts.length} active</span>
        </div>
        {activeAlerts.length === 0 ? (
          <div className="bg-surface-50 border border-surface-border rounded-2xl p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">All Clear</p>
            <p className="text-xs text-slate-500 mt-1">No active alerts or warnings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map(renderAlert)}
          </div>
        )}
      </div>

      {/* Info & Success */}
      <div>
        <h3 className="text-sm font-bold text-white font-display mb-3">System Status</h3>
        <div className="space-y-3">
          {infoAlerts.map(renderAlert)}
        </div>
      </div>

      {/* Toggle Simulation */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white font-display">Simulate Alerts</h3>
          <span className="simulation-badge">Testing Mode</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Toggle alert states below to test the system's response to various conditions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleToggleAlert('isOnline', !isOnline)}
            className={`p-3 rounded-xl border text-left text-xs ${
              !isOnline ? 'bg-red-500/5 border-red-500/20' : 'bg-surface-100 border-surface-border'
            }`}
          >
            <p className="font-medium text-white mb-0.5">Machine {isOnline ? 'Online' : 'Offline'}</p>
            <p className="text-[10px] text-slate-500">Click to toggle</p>
          </button>
          <button
            onClick={() => handleToggleAlert('coinJam', !coinJam)}
            className={`p-3 rounded-xl border text-left text-xs ${
              coinJam ? 'bg-red-500/5 border-red-500/20' : 'bg-surface-100 border-surface-border'
            }`}
          >
            <p className="font-medium text-white mb-0.5">Coin Jam: {coinJam ? 'Active' : 'Clear'}</p>
            <p className="text-[10px] text-slate-500">Click to toggle</p>
          </button>
          <button
            onClick={() => handleToggleAlert('noteJam', !noteJam)}
            className={`p-3 rounded-xl border text-left text-xs ${
              noteJam ? 'bg-red-500/5 border-red-500/20' : 'bg-surface-100 border-surface-border'
            }`}
          >
            <p className="font-medium text-white mb-0.5">Note Jam: {noteJam ? 'Active' : 'Clear'}</p>
            <p className="text-[10px] text-slate-500">Click to toggle</p>
          </button>
        </div>
      </div>
    </div>
  );
};
