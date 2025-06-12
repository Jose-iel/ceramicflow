
import React from "react";
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
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminBackoffice from "./pages/AdminBackoffice";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
              <VehiclesPage />
            </ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute>
              <EmployeesPage />
            </ProtectedRoute>
          } />
          <Route path="/operations" element={
            <ProtectedRoute>
              <OperationsPage />
            </ProtectedRoute>
          } />
          <Route path="/maintenance" element={
            <ProtectedRoute>
              <MaintenancePage />
            </ProtectedRoute>
          } />
          <Route path="/wood" element={
            <ProtectedRoute>
              <WoodPage />
            </ProtectedRoute>
          } />
          <Route path="/raw-material" element={
            <ProtectedRoute>
              <RawMaterialPage />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin-backoffice" element={
            <ProtectedRoute>
              <AdminBackoffice />
            </ProtectedRoute>
          } />
          {/* Legacy routes for compatibility */}
          <Route path="/forklifts" element={
            <ProtectedRoute>
              <VehiclesPage />
            </ProtectedRoute>
          } />
          <Route path="/operators" element={
            <ProtectedRoute>
              <EmployeesPage />
            </ProtectedRoute>
          } />
          <Route path="/gas-supply" element={
            <ProtectedRoute>
              <WoodPage />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
