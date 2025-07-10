import React, { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import MonthFilter from '@/components/common/MonthFilter';
import StatsCard from '@/components/common/StatsCard';
import SearchAndActions from '@/components/common/SearchAndActions';
import { PageHeaderSkeleton, StatsGridSkeleton } from '@/components/ui/skeleton-variants';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardConfig {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  valueFormatter?: (value: string | number) => string;
}

interface ActionButtonConfig {
  label: string;
  mobileLabel?: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  className?: string;
}

interface PageLayoutProps {
  title: string;
  subtitle: string;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  statsCards?: StatsCardConfig[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: ActionButtonConfig[];
  children: ReactNode;
  isLoading?: boolean;
  showMonthFilter?: boolean;
  showSearch?: boolean;
}

const PageLayout = ({
  title,
  subtitle,
  selectedMonth,
  onMonthChange,
  statsCards = [],
  searchValue = '',
  onSearchChange,
  searchPlaceholder = "Buscar...",
  actions = [],
  children,
  isLoading = false,
  showMonthFilter = true,
  showSearch = true
}: PageLayoutProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
          <Navbar title={title} subtitle={subtitle} />
          <main className="flex-1 px-3 md:px-6 py-4 md:py-6 space-y-6">
            <PageHeaderSkeleton />
            <StatsGridSkeleton count={statsCards.length || 4} />
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col min-w-0",
        !isMobile && "ml-64"
      )}>
        <Navbar title={title} subtitle={subtitle} />
        
        <main className="flex-1 px-3 md:px-6 py-4 md:py-6 overflow-x-hidden space-y-6">
          {showMonthFilter && (
            <MonthFilter 
              selectedMonth={selectedMonth}
              onMonthChange={onMonthChange}
            />
          )}
          
          {/* Stats Cards */}
          {statsCards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {statsCards.map((card, index) => (
                <StatsCard key={index} {...card} />
              ))}
            </div>
          )}

          {/* Search and Actions */}
          {showSearch && (searchValue !== undefined && onSearchChange) && (
            <SearchAndActions
              searchValue={searchValue}
              onSearchChange={onSearchChange}
              searchPlaceholder={searchPlaceholder}
              actions={actions}
            />
          )}
          
          {/* Page Content */}
          <div className="space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
