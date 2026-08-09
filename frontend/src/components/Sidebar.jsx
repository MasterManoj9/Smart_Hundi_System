import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Coins,
  Banknote,
  HardDrive,
  FileSpreadsheet,
  BarChart3,
  Bell,
  ClipboardList,
  Settings,
  RotateCcw,
  Zap,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Activity
} from 'lucide-react';
import { useHundi } from '../context/HundiContext';

const navGroups = [
  {
    label: 'Dashboard',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'live', label: 'Live Collection', icon: Radio },
    ]
  },
  {
    label: 'Management',
    items: [
      { id: 'coins', label: 'Coins', icon: Coins },
      { id: 'notes', label: 'Notes', icon: Banknote },
      { id: 'storage', label: 'Storage', icon: HardDrive },
      { id: 'transactions', label: 'Transactions', icon: FileSpreadsheet },
    ]
  },
  {
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'alerts', label: 'Alerts', icon: Bell },
      { id: 'reports', label: 'Reports', icon: ClipboardList },
    ]
  },
  {
    label: 'System',
    items: [
      { id: 'diagnostics', label: 'Machine Monitor', icon: Cpu },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  },
];

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const { setIsResetConfirmOpen, setIsEsp32ModalOpen, summary } = useHundi();
  const isOnline = summary?.machineStatus?.isOnline ?? true;

  return (
    <aside className={`${collapsed ? 'w-[68px]' : 'w-60'} bg-surface-50/50 border-r border-surface-border hidden md:flex flex-col justify-between min-h-[calc(100vh-57px)] sidebar-transition select-none`}>
      <div className="flex flex-col flex-1 py-3 px-2.5 overflow-y-auto scrollbar-hide">
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-5' : ''}>
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                {group.label}
              </p>
            )}
            <nav className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`relative w-full flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-gold-500/12 text-gold-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-surface-200/60'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-gold-500" />
                    )}
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-gold-400' : 'text-slate-500'}`} />
                    {!collapsed && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                    {item.id === 'alerts' && !collapsed && (
                      (() => {
                        const s = summary?.machineStatus || {};
                        const alertCount = [!s.isOnline, s.coinJam, s.noteJam, s.storageFullWarning].filter(Boolean).length;
                        if (alertCount === 0) return null;
                        return (
                          <span className="ml-auto text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                            {alertCount}
                          </span>
                        );
                      })()
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Quick Actions */}
        {!collapsed && (
          <div className="mt-6 pt-4 border-t border-surface-border">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Actions
            </p>
            <div className="space-y-0.5">
              <button
                onClick={() => setIsEsp32ModalOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-gold-400 hover:bg-gold-500/8 transition-colors"
              >
                <Zap className="w-[18px] h-[18px]" />
                <span>ESP32 Simulator</span>
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-red-400 hover:bg-red-500/8 transition-colors"
              >
                <RotateCcw className="w-[18px] h-[18px]" />
                <span>Reset Counts</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status & Collapse */}
      <div className="p-2.5 border-t border-surface-border">
        {!collapsed && (
          <div className="px-3 py-2.5 rounded-lg bg-surface-100 border border-surface-border mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-gold-500" />
                System Status
              </span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isOnline ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Simulation Mode Active</p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-200/60 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
