import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage"; // Renamed from Index
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { MyuzeProvider, useMyuze } from "./context/MyuzeContext";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Playlists from "./pages/Playlists";
import Stores from "./pages/Stores";
import Player from "./pages/Player";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Library from "./pages/Library"; // Import the new Library page
import React from "react"; // Import React for JSX

const queryClient = new QueryClient();

// ProtectedRoute component to guard routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useMyuze();
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Playlists />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Stores />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/library" // New route for Library
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Library />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/:storeId"
          element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
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