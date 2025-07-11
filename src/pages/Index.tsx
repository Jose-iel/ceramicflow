
import { useState, useEffect } from 'react';

import PageLayout from '@/components/common/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { useAuth } from '@/hooks/useAuth';
import { useMonthFilter } from '@/hooks/useMonthFilter';

const Index = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const { user: _user } = useAuth();
  const { selectedMonth, setSelectedMonth } = useMonthFilter();

  useEffect(() => {
    // Set current date in Brazilian format
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setCurrentDate(now.toLocaleDateString('pt-BR', options));

    // First letter uppercase
    setCurrentDate(prev =>
      prev.charAt(0).toUpperCase() + prev.slice(1),
    );
  }, []);

  return (
    <PageLayout
      selectedMonth={selectedMonth}
      showSearch={false} // Dashboard não precisa de busca
      statsCards={[]} // Dashboard tem seus próprios cards
      subtitle={currentDate}
      title="Dashboard"
      onMonthChange={setSelectedMonth}
    >
      <DashboardOverview />
    </PageLayout>
  );
};

export default Index;
