import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HundiProvider, useHundi } from './context/HundiContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastNotification';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { VaultsPage } from './pages/VaultsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { SystemDiagnosticsPage } from './pages/SystemDiagnosticsPage';
import { CoinsPage } from './pages/CoinsPage';
import { NotesPage } from './pages/NotesPage';
import { StoragePage } from './pages/StoragePage';
import { LiveCollectionPage } from './pages/LiveCollectionPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AddDonationModal } from './components/AddDonationModal';
import { Esp32SimulatorModal } from './components/Esp32SimulatorModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import {
  LayoutDashboard, Radio, Coins, Banknote, HardDrive,
  FileSpreadsheet, BarChart3, Bell, ClipboardList, Cpu, Settings
} from 'lucide-react';

const mobileNavItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live', label: 'Live', icon: Radio },
  { id: 'coins', label: 'Coins', icon: Coins },
  { id: 'notes', label: 'Notes', icon: Banknote },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'transactions', label: 'Txns', icon: FileSpreadsheet },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'reports', label: 'Reports', icon: ClipboardList },
  { id: 'diagnostics', label: 'Monitor', icon: Cpu },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const renderPage = (tab) => {
  switch (tab) {
    case 'overview': return <DashboardPage />;
    case 'live': return <LiveCollectionPage />;
    case 'coins': return <CoinsPage />;
    case 'notes': return <NotesPage />;
    case 'storage': return <StoragePage />;
    case 'vaults': return <VaultsPage />;
    case 'transactions': return <TransactionsPage />;
    case 'analytics': return <AnalyticsPage />;
    case 'alerts': return <AlertsPage />;
    case 'reports': return <ReportsPage />;
    case 'diagnostics': return <SystemDiagnosticsPage />;
    case 'settings': return <SettingsPage />;
    default: return <DashboardPage />;
  }
};

const MainContent = () => {
  const { toasts, removeToast } = useHundi();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        <main className="flex-1 p-4 lg:p-6 xl:p-8 w-full overflow-x-hidden overflow-y-auto">
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center bg-surface-50 p-1 rounded-xl border border-surface-border mb-4 overflow-x-auto scrollbar-hide gap-0.5">
            {mobileNavItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap text-[11px] font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-gold-500 text-black font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Page with key-based transition */}
          <div key={activeTab} className="page-enter max-w-[1400px] mx-auto">
            {renderPage(activeTab)}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <AddDonationModal />
      <Esp32SimulatorModal />
      <ResetConfirmModal />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <HundiProvider>
      <MainContent />
    </HundiProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
