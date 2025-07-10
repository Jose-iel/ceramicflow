import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Truck, Users, ClipboardList, TreePine, 
  Settings, FileText, LayoutDashboard, Menu, X, Mountain, ShoppingCart
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, icon: Icon, label, isActive, onClick 
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 touch-manipulation",
        "min-h-[44px]", // Touch-friendly minimum height
        isActive 
          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm" 
          : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:scale-95"
      )}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  
  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/vehicles", icon: Truck, label: "Frota" },
    { to: "/employees", icon: Users, label: "Funcionários" },
    { to: "/operations", icon: ClipboardList, label: "Operações" },
    { to: "/maintenance", icon: Settings, label: "Manutenção" },
    { to: "/sales", icon: ShoppingCart, label: "Vendas" },
    { to: "/wood", icon: TreePine, label: "Lenha" },
    { to: "/raw-material", icon: Mountain, label: "Matéria-Prima" },
    { to: "/reports", icon: FileText, label: "Relatórios" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={cn(
            "fixed top-4 left-4 z-50 p-3 rounded-lg bg-primary text-primary-foreground shadow-lg",
            "touch-manipulation min-h-[44px] min-w-[44px]", // Touch-friendly size
            "transition-all duration-300 active:scale-95",
            "hover:shadow-xl hover:bg-primary/90"
          )}
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar Backdrop (Mobile Only) */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transition-all duration-300 ease-out",
          "border-r border-sidebar-border shadow-xl backdrop-blur-sm",
          "flex flex-col", // Garantir que o flex funcione
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border flex-shrink-0">
            <div className="flex items-center space-x-2 min-w-0">
              <Mountain className="h-6 w-6 text-sidebar-foreground flex-shrink-0" />
              <h1 className="text-lg font-bold text-sidebar-foreground truncate">CeramicFlow</h1>
            </div>
            {isMobile && (
              <button
                onClick={closeSidebar}
                className={cn(
                  "p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200",
                  "min-h-[40px] min-w-[40px] touch-manipulation active:scale-95"
                )}
                aria-label="Fechar Menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Sidebar Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-accent">
            {links.map((link) => (
              <SidebarLink 
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                isActive={location.pathname === link.to}
                onClick={isMobile ? closeSidebar : undefined}
              />
            ))}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sidebar-border flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-sidebar-accent-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Administrador</p>
                <p className="text-xs text-sidebar-foreground/70">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
