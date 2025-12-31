import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RequireRole from "./components/RequireRole.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Settings from "./pages/dashboard/Settings.jsx";
import Users from "./pages/dashboard/Users.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ================= APP ================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            {/* Dashboard – çdo user */}
            <Route index element={<Dashboard />} />

            {/* Settings – vetëm OWNER */}
            <Route
              path="settings"
              element={
                <RequireRole roles={["TenantOwner"]}>
                  <Settings />
                </RequireRole>
              }
            />

            {/* Users – Owner & Admin */}
            <Route
              path="users"
              element={
                <RequireRole roles={["TenantOwner", "Admin"]}>
                  <Users />
                </RequireRole>
              }
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
