import { useState } from "react";
import AuthForm from "./pages/AuthForm";
import Sidebar from "./components/Sidebar";
import Products from "./pages/Products";
import "./styles/style.css";

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
        {page === "dashboard" && <h2>Dashboard - Welcome, {user.name}!</h2>}
        {page === "products" && <Products user={user} setPage={setPage} />}
        {page === "orders" && <h2>Orders</h2>}
        {page === "messages" && <h2>Messages</h2>}
        {page === "settings" && <h2>Settings</h2>}
      </div>
    </div>
  );
}

export default App;