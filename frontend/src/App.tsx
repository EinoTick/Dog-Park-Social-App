import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import DogsPage from "./pages/dogs/DogsPage";
import ParksPage from "./pages/parks/ParksPage";
import ParkDetailPage from "./pages/parks/ParkDetailPage";
import VisitsPage from "./pages/visits/VisitsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Private routes — wrapped in AppLayout which checks auth */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dogs" element={<DogsPage />} />
              <Route path="/parks" element={<ParksPage />} />
              <Route path="/parks/:parkId" element={<ParkDetailPage />} />
              <Route path="/visits" element={<VisitsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
