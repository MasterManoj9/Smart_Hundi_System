import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { BarChart3 } from 'lucide-react';

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        icon={BarChart3}
        title="Collection Analytics"
        subtitle="Detailed breakdown of daily, weekly, and monthly denomination distributions"
        badge="Prototype Data"
      />
      <AnalyticsSection />
    </div>
  );
};
