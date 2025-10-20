import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { MyuzeProvider, useMyuze } from "./context/MyuzeContext";
import DashboardLayout from "./components/DashboardLayout";
import ClientDashboardLayout from "./components/ClientDashboardLayout"; // Importar o novo layout
import DashboardHome from "./pages/DashboardHome";
import Playlists from "./pages/Playlists";
import Player from "./pages/Player";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Library from "./pages/Library";
import Clients from "./pages/Clients";
import ClientDashboard from "./pages/ClientDashboard"; // Importar o novo painel do cliente
import React from "react";

const queryClient = new QueryClient();

// ProtectedRoute component to guard routes based on role
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: Array<'admin' | 'user' | 'client'> }) => {
  const { currentUser } = useMyuze();

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect based on role if not allowed
    if (currentUser.role === 'client') {
      return <Navigate to="/client-dashboard" replace />;
    }
    // Default redirect for other unauthorized roles
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />

        {/* Admin/User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlists"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <DashboardLayout>
                <Playlists />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <DashboardLayout>
                <Clients />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <DashboardLayout>
                <Library />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/:storeId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user', 'client']}> {/* Player pode ser acessado por clientes */}
              <Player />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Client Protected Routes */}
        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboardLayout>
                <ClientDashboard />
              </ClientDashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Adicione outras rotas específicas do cliente aqui, usando ClientDashboardLayout */}
        <Route
          path="/client-playlists"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboardLayout>
                {/* Placeholder for client-specific playlists page */}
                <div className="text-myuze-white p-8">
                  <h1 className="text-4xl font-bold mb-4">Minhas Playlists (Cliente)</h1>
                  <p className="text-xl text-gray-300">Aqui o cliente verá suas playlists atribuídas.</p>
                </div>
              </ClientDashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-reports"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboardLayout>
                {/* Placeholder for client-specific reports page */}
                <div className="text-myuze-white p-8">
                  <h1 className="text-4xl font-bold mb-4">Relatórios (Cliente)</h1>
                  <p className="text-xl text-gray-300">Aqui o cliente verá relatórios de reprodução.</p>
                </div>
              </ClientDashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-settings"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboardLayout>
                {/* Placeholder for client-specific settings page */}
                <div className="text-myuze-white p-8">
                  <h1 className="text-4xl font-bold mb-4">Configurações (Cliente)</h1>
                  <p className="text-xl text-gray-300">Aqui o cliente poderá ajustar suas configurações.</p>
                </div>
              </ClientDashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MyuzeProvider>
        <AppContent />
      </MyuzeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;