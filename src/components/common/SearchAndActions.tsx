import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActionButtonConfig {
  label: string;
  mobileLabel?: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  className?: string;
}

interface SearchAndActionsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  actions: ActionButtonConfig[];
}

const SearchAndActions = ({ 
  searchValue, 
  onSearchChange, 
  searchPlaceholder = "Buscar...",
  actions 
}: SearchAndActionsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col gap-3 mb-4 md:mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            type="text" 
            placeholder={searchPlaceholder}
            className="pl-10"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {actions.map((action, index) => (
            <Button 
              key={index}
              variant={action.variant || 'default'}
              className={`gap-2 text-sm ${action.className || ''}`}
              onClick={action.onClick}
            >
              {action.icon || <Plus className="w-4 h-4" />}
              {isMobile && action.mobileLabel ? action.mobileLabel : action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAndActions;
