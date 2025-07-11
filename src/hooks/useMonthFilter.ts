import { useMemo, useContext } from 'react';

import { MonthFilterContext } from '@/contexts/MonthFilterContext';

export interface UseMonthFilterResult {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  getCurrentMonth: () => string;
  filterDataByMonth: <T extends { date?: string }>(data: T[]) => T[];
}

export function useMonthFilter(): UseMonthFilterResult {
  const context = useContext(MonthFilterContext);

  if (context === undefined) {
    throw new Error('useMonthFilter must be used within a MonthFilterProvider');
  }

  const { selectedMonth, setSelectedMonth, getCurrentMonth } = context;

  // Function to filter data by selected month
  const filterDataByMonth = useMemo(() => {
    return <T extends { date?: string }>(data: T[]): T[] => {
      return data.filter(item => {
        const itemMonth = item.date ? item.date.substring(0, 7) : '';
        return itemMonth === selectedMonth;
      });
    };
  }, [selectedMonth]);

  return {
    selectedMonth,
    setSelectedMonth,
    getCurrentMonth,
    filterDataByMonth,
  };
}
