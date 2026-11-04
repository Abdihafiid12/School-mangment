import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

export function ProtectedRoute() {
  const { session, loading } = useAuth();
  if (loading) return <div className="p-10">Loading…</div>;
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function AdminLayout() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}