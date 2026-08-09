import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { RecentTransactionsTable } from '../components/RecentTransactionsTable';
import { FileSpreadsheet } from 'lucide-react';

export const TransactionsPage = () => {
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        icon={FileSpreadsheet}
        title="Transactions"
        subtitle="Complete audit trail with search, filters, and export capabilities"
        badge="Simulation Mode"
      />
      <RecentTransactionsTable />
    </div>
  );
};
