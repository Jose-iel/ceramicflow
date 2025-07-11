import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminBackoffice from './pages/AdminBackoffice';
import Employees from './pages/Employees';
import Index from './pages/Index';
import Vehicles from './pages/Vehicles';

import Wood from './pages/Wood';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from '@/components/ui/tooltip';


import { MonthFilterProvider } from '@/contexts/MonthFilterContext';
import { AuthProvider } from '@/integrations/supabase/hooks/use-auth';
import { queryClient } from '@/lib/queryClient';

// Import components directly (no lazy loading)
import Operations from './pages/Operations';
import Maintenance from './pages/Maintenance';
import RawMaterial from './pages/RawMaterial';
import Reports from './pages/Reports';
import Sales from './pages/Sales';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

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
                    <Route element={<LandingPage />} path="/" />
                    <Route element={<Login />} path="/login" />
                    <Route element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } path="/dashboard" />
                    <Route element={
                      <ProtectedRoute>
                        <Vehicles />
                      </ProtectedRoute>
                    } path="/vehicles" />
                    <Route element={
                      <ProtectedRoute>
                        <Employees />
                      </ProtectedRoute>
                    } path="/employees" />
                    <Route element={
                      <ProtectedRoute>
                        <Operations />
                      </ProtectedRoute>
                    } path="/operations" />
                    <Route element={
                      <ProtectedRoute>
                        <Maintenance />
                      </ProtectedRoute>
                    } path="/maintenance" />
                    <Route element={
                      <ProtectedRoute>
                        <Wood />
                      </ProtectedRoute>
                    } path="/wood" />
                    <Route element={
                      <ProtectedRoute>
                        <RawMaterial />
                      </ProtectedRoute>
                    } path="/raw-material" />
                    <Route element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } path="/reports" />
                    <Route element={
                      <ProtectedRoute>
                        <Sales />
                      </ProtectedRoute>
                    } path="/sales" />
                    <Route element={
                      <ProtectedRoute>
                        <AdminBackoffice />
                      </ProtectedRoute>
                    } path="/admin-backoffice" />
                    <Route element={<NotFound />} path="*" />
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
