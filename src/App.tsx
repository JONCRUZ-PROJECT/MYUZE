import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom"; // Importar useParams
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { MyuzeProvider, useMyuze } from "./context/MyuzeContext";
import DashboardLayout from "./components/DashboardLayout";
import ClientDashboardLayout from "./components/ClientDashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Playlists from "./pages/Playlists";
import Player from "./pages/Player"; // Este é o player antigo, manter por enquanto
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Library from "./pages/Library";
import Clients from "./pages/Clients";
import ClientDashboard from "./pages/ClientDashboard";
import AdminClientView from "./pages/AdminClientView";
import ClientBoards from "./pages/ClientBoards";
import BoardPlayerAuth from "./pages/BoardPlayerAuth"; // Importar o novo componente de autenticação do player
import BoardPlayer from "./pages/BoardPlayer"; // Importar o novo componente do player
import ClientPlaylistsPage from "./pages/ClientPlaylistsPage"; // Importar o novo componente ClientPlaylistsPage
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

// PlayerProtectedRoute component to guard player routes
const PlayerProtectedRoute = ({ children }: { children: React.ReactNode }) => { // Remover boardId dos props
  const { boardId } = useParams<{ boardId: string }>(); // Obter boardId internamente
  const { currentBoardPlayer } = useMyuze();

  if (!boardId) {
    return <Navigate to="/client-boards" replace />; // Redireciona se não houver boardId
  }

  if (!currentBoardPlayer || currentBoardPlayer.id !== boardId) {
    return <Navigate to={`/player-auth/${boardId}`} replace />;
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
            <ProtectedRoute allowedRoles={['admin', 'user', 'client']}>
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
        {/* Nova rota para administradores visualizarem o painel de um cliente */}
        <Route
          path="/admin/client-dashboard/:clientId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <DashboardLayout>
                <AdminClientView />
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
        <Route
          path="/client-playlists"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboardLayout>
                <ClientPlaylistsPage /> {/* Usando o novo componente aqui */}
              </ClientDashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-boards"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboardLayout>
                <ClientBoards />
              </ClientDashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-reports"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboardLayout>
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
                <div className="text-myuze-white p-8">
                  <h1 className="text-4xl font-bold mb-4">Configurações (Cliente)</h1>
                  <p className="text-xl text-gray-300">Aqui o cliente poderá ajustar suas configurações.</p>
                </div>
              </ClientDashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Player Board Routes */}
        <Route path="/player-auth/:boardId" element={<BoardPlayerAuth />} />
        <Route
          path="/player-board/:boardId"
          element={
            <PlayerProtectedRoute>
              <BoardPlayer />
            </PlayerProtectedRoute>
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