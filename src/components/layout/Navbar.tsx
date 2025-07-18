import { Bell, Search, ChevronDown, LogOut, User } from 'lucide-react';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, useCurrentUser } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const { displayName, initials, role } = useCurrentUser();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header
      className={cn(
        'w-full py-3 md:py-4 px-4 md:px-6 flex items-center justify-between',
        'bg-background/90 backdrop-blur-md border-b border-border',
        'sticky top-0 z-30 transition-all duration-200',
        isMobile && 'pl-16' // Add left padding on mobile to account for menu button
      )}
    >
      <div className="flex-1 min-w-0 mr-4">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold truncate">{title}</h1>
        {subtitle && <p className="text-xs md:text-sm text-muted-foreground truncate mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        {/* Search - Hidden on small screens, improved for larger screens */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            className={cn(
              'py-2 pl-10 pr-4 rounded-lg bg-secondary/50 border border-border/50',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:bg-secondary',
              'w-full max-w-xs transition-all duration-300',
              'placeholder:text-muted-foreground/70'
            )}
            placeholder="Buscar..."
            type="text"
          />
        </div>

        {/* Notifications - touch friendly */}
        <div className="relative">
          <button
            className={cn(
              'p-2 md:p-2.5 rounded-lg hover:bg-secondary/50 transition-colors duration-200',
              'touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center'
            )}
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-warning animate-pulse" />
          </button>
        </div>

        {/* User Menu - dropdown with logout option */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex items-center gap-2 p-1.5 md:p-2 rounded-lg hover:bg-secondary/50',
                'transition-colors duration-200 touch-manipulation min-h-[40px]'
              )}
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs md:text-sm font-medium">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs md:text-sm font-medium leading-tight">{displayName}</p>
                <p className="text-xs text-muted-foreground leading-tight">{role}</p>
              </div>
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>{displayName}</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span className="text-xs text-muted-foreground">{role}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
