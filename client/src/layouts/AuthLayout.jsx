import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={wrap}>
      <div style={card}>
        <Outlet />
      </div>
    </div>
  );
}

const wrap = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "var(--bg)",
  padding: 20,
};

const card = {
  width: 420,
  maxWidth: "90vw",
  border: "1px solid var(--border)",
  borderRadius: 18,
  background: "white",
  padding: 18,
  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
};
