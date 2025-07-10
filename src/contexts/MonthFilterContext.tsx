import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MonthFilterContextType {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  getCurrentMonth: () => string;
}

const MonthFilterContext = createContext<MonthFilterContextType | undefined>(undefined);

interface MonthFilterProviderProps {
  children: ReactNode;
}

export const MonthFilterProvider: React.FC<MonthFilterProviderProps> = ({ children }) => {
  // Set current month as default
  const getCurrentMonth = () => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  };

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());

  return (
    <MonthFilterContext.Provider value={{
      selectedMonth,
      setSelectedMonth,
      getCurrentMonth
    }}>
      {children}
    </MonthFilterContext.Provider>
  );
};

export { MonthFilterContext };
