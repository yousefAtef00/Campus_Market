import { useState, useEffect } from "react";
import AuthForm from "./pages/AuthForm";
import Sidebar from "./components/Sidebar";
import Products from "./pages/Products";
import "./styles/style.css";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin";
import Dashboard from "./pages/Dashboard";
import { hasPermission } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    if (!user?.id) return;
    
    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:5000/api/auth/users`)
        .then((r) => r.json());
      const updatedUser = res.find((u) => u._id === user.id);
      if (updatedUser) {
        if (JSON.stringify(updatedUser.permissions) !== JSON.stringify(user.permissions)) {
          setUser((prev) => ({ ...prev, permissions: updatedUser.permissions }));
        }
      }
    }, 5000);//5 seconds to restart permision

    return () => clearInterval(interval);
  }, [user?.id]);

  if (!user) {
    return <AuthForm onLogin={(u) => setUser(u)} />;
  }

  const isAdmin =
    hasPermission(user, "canGivePermissionToUser") ||
    hasPermission(user, "canApproveOrRejectProducts") ||
    hasPermission(user, "canShowAllUsersDetails") ||
    hasPermission(user, "canDeleteApprovedProduct");

  return (
    <div>
      <Sidebar setPage={setPage} user={user} onLogout={() => setUser(null)} currentPage={page} />
      <div className="page-card">
        <div className="content">
          {page === "dashboard" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2>Welcome, {user.name}!</h2>
                {isAdmin && (
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
    </div>
  );
}

export default App;