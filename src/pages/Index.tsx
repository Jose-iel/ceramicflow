
import { useState, useEffect } from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import PageLayout from '@/components/common/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { useMonthFilter } from '@/hooks/useMonthFilter';

const Index = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const { user } = useAuth();
  const { selectedMonth, setSelectedMonth } = useMonthFilter();
  
  useEffect(() => {
    // Set current date in Brazilian format
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(now.toLocaleDateString('pt-BR', options));
    
    // First letter uppercase
    setCurrentDate(prev => 
      prev.charAt(0).toUpperCase() + prev.slice(1)
    );
  }, []);

  return (
    <PageLayout
      title="Dashboard"
      subtitle={currentDate}
      selectedMonth={selectedMonth}
      onMonthChange={setSelectedMonth}
      statsCards={[]} // Dashboard tem seus próprios cards
      showSearch={false} // Dashboard não precisa de busca
    >
      <DashboardOverview />
    </PageLayout>
  );
};

export default Index;
