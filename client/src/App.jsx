import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RequireRole from "./components/RequireRole.jsx";

import Home from "./pages/public/Home.jsx";
import Services from "./pages/public/Services.jsx";
import Blog from "./pages/public/Blog.jsx";
import BlogPost from "./pages/public/BlogPost.jsx";
import Contact from "./pages/public/Contact.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AcceptInvite from "./pages/auth/AcceptInvite.jsx";

import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Settings from "./pages/dashboard/Settings.jsx";
import Users from "./pages/dashboard/Users.jsx";
import Invites from "./pages/dashboard/Invites.jsx";

import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========== PUBLIC WEBSITE ========== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* ========== AUTH PAGES ========== */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
        </Route>

        {/* ========== PROTECTED APP ========== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />

            <Route
              path="users"
              element={
                <RequireRole roles={["TenantOwner", "Admin"]}>
                  <Users />
                </RequireRole>
              }
            />

            <Route
              path="invites"
              element={
                <RequireRole roles={["TenantOwner", "Admin"]}>
                  <Invites />
                </RequireRole>
              }
            />

            <Route
              path="settings"
              element={
                <RequireRole roles={["TenantOwner"]}>
                  <Settings />
                </RequireRole>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
