import React, { useState } from 'react';
import { useHundi } from '../context/HundiContext';
import {
  Search,
  FileDown,
  FileSpreadsheet,
  Coins,
  Banknote,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Filter,
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const RecentTransactionsTable = () => {
  const { transactions, searchQuery, setSearchQuery, dateFilter, setDateFilter } = useHundi();
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const itemsPerPage = 8;

  // Additional client-side type filter
  let filtered = transactions;
  if (typeFilter !== 'all') {
    filtered = filtered.filter(t => t.type === typeFilter);
  }

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Copy ID to clipboard
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(212, 175, 55); // Temple Gold
    doc.text('SMART IOT-AI AUTOMATED HUNDI SYSTEM', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text('Official Temple Administration Vault Collection & Audit Report', 14, 26);
    doc.text(`Generated On: ${new Date().toLocaleString()} | Filter: ${dateFilter.toUpperCase()}`, 14, 32);

    const tableColumn = ['Transaction ID', 'Timestamp', 'Type', 'Denomination', 'Count', 'Total Amount', 'Sensor Channel', 'Status'];
    const tableRows = transactions.map(t => [
      t.id,
      new Date(t.timestamp).toLocaleString(),
      t.type,
      `₹${t.denomination}`,
      `${t.count} pcs`,
      `₹${t.amount.toLocaleString()}`,
      t.channel || 'Vault Sensor',
      t.status || 'Verified'
    ]);

    doc.autoTable({
      startY: 38,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { fontSize: 8 }
    });

    doc.save(`Hundi_Audit_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Excel XLSX Export
  const exportExcel = () => {
    const exportData = transactions.map(t => ({
      'Transaction ID': t.id,
      'Date Time': new Date(t.timestamp).toLocaleString(),
      'Type': t.type,
      'Denomination (INR)': t.denomination,
      'Count (pcs)': t.count,
      'Total Amount (INR)': t.amount,
      'Sensor Channel': t.channel || 'Automated Sensor',
      'Audit Status': t.status || 'Verified'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hundi Audit Logs');
    XLSX.writeFile(workbook, `Hundi_Audit_Logs_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
      {/* Table Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-surface-border mb-4">
        <div>
          <h3 className="font-bold text-sm text-white font-display flex items-center gap-2">
            Recent Transactions
            <span className="text-[10px] text-slate-400 font-mono bg-surface-200 px-2 py-0.5 rounded-md font-normal">
              {filtered.length} entries
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Automated sensor verification logs</p>
        </div>

        {/* Search, Filter & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, denomination..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-surface-100 border border-surface-border text-xs text-white placeholder-slate-500 font-mono"
            />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-surface-100 px-2.5 py-2 rounded-lg border border-surface-border text-xs text-slate-300">
            <Calendar className="w-3 h-3 text-slate-500" />
            <select
              value={dateFilter}
              onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-200 cursor-pointer text-xs"
            >
              <option value="all" className="bg-surface-50">All Time</option>
              <option value="today" className="bg-surface-50">Today</option>
              <option value="7days" className="bg-surface-50">Last 7 Days</option>
              <option value="30days" className="bg-surface-50">Last 30 Days</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 bg-surface-100 px-2.5 py-2 rounded-lg border border-surface-border text-xs text-slate-300">
            <Filter className="w-3 h-3 text-slate-500" />
            <select
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-200 cursor-pointer text-xs"
            >
              <option value="all" className="bg-surface-50">All Types</option>
              <option value="COIN" className="bg-surface-50">Coins</option>
              <option value="NOTE" className="bg-surface-50">Notes</option>
            </select>
          </div>

          {/* PDF Export */}
          <button
            onClick={exportPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-medium transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Excel Export */}
          <button
            onClick={exportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/8 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Excel</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="text-slate-500 text-[10px] uppercase tracking-wider border-b border-surface-border">
            <tr>
              <th className="py-3 px-4 font-semibold">ID</th>
              <th className="py-3 px-4 font-semibold">Time</th>
              <th className="py-3 px-4 font-semibold">Type</th>
              <th className="py-3 px-4 font-semibold">Denomination</th>
              <th className="py-3 px-4 font-semibold">Qty</th>
              <th className="py-3 px-4 font-semibold">Amount</th>
              <th className="py-3 px-4 font-semibold hidden lg:table-cell">Channel</th>
              <th className="py-3 px-4 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="w-8 h-8 text-slate-600" />
                    <p>No transactions match your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedItems.map(t => {
                const isCoin = t.type === 'COIN';
                return (
                  <tr key={t.id} className="hover:bg-surface-100/50 transition-colors group">
                    <td className="py-3 px-4 font-mono text-[11px] text-gold-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span>{t.id}</span>
                        <button
                          onClick={() => handleCopyId(t.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-opacity"
                          title="Copy ID"
                        >
                          {copiedId === t.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(t.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        isCoin ? 'bg-gold-500/10 text-gold-400' : 'bg-sky-500/10 text-sky-400'
                      }`}>
                        {isCoin ? <Coins className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                        <span>{t.type}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">₹{t.denomination}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{t.count}</td>
                    <td className="py-3 px-4 font-mono font-bold text-gold-400">₹{t.amount?.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] hidden lg:table-cell">{t.channel || 'Sensor'}</td>

                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {t.status || 'Verified'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-surface-border text-xs text-slate-500">
        <span>
          Page <strong className="text-slate-300">{currentPage}</strong> of <strong className="text-slate-300">{totalPages}</strong>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-surface-100 border border-surface-border hover:bg-surface-200 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-surface-100 border border-surface-border hover:bg-surface-200 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
