import React from 'react';
import { useHundi } from '../context/HundiContext';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { MachineStatusPanel } from '../components/MachineStatusPanel';
import { SystemAlertsBanner } from '../components/SystemAlertsBanner';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { RecentTransactionsTable } from '../components/RecentTransactionsTable';
import { StorageBar } from '../components/StorageBar';
import {
  IndianRupee,
  Coins,
  Banknote,
  Radio,
  LayoutDashboard,
} from 'lucide-react';

export const DashboardPage = () => {
  const { summary, loading } = useHundi();

  const totalDonationAmount = summary?.totalDonationAmount ?? 0;
  const totalCoinsCount = summary?.totalCoinsCount ?? 0;
  const totalCoinsAmount = summary?.totalCoinsAmount ?? 0;
  const totalNotesCount = summary?.totalNotesCount ?? 0;
  const totalNotesAmount = summary?.totalNotesAmount ?? 0;
  const coinBoxes = summary?.coinBoxes || [];
  const noteBoxes = summary?.noteBoxes || [];
  const isOnline = summary?.machineStatus?.isOnline ?? true;

  if (loading && !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-3 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-500">Loading dashboard data...</p>
      </div>
    );
  }

  // Quick storage overview
  const allBoxes = [...coinBoxes, ...noteBoxes];
  const totalItemsCount = allBoxes.reduce((acc, b) => acc + b.count, 0);
  const totalItemsMax = allBoxes.reduce((acc, b) => acc + b.maxCapacity, 0);
  const overallPct = totalItemsMax > 0 ? Number(((totalItemsCount / totalItemsMax) * 100).toFixed(1)) : 0;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        icon={LayoutDashboard}
        title="Overview"
        subtitle="Smart Hundi system dashboard — prototype data"
        badge="Simulation Mode"
      />

      {/* Alert Banners */}
      <SystemAlertsBanner />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Collection"
          value={`₹${totalDonationAmount.toLocaleString()}`}
          subtext="All denominations"
          icon={IndianRupee}
          color="gold"
          trend="+14.2%"
        />
        <StatCard
          title="Today's Collection"
          value={`₹${Math.round(totalDonationAmount * 0.12).toLocaleString()}`}
          subtext="Estimated today"
          icon={IndianRupee}
          color="emerald"
          trend="+8.5%"
        />
        <StatCard
          title="Total Coins"
          value={`${totalCoinsCount.toLocaleString()}`}
          subtext={`₹${totalCoinsAmount.toLocaleString()}`}
          icon={Coins}
          color="sky"
          badge="4 bins"
        />
        <StatCard
          title="Total Notes"
          value={`${totalNotesCount.toLocaleString()}`}
          subtext={`₹${totalNotesAmount.toLocaleString()}`}
          icon={Banknote}
          color="gold"
          badge="6 bins"
        />
      </div>

      {/* Live System Status - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MachineStatusPanel />
        </div>
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white font-display mb-4">Storage Overview</h3>
          <div className="space-y-3">
            <StorageBar percentage={overallPct} label="Overall Capacity" size="md" />
            <div className="pt-3 border-t border-surface-border/60 space-y-2.5">
              {coinBoxes.slice(0, 4).map(box => (
                <StorageBar
                  key={`coin-${box.denomination}`}
                  percentage={box.percentage}
                  label={`₹${box.denomination} Coin`}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <AnalyticsSection />

      {/* Recent Transactions */}
      <RecentTransactionsTable />
    </div>
  );
};
