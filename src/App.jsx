import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./assets/context/AuthContext";
import { ToastProvider } from "./assets/components/Toast";
import { ProtectedRoute, AdminLayout } from "./assets/components/ProtectedRoute";
import Login from "./assets/pages/Login";
import Dashboard from "./assets/pages/Dashboard";
import Students from "./assets/pages/Students";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}