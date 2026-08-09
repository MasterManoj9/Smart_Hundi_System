import React, { useState } from 'react';
import { useHundi } from '../context/HundiContext';
import { PageHeader } from '../components/PageHeader';
import { ClipboardList, FileDown, FileSpreadsheet, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ReportsPage = () => {
  const { summary, transactions } = useHundi();
  const [reportType, setReportType] = useState('daily');

  const coinBoxes = summary?.coinBoxes || [];
  const noteBoxes = summary?.noteBoxes || [];
  const totalDonation = summary?.totalDonationAmount || 0;
  const totalCoins = summary?.totalCoinsAmount || 0;
  const totalNotes = summary?.totalNotesAmount || 0;

  const reportTypes = [
    { key: 'daily', label: 'Daily Report' },
    { key: 'weekly', label: 'Weekly Report' },
    { key: 'monthly', label: 'Monthly Report' },
    { key: 'denomination', label: 'Denomination Report' },
  ];

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(212, 175, 55);
    doc.text('SMART HUNDI SYSTEM — COLLECTION REPORT', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text(`Report Type: ${reportType.toUpperCase()} | Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Collection: INR ${totalDonation.toLocaleString()} | Coins: INR ${totalCoins.toLocaleString()} | Notes: INR ${totalNotes.toLocaleString()}`, 14, 34);

    if (reportType === 'denomination') {
      const denomData = [
        ...coinBoxes.map(b => ['COIN', `₹${b.denomination}`, b.count, `₹${b.totalValue.toLocaleString()}`, `${b.percentage}%`]),
        ...noteBoxes.map(b => ['NOTE', `₹${b.denomination}`, b.count, `₹${b.totalValue.toLocaleString()}`, `${b.percentage}%`]),
      ];
      doc.autoTable({
        startY: 42,
        head: [['Type', 'Denomination', 'Count', 'Value', 'Storage']],
        body: denomData,
        theme: 'grid',
        headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 9 }
      });
    } else {
      const tableRows = transactions.map(t => [
        t.id, new Date(t.timestamp).toLocaleString(), t.type, `₹${t.denomination}`,
        t.count, `₹${t.amount.toLocaleString()}`, t.status || 'Verified'
      ]);
      doc.autoTable({
        startY: 42,
        head: [['ID', 'Timestamp', 'Type', 'Denomination', 'Count', 'Amount', 'Status']],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 8 }
      });
    }

    doc.save(`Hundi_${reportType}_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportExcel = () => {
    let data;
    if (reportType === 'denomination') {
      data = [
        ...coinBoxes.map(b => ({ Type: 'COIN', Denomination: b.denomination, Count: b.count, 'Value (INR)': b.totalValue, 'Storage %': b.percentage })),
        ...noteBoxes.map(b => ({ Type: 'NOTE', Denomination: b.denomination, Count: b.count, 'Value (INR)': b.totalValue, 'Storage %': b.percentage })),
      ];
    } else {
      data = transactions.map(t => ({
        'ID': t.id, 'Date': new Date(t.timestamp).toLocaleString(), 'Type': t.type,
        'Denomination': t.denomination, 'Count': t.count, 'Amount': t.amount, 'Status': t.status || 'Verified'
      }));
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `Hundi_${reportType}_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Preview data
  const previewData = reportType === 'denomination'
    ? [...coinBoxes, ...noteBoxes]
    : transactions.slice(0, 8);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader icon={ClipboardList} title="Reports" subtitle="Generate and export collection reports" badge="Prototype Data" />

      {/* Report Type Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {reportTypes.map(rt => (
          <button
            key={rt.key}
            onClick={() => setReportType(rt.key)}
            className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
              reportType === rt.key
                ? 'bg-gold-500 text-black border-gold-400 font-bold'
                : 'bg-surface-50 text-slate-400 border-surface-border hover:bg-surface-100'
            }`}
          >
            {rt.label}
          </button>
        ))}
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Total Collection</p>
          <p className="text-2xl font-extrabold text-gold-400 font-mono">₹{totalDonation.toLocaleString()}</p>
        </div>
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Coins</p>
          <p className="text-2xl font-extrabold text-white font-mono">₹{totalCoins.toLocaleString()}</p>
        </div>
        <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">Notes</p>
          <p className="text-2xl font-extrabold text-white font-mono">₹{totalNotes.toLocaleString()}</p>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-medium transition-colors"
        >
          <FileDown className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
        <button
          onClick={exportExcel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/8 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Report Preview */}
      <div className="bg-surface-50 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white font-display">Report Preview</h3>
          <span className="text-[10px] text-slate-500 font-mono">
            {reportType === 'denomination' ? `${previewData.length} denominations` : `${transactions.length} entries total`}
          </span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'denomination' ? (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-slate-500 text-[10px] uppercase tracking-wider border-b border-surface-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Denomination</th>
                  <th className="py-3 px-4 font-semibold">Count</th>
                  <th className="py-3 px-4 font-semibold">Value</th>
                  <th className="py-3 px-4 font-semibold">Storage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {previewData.map((b, idx) => (
                  <tr key={idx} className="hover:bg-surface-100/50">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        b.type === 'COIN' ? 'bg-gold-500/10 text-gold-400' : 'bg-sky-500/10 text-sky-400'
                      }`}>{b.type}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">₹{b.denomination}</td>
                    <td className="py-3 px-4 font-mono">{b.count.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-gold-400 font-bold">₹{b.totalValue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold ${
                        b.percentage >= 90 ? 'text-red-400' : b.percentage >= 70 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{b.percentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-slate-500 text-[10px] uppercase tracking-wider border-b border-surface-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Time</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Denomination</th>
                  <th className="py-3 px-4 font-semibold">Qty</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {previewData.map(t => (
                  <tr key={t.id} className="hover:bg-surface-100/50">
                    <td className="py-3 px-4 font-mono text-gold-400 text-[11px]">{t.id}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{new Date(t.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        t.type === 'COIN' ? 'bg-gold-500/10 text-gold-400' : 'bg-sky-500/10 text-sky-400'
                      }`}>{t.type}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">₹{t.denomination}</td>
                    <td className="py-3 px-4 font-mono">{t.count}</td>
                    <td className="py-3 px-4 font-mono text-gold-400 font-bold">₹{t.amount?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] text-emerald-400 font-semibold">{t.status || 'Verified'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
