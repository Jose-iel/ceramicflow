
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VehiclesPage from "./pages/Vehicles";
import ReportsPage from "./pages/Reports";
import EmployeesPage from "./pages/Employees";
import OperationsPage from "./pages/Operations";
import MaintenancePage from "./pages/Maintenance";
import WoodPage from "./pages/Wood";
import RawMaterialPage from "./pages/RawMaterial";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/wood" element={<WoodPage />} />
          <Route path="/raw-material" element={<RawMaterialPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          {/* Legacy routes for compatibility */}
          <Route path="/forklifts" element={<VehiclesPage />} />
          <Route path="/operators" element={<EmployeesPage />} />
          <Route path="/gas-supply" element={<WoodPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
