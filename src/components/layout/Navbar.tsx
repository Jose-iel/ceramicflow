
import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  const isMobile = useIsMobile();

  return (
    <header className={cn(
      "w-full py-4 px-6 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-30",
      isMobile && "pl-16" // Add left padding on mobile to account for menu button
    )}>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl md:text-2xl font-bold truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs md:text-sm text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        {/* Search - Hidden on small screens */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="py-2 pl-10 pr-4 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring w-full max-w-xs transition-all duration-300"
          />
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors duration-200">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-status-warning" />
          </button>
        </div>
        
        {/* User Menu */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs md:text-sm">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-xs md:text-sm font-medium">Admin</p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
