import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useHundi } from '../context/HundiContext';
import { PageHeader } from '../components/PageHeader';
import { Settings, User, Wifi, Database, Cpu, Shield, Info } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { summary } = useHundi();
  const status = summary?.machineStatus || {};

  const systemInfo = [
    { label: 'Frontend', value: 'React 18 + Vite 5', icon: Info },
    { label: 'Styling', value: 'TailwindCSS 3', icon: Info },
    { label: 'Backend', value: 'Express.js (Port 5001)', icon: Database },
    { label: 'Data Store', value: 'In-Memory (Prototype)', icon: Database },
    { label: 'IoT Protocol', value: 'REST API over HTTP', icon: Wifi },
    { label: 'Target MCU', value: 'ESP32-S3 Dual Core', icon: Cpu },
    { label: 'Firmware', value: status.firmwareVersion || 'v2.8.4', icon: Cpu },
    { label: 'Security', value: 'JWT + API Key Auth', icon: Shield },
  ];

  return (
    <div className="space-y-6 pb-8">
      <PageHeader icon={Settings} title="Settings" subtitle="System configuration and information" />

      {/* Admin Profile */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-surface-border">
          <User className="w-4 h-4 text-gold-500" />
          <h3 className="text-sm font-bold text-white font-display">Admin Profile</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Name</p>
            <p className="text-sm font-medium text-white">{user?.name || 'Temple Administrator'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Username</p>
            <p className="text-sm font-mono text-slate-300">{user?.username || 'admin'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Role</p>
            <p className="text-sm font-medium text-gold-400">{user?.role || 'SUPER_ADMIN'}</p>
          </div>
        </div>
      </div>

      {/* ESP32 Connection */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-surface-border">
          <Cpu className="w-4 h-4 text-gold-500" />
          <h3 className="text-sm font-bold text-white font-display">ESP32 Connection</h3>
          <span className="simulation-badge ml-2">Not Connected</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Unit ID</p>
            <p className="text-sm font-mono text-slate-300">{status.activeHundiId || 'TH-MAIN-01'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">IP Address</p>
            <p className="text-sm font-mono text-slate-300">{status.ipAddress || '192.168.1.105'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">API Endpoint</p>
            <p className="text-sm font-mono text-slate-300">/api/iot/pulse</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Poll Interval</p>
            <p className="text-sm font-mono text-slate-300">4000ms</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-surface-border/60">
          The ESP32 hardware module is not physically connected. The dashboard is running with simulated data for demonstration purposes.
        </p>
      </div>

      {/* System Information */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-surface-border">
          <Info className="w-4 h-4 text-gold-500" />
          <h3 className="text-sm font-bold text-white font-display">System Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {systemInfo.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-surface-100 border border-surface-border/50">
                <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500">{item.label}</p>
                  <p className="text-xs font-medium text-slate-300 truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* About */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5 text-center">
        <p className="text-sm font-bold text-white font-display">Smart IoT-AI Enabled Automated Hundi System</p>
        <p className="text-xs text-slate-500 mt-1">Prototype Dashboard v1.0 • Built with React + Express.js</p>
        <p className="text-[10px] text-slate-600 mt-2">© 2026 Smart Hundi Project</p>
      </div>
    </div>
  );
};
