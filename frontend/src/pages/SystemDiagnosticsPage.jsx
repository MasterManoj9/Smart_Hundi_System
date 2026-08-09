import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { MachineStatusPanel } from '../components/MachineStatusPanel';
import { useHundi } from '../context/HundiContext';
import { Cpu, Zap, Code2, Wifi, Database, Monitor, ArrowRight } from 'lucide-react';

export const SystemDiagnosticsPage = () => {
  const { setIsEsp32ModalOpen } = useHundi();

  const systemNodes = [
    { label: 'Coin Unit', icon: '🪙', status: 'Simulated', desc: 'Inductive sensor' },
    { label: 'Note Unit', icon: '💵', status: 'Simulated', desc: 'Optical validator' },
    { label: 'ESP32 MCU', icon: '🔧', status: 'Simulated', desc: 'Dual-core controller' },
    { label: 'Wi-Fi', icon: '📡', status: 'Simulated', desc: 'Network bridge' },
    { label: 'Database', icon: '🗄️', status: 'In-Memory', desc: 'Data store' },
    { label: 'Dashboard', icon: '📊', status: 'Active', desc: 'This interface' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <PageHeader icon={Cpu} title="Machine Monitor" subtitle="ESP32 hardware diagnostics and IoT system architecture" badge="Simulation Mode">
        <button
          onClick={() => setIsEsp32ModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gold-500 text-black text-xs font-bold transition-colors hover:bg-gold-400"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Test Pulse API</span>
        </button>
      </PageHeader>

      <MachineStatusPanel />

      {/* System Architecture */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center gap-2 pb-4 border-b border-surface-border mb-4">
          <Monitor className="w-4 h-4 text-gold-500" />
          <h3 className="font-bold text-sm text-white font-display">System Architecture</h3>
          <span className="simulation-badge ml-2">Hardware Not Connected</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 py-6">
          {systemNodes.map((node, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-100 border border-surface-border min-w-[120px]">
                <span className="text-2xl">{node.icon}</span>
                <div className="text-center">
                  <p className="text-xs font-semibold text-white">{node.label}</p>
                  <p className="text-[10px] text-slate-500">{node.desc}</p>
                </div>
                <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                  node.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {node.status}
                </span>
              </div>
              {idx < systemNodes.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* API Reference */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center gap-2 pb-4 border-b border-surface-border mb-4">
          <Code2 className="w-4 h-4 text-gold-500" />
          <h3 className="font-bold text-sm text-white font-display">ESP32 REST API Reference</h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-xl bg-surface-100 border border-surface-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gold-400">POST /api/iot/pulse</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-semibold">Webhook</span>
            </div>
            <p className="text-slate-400 font-sans text-xs">
              ESP32 sends this payload when a coin or note passes through the sensor.
            </p>
            <pre className="bg-[#0C0E14] p-3 rounded-lg text-slate-300 overflow-x-auto text-[11px]">
{`{
  "apiKey": "ESP32_HUNDI_API_KEY_SECRET",
  "hundiId": "TH-MAIN-01",
  "type": "COIN",
  "denomination": 10,
  "count": 1,
  "sensorChannel": "GPIO_14_INDUCTIVE"
}`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-surface-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gold-400">POST /api/iot/telemetry</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-semibold">Heartbeat</span>
            </div>
            <p className="text-slate-400 font-sans text-xs">
              Periodic heartbeat with MCU temperature, Wi-Fi RSSI, and sensor status.
            </p>
            <pre className="bg-[#0C0E14] p-3 rounded-lg text-slate-300 overflow-x-auto text-[11px]">
{`{
  "hundiId": "TH-MAIN-01",
  "isOnline": true,
  "temperature": 32.5,
  "coinJam": false,
  "noteJam": false,
  "wifiSignal": -58
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
