import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHundi } from '../context/HundiContext';
import {
  Bell,
  Cpu,
  PlusCircle,
  RefreshCw,
  LogOut,
  Clock,
  ChevronDown,
  Calendar,
  User,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { summary, setIsAddModalOpen, setIsEsp32ModalOpen, refreshAll, loading } = useHundi();
  const [time, setTime] = useState(new Date());
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isOnline = summary?.machineStatus?.isOnline ?? true;
  const coinJam = summary?.machineStatus?.coinJam ?? false;
  const noteJam = summary?.machineStatus?.noteJam ?? false;
  const storageFull = summary?.machineStatus?.storageFullWarning ?? false;
  const lastUpdated = summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';

  const activeAlerts = [];
  if (!isOnline) activeAlerts.push({ title: 'System Offline', desc: 'ESP32 connection lost', severity: 'error' });
  if (coinJam) activeAlerts.push({ title: 'Coin Jam Detected', desc: 'Sorting mechanism blocked', severity: 'error' });
  if (noteJam) activeAlerts.push({ title: 'Note Jam Detected', desc: 'Feeder mechanism stuck', severity: 'error' });
  if (storageFull) activeAlerts.push({ title: 'Storage Nearing Capacity', desc: 'One or more bins > 85%', severity: 'warning' });

  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = () => {
      setIsAlertsOpen(false);
      setIsProfileOpen(false);
    };
    if (isAlertsOpen || isProfileOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isAlertsOpen, isProfileOpen]);

  return (
    <header className="sticky top-0 z-40 bg-surface-50/95 backdrop-blur-md border-b border-surface-border px-4 lg:px-6 h-14 flex items-center justify-between">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center text-lg select-none">
          🛕
        </div>
        <div>
          <h1 className="text-sm font-bold text-white font-display tracking-tight leading-tight">
            Smart Hundi <span className="text-gold-500">Control Center</span>
          </h1>
          <p className="text-[10px] text-slate-500 hidden sm:block leading-tight">
            Automated Temple Collection System
          </p>
        </div>
      </div>

      {/* Center: Status indicators */}
      <div className="hidden lg:flex items-center gap-3">
        <StatusBadge
          variant={isOnline ? 'online' : 'offline'}
          label={isOnline ? 'System Online' : 'System Offline'}
        />

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 border border-surface-border text-[11px] text-slate-400">
          <Clock className="w-3 h-3 text-gold-500" />
          <span className="font-mono">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 border border-surface-border text-[11px] text-slate-400">
          <Calendar className="w-3 h-3 text-gold-500" />
          <span>{dateStr}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 border border-surface-border text-[11px] text-slate-400">
          <RefreshCw className="w-3 h-3 text-gold-500" />
          <span>Last sync: <strong className="text-slate-300 font-mono">{lastUpdated}</strong></span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Refresh */}
        <button
          onClick={refreshAll}
          disabled={loading}
          className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-border text-slate-400 hover:text-gold-500 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-gold-500' : ''}`} />
        </button>

        {/* ESP32 Sim */}
        <button
          onClick={() => setIsEsp32ModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-border text-slate-300 text-xs font-medium transition-colors"
        >
          <Cpu className="w-3.5 h-3.5 text-gold-500" />
          <span>Simulator</span>
        </button>

        {/* Add Donation */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Entry</span>
        </button>

        {/* Alerts */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => { setIsAlertsOpen(!isAlertsOpen); setIsProfileOpen(false); }}
            className={`relative p-2 rounded-lg bg-surface-100 border border-surface-border text-slate-400 hover:text-slate-200 transition-colors ${
              activeAlerts.length > 0 ? 'border-amber-500/30 text-amber-400' : ''
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-50 border border-surface-border rounded-xl p-3 shadow-xl z-50 animate-scale-in">
              <div className="flex items-center justify-between pb-2.5 border-b border-surface-border mb-2.5">
                <span className="text-xs font-bold text-white">Alerts</span>
                <span className="text-[10px] font-mono text-slate-400">{activeAlerts.length} active</span>
              </div>
              {activeAlerts.length === 0 ? (
                <p className="text-slate-500 py-4 text-center text-xs">No active alerts</p>
              ) : (
                <div className="space-y-2">
                  {activeAlerts.map((a, idx) => (
                    <div key={idx} className={`p-2.5 rounded-lg text-xs ${
                      a.severity === 'error'
                        ? 'bg-red-500/8 border border-red-500/20'
                        : 'bg-amber-500/8 border border-amber-500/20'
                    }`}>
                      <p className="font-semibold text-white text-[11px]">{a.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{a.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsAlertsOpen(false); }}
            className="flex items-center gap-2 pl-2 ml-1 border-l border-surface-border"
          >
            <div className="w-7 h-7 rounded-lg bg-gold-500/15 border border-gold-500/25 flex items-center justify-center text-gold-400 text-[11px] font-bold">
              {(user?.name || 'A').charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[11px] font-medium text-slate-200 leading-tight truncate max-w-[120px]">{user?.name || 'Administrator'}</p>
              <p className="text-[9px] text-slate-500 leading-tight">Super Admin</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-500 hidden lg:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-50 border border-surface-border rounded-xl p-1.5 shadow-xl z-50 animate-scale-in">
              <div className="px-3 py-2 border-b border-surface-border mb-1">
                <p className="text-xs font-semibold text-white">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500">{user?.role || 'SUPER_ADMIN'}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
