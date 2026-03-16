import { useState } from "react";
import AuthForm from "./pages/AuthForm";
import Sidebar from "./components/Sidebar";
import Products from "./pages/Products";
import "./styles/style.css";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin";
import Dashboard from "./pages/Dashboard";
function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  if (!user) {
    return <AuthForm onLogin={(u) => setUser(u)} />;
  }

  return (
    <div>
      <Sidebar setPage={setPage} user={user} onLogout={() => setUser(null)} />
      <div className="content">
     {page === "dashboard" && (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h2>Dashboard - Welcome, {user.name}!</h2>
      {(user.canGivePermisionToUser || user.canApprovedOrRefuseProducts || user.canShowAllUsersDetails) && (
        <button className="btn" style={{ width: "auto", padding: "0 20px" }} onClick={() => setPage("admin")}>
          Admin Panel
        </button>
      )}
    </div>
    <Dashboard user={user} />
  </div>
)}
        {page === "products" && <Products user={user} setPage={setPage} />}
        {page === "orders" && <h2>Orders</h2>}
        {page === "messages" && <h2>Messages</h2>}
        {page === "settings" && <Settings user={user} setPage={setPage} />}
     {page === "admin" && <AdminDashboard user={user} />}
      </div>
    </div>
  );
}

export default App;
