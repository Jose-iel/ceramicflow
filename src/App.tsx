
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/integrations/supabase/hooks/use-auth";
import { MonthFilterProvider } from "@/contexts/MonthFilterContext";
import { queryClient } from "@/lib/queryClient";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { LoadingState } from "@/components/common/ErrorStates";

// Lazy load components for better code splitting
const Index = lazy(() => import("./pages/Index"));
const Vehicles = lazy(() => import("./pages/Vehicles"));
const Employees = lazy(() => import("./pages/Employees"));
const Operations = lazy(() => import("./pages/Operations"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const Wood = lazy(() => import("./pages/Wood"));
const RawMaterial = lazy(() => import("./pages/RawMaterial"));
const Reports = lazy(() => import("./pages/Reports"));
const Sales = lazy(() => import("./pages/Sales"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const AdminBackoffice = lazy(() => import("./pages/AdminBackoffice"));

import ProtectedRoute from "./components/auth/ProtectedRoute";

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <LoadingState message="Carregando página..." size="lg" />
  </div>
);

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Global error caught:', error, errorInfo);
        // Aqui poderia integrar com serviços de monitoramento como Sentry
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <MonthFilterProvider>
                <BrowserRouter>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<Login />} />
                      
                      {/* Protected routes */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute>
                            <Index />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/vehicles" 
                        element={
                          <ProtectedRoute>
                            <Vehicles />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/employees" 
                        element={
                          <ProtectedRoute>
                            <Employees />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/operations" 
                        element={
                          <ProtectedRoute>
                            <Operations />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/maintenance" 
                        element={
                          <ProtectedRoute>
                            <Maintenance />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/wood" 
                        element={
                          <ProtectedRoute>
                            <Wood />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/raw-material" 
                        element={
                          <ProtectedRoute>
                            <RawMaterial />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/sales" 
                        element={
                          <ProtectedRoute>
                            <Sales />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/reports" 
                        element={
                          <ProtectedRoute>
                            <Reports />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute>
                            <AdminBackoffice />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Catch all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </MonthFilterProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
