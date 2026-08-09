import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const HundiContext = createContext();

export const HundiProvider = ({ children }) => {
  const [summary, setSummary] = useState(null);
  const [graphs, setGraphs] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Modal controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEsp32ModalOpen, setIsEsp32ModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const API_BASE = import.meta.env.VITE_API_URL || '';

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/hundi/summary`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setSummary(json.data);
      }
    } catch (err) {
      console.error('Fetch summary error:', err);
    }
  }, []);

  const fetchGraphs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/hundi/graphs`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setGraphs(json.data);
      }
    } catch (err) {
      console.error('Fetch graphs error:', err);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const url = `${API_BASE}/api/transactions?search=${encodeURIComponent(searchQuery)}&filterDate=${dateFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setTransactions(json.data);
      }
    } catch (err) {
      console.error('Fetch transactions error:', err);
    }
  }, [searchQuery, dateFilter]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchSummary(), fetchGraphs(), fetchTransactions()]);
    setLoading(false);
  }, [fetchSummary, fetchGraphs, fetchTransactions]);

  useEffect(() => {
    refreshAll();
    // Auto polling every 4 seconds for real-time ESP32 sync feeling
    const interval = setInterval(() => {
      fetchSummary();
      fetchTransactions();
    }, 4000);
    return () => clearInterval(interval);
  }, [refreshAll, fetchSummary, fetchTransactions]);

  const handleAddDonation = async ({ type, denomination, count }) => {
    try {
      const res = await fetch(`${API_BASE}/api/transactions/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, denomination, count })
      });
      const json = await res.json();
      if (json.success) {
        await refreshAll();
        addToast('success', `Successfully deposited ${count} × ₹${denomination} ${type.toLowerCase()}s`);
        return { success: true };
      }
      addToast('error', json.message || 'Failed to add donation');
      return { success: false, message: json.message };
    } catch (err) {
      addToast('error', err.message);
      return { success: false, message: err.message };
    }
  };

  const handleToggleAlert = async (alertType, value) => {
    try {
      const res = await fetch(`${API_BASE}/api/hundi/toggle-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertType, value })
      });
      const json = await res.json();
      if (json.success) {
        await fetchSummary();
        return { success: true };
      }
    } catch (err) {
      console.error('Toggle alert error:', err);
    }
  };

  const handleResetCounts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/hundi/reset`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await refreshAll();
        addToast('success', 'All vault counts have been reset to zero');
        return { success: true };
      }
      addToast('error', json.message || 'Reset failed');
      return { success: false, message: json.message };
    } catch (err) {
      addToast('error', err.message);
      return { success: false, message: err.message };
    }
  };

  return (
    <HundiContext.Provider
      value={{
        summary,
        graphs,
        transactions,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        dateFilter,
        setDateFilter,
        isAddModalOpen,
        setIsAddModalOpen,
        isEsp32ModalOpen,
        setIsEsp32ModalOpen,
        isResetConfirmOpen,
        setIsResetConfirmOpen,
        refreshAll,
        handleAddDonation,
        handleToggleAlert,
        handleResetCounts,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </HundiContext.Provider>
  );
};

export const useHundi = () => useContext(HundiContext);
