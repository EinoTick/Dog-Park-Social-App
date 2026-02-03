import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "./Navbar";

export default function AppLayout() {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      <Navbar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-auto container mx-auto p-4 max-w-6xl relative">
        <div className="md:hidden sticky top-0 z-30 flex items-center h-14 min-h-14 -mt-4 -mx-4 px-4 mb-4 bg-base-100 border-b border-base-300 shadow-sm">
          <button
            type="button"
            className="btn btn-square btn-ghost shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
