import React, { useState } from 'react';
import { useHundi } from '../context/HundiContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, DollarSign, Award, Percent } from 'lucide-react';

export const AnalyticsSection = () => {
  const { summary, graphs } = useHundi();
  const [chartTimeframe, setChartTimeframe] = useState('daily'); // daily, weekly, monthly

  const dailyData = graphs?.dailyData || [];
  const weeklyData = graphs?.weeklyData || [];
  const monthlyData = graphs?.monthlyData || [];

  // Pie chart data from summary box counts
  const coinBoxes = summary?.coinBoxes || [];
  const noteBoxes = summary?.noteBoxes || [];

  const denominationPieData = [
    ...coinBoxes.map(b => ({ name: `₹${b.denomination} Coin`, value: b.totalValue, color: '#D4AF37' })),
    ...noteBoxes.map((b, idx) => {
      const colors = ['#38BDF8', '#818CF8', '#A78BFA', '#F472B6', '#FB7185', '#34D399'];
      return { name: `₹${b.denomination} Note`, value: b.totalValue, color: colors[idx % colors.length] };
    })
  ].filter(item => item.value > 0);

  const coinTotal = summary?.totalCoinsAmount || 0;
  const noteTotal = summary?.totalNotesAmount || 0;
  const grandTotal = summary?.totalDonationAmount || 1;
  const coinPct = ((coinTotal / grandTotal) * 100).toFixed(1);
  const notePct = ((noteTotal / grandTotal) * 100).toFixed(1);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-50 border border-surface-border p-3 rounded-xl shadow-xl text-xs">
          <p className="text-gold-400 font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="font-mono">
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const timeframes = [
    { key: 'daily', label: 'Today' },
    { key: 'weekly', label: 'This Week' },
    { key: 'monthly', label: 'This Month' },
  ];

  return (
    <div className="space-y-5">
      {/* Top Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-surface-50 border border-surface-border p-4 rounded-2xl">
          <div className="flex justify-between items-start text-xs text-slate-500 mb-1.5">
            <span>Coin / Note Ratio</span>
            <Percent className="w-4 h-4 text-gold-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-gold-400 font-mono">{coinPct}%</span>
            <span className="text-[10px] text-slate-500">Coins</span>
            <span className="text-lg font-extrabold text-sky-400 font-mono pl-1">{notePct}%</span>
            <span className="text-[10px] text-slate-500">Notes</span>
          </div>
          <div className="w-full bg-surface-300 h-1.5 rounded-full overflow-hidden mt-2 flex">
            <div style={{ width: `${coinPct}%` }} className="bg-gold-500 h-full" />
            <div style={{ width: `${notePct}%` }} className="bg-sky-400 h-full" />
          </div>
        </div>

        <div className="bg-surface-50 border border-surface-border p-4 rounded-2xl">
          <div className="flex justify-between items-start text-xs text-slate-500 mb-1.5">
            <span>Peak Hours</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-extrabold text-white font-mono">6–8 PM</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Prototype estimate</p>
        </div>

        <div className="bg-surface-50 border border-surface-border p-4 rounded-2xl">
          <div className="flex justify-between items-start text-xs text-slate-500 mb-1.5">
            <span>Avg Daily Inflow</span>
            <DollarSign className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-lg font-extrabold text-gold-400 font-mono">₹24,850</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Prototype data</p>
        </div>

        <div className="bg-surface-50 border border-surface-border p-4 rounded-2xl">
          <div className="flex justify-between items-start text-xs text-slate-500 mb-1.5">
            <span>Detection Accuracy</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-extrabold text-emerald-400 font-mono">99.94%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Target specification</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Timeline Collection Charts */}
        <div className="lg:col-span-2 bg-surface-50 border border-surface-border rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gold-500" />
              <h3 className="font-bold text-sm text-white font-display">Collection Trend</h3>
            </div>
            
            {/* Timeframe Switcher */}
            <div className="flex items-center bg-surface-100 p-0.5 rounded-lg border border-surface-border text-xs">
              {timeframes.map(tf => (
                <button
                  key={tf.key}
                  onClick={() => setChartTimeframe(tf.key)}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    chartTimeframe === tf.key
                      ? 'bg-gold-500 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartTimeframe === 'daily' ? (
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCoins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2F40" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={v => `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="notes" name="Notes (₹)" stroke="#D4AF37" fillOpacity={1} fill="url(#colorNotes)" strokeWidth={2} />
                  <Area type="monotone" dataKey="coins" name="Coins (₹)" stroke="#38BDF8" fillOpacity={1} fill="url(#colorCoins)" strokeWidth={2} />
                </AreaChart>
              ) : chartTimeframe === 'weekly' ? (
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2F40" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={v => `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="notes" name="Notes (₹)" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="coins" name="Coins (₹)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2F40" />
                  <XAxis dataKey="week" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={v => `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="notes" name="Notes (₹)" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="coins" name="Coins (₹)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Pie Chart */}
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-4 border-b border-surface-border">
            <PieIcon className="w-4 h-4 text-gold-500" />
            <h3 className="font-bold text-sm text-white font-display">Denomination Share</h3>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={denominationPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {denominationPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F1117" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-500 uppercase font-medium">Total</span>
              <span className="text-sm font-extrabold text-gold-400 font-mono">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] border-t border-surface-border/60 pt-3 max-h-24 overflow-y-auto scrollbar-hide">
            {denominationPieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 truncate">{item.name}</span>
                <span className="text-white font-mono font-semibold ml-auto">₹{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
