
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/integrations/supabase/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import Employees from "./pages/Employees";
import Operations from "./pages/Operations";
import Maintenance from "./pages/Maintenance";
import Wood from "./pages/Wood";
import RawMaterial from "./pages/RawMaterial";
import GasSupply from "./pages/GasSupply";
import Reports from "./pages/Reports";
import Operators from "./pages/Operators";
import Forklifts from "./pages/Forklifts";
import Sales from "./pages/Sales";

import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminBackoffice from "./pages/AdminBackoffice";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
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
            <BrowserRouter>
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
                  path="/gas-supply" 
                  element={
                    <ProtectedRoute>
                      <GasSupply />
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
                  path="/operators" 
                  element={
                    <ProtectedRoute>
                      <Operators />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/forklifts" 
                  element={
                    <ProtectedRoute>
                      <Forklifts />
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
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
