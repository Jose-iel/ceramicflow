import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/integrations/supabase/hooks/use-auth";
import { MonthFilterProvider } from "@/contexts/MonthFilterContext";
import { queryClient } from "@/lib/queryClient";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// Import components directly (no lazy loading)
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import Employees from "./pages/Employees";
import Operations from "./pages/Operations";
import Maintenance from "./pages/Maintenance";
import Wood from "./pages/Wood";
import RawMaterial from "./pages/RawMaterial";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminBackoffice from "./pages/AdminBackoffice";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MonthFilterProvider>
            <TooltipProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    <Route path="/vehicles" element={
                      <ProtectedRoute>
                        <Vehicles />
                      </ProtectedRoute>
                    } />
                    <Route path="/employees" element={
                      <ProtectedRoute>
                        <Employees />
                      </ProtectedRoute>
                    } />
                    <Route path="/operations" element={
                      <ProtectedRoute>
                        <Operations />
                      </ProtectedRoute>
                    } />
                    <Route path="/maintenance" element={
                      <ProtectedRoute>
                        <Maintenance />
                      </ProtectedRoute>
                    } />
                    <Route path="/wood" element={
                      <ProtectedRoute>
                        <Wood />
                      </ProtectedRoute>
                    } />
                    <Route path="/raw-material" element={
                      <ProtectedRoute>
                        <RawMaterial />
                      </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    <Route path="/sales" element={
                      <ProtectedRoute>
                        <Sales />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin-backoffice" element={
                      <ProtectedRoute>
                        <AdminBackoffice />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </BrowserRouter>
            </TooltipProvider>
          </MonthFilterProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
