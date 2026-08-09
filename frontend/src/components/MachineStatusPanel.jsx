import React from 'react';
import { useHundi } from '../context/HundiContext';
import { StatusBadge } from './StatusBadge';
import {
  Cpu,
  Wifi,
  Thermometer,
  Lock,
  Radio,
  ToggleLeft,
  ToggleRight,
  AlertOctagon,
  ShieldCheck,
  Activity
} from 'lucide-react';

export const MachineStatusPanel = () => {
  const { summary, handleToggleAlert } = useHundi();
  const status = summary?.machineStatus || {};

  const {
    isOnline = true,
    coinJam = false,
    noteJam = false,
    storageFullWarning = false,
    temperature = 32.5,
    wifiSignal = -58,
    firmwareVersion = 'ESP32-S3-HUNDI-v2.8.4',
    ipAddress = '192.168.1.105',
    activeHundiId = 'TH-MAIN-01'
  } = status;

  const statusItems = [
    {
      label: 'Machine Power',
      sublabel: isOnline ? 'Connected' : 'Disconnected',
      icon: Radio,
      active: isOnline,
      alertType: 'isOnline',
      value: isOnline,
      isToggle: true,
      activeColor: 'text-emerald-400',
      inactiveColor: 'text-red-400',
    },
    {
      label: 'Coin Sorting',
      sublabel: coinJam ? 'Jam Detected' : 'Operating',
      icon: AlertOctagon,
      active: !coinJam,
      alertType: 'coinJam',
      value: coinJam,
      isToggle: true,
      activeColor: 'text-slate-400',
      inactiveColor: 'text-red-400',
      isAlert: true,
    },
    {
      label: 'Note Processing',
      sublabel: noteJam ? 'Jam Detected' : 'Operating',
      icon: AlertOctagon,
      active: !noteJam,
      alertType: 'noteJam',
      value: noteJam,
      isToggle: true,
      activeColor: 'text-slate-400',
      inactiveColor: 'text-red-400',
      isAlert: true,
    },
    {
      label: 'Vault Capacity',
      sublabel: storageFullWarning ? 'Bins > 85%' : 'Within Limits',
      icon: ShieldCheck,
      active: !storageFullWarning,
      isToggle: false,
    },
  ];

  return (
    <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
      <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white font-display">System Status</h3>
            <p className="text-[11px] text-slate-500">Unit: {activeHundiId} • {firmwareVersion}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="simulation-badge">Simulation Mode</span>
          <StatusBadge
            variant={isOnline ? 'online' : 'offline'}
            label={isOnline ? 'Active' : 'Offline'}
          />
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {statusItems.map((item, idx) => {
          const Icon = item.icon;
          const isOk = item.active;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                !isOk
                  ? item.isAlert ? 'bg-red-500/5 border-red-500/20' : 'bg-surface-100 border-surface-border'
                  : 'bg-surface-100 border-surface-border'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isOk ? 'text-slate-500' : 'text-red-400'}`} />
                <div>
                  <p className="text-xs font-medium text-slate-300">{item.label}</p>
                  <p className={`text-[10px] ${isOk ? 'text-slate-500' : 'text-red-400 font-medium'}`}>
                    {item.sublabel}
                  </p>
                </div>
              </div>
              {item.isToggle && (
                <button
                  onClick={() => handleToggleAlert(item.alertType, item.isAlert ? !item.value : !item.value)}
                  className="text-slate-400 hover:text-gold-400 transition-colors"
                  title={`Toggle ${item.label} for testing`}
                >
                  {(item.alertType === 'isOnline' ? isOnline : !item.value) ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              )}
              {!item.isToggle && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  isOk ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {isOk ? 'OK' : 'WARN'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-surface-border/60 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Thermometer className="w-3.5 h-3.5 text-slate-500" />
          <span>Temp: <strong className="text-slate-300 font-mono">{temperature}°C</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Wifi className="w-3.5 h-3.5 text-slate-500" />
          <span>Wi-Fi: <strong className="text-slate-300 font-mono">{wifiSignal} dBm</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Door: <strong className="text-emerald-400 font-mono">Secured</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          <span>IP: <strong className="text-slate-300 font-mono">{ipAddress}</strong></span>
        </div>
      </div>
    </div>
  );
};
