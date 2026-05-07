import { useState, useEffect } from "react";
import AuthForm from "./pages/AuthForm";
import Sidebar from "./components/Sidebar";
import Products from "./pages/Products";
import Header from "./components/Header";
import "./styles/style.css";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import AIButton from "./components/AIButton";
import { hasPermission, productsAPI } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const buyAll = async () => {
    if (cartItems.length === 0) return;
    try {
      await Promise.all(cartItems.map((item) => productsAPI.buy(item._id)));
      setCartItems([]);
      alert("Purchase successful!");
      setPage("dashboard");
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  };

  const openCart = () => setPage("cart");

  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:5000/api/auth/users`)
        .then((r) => r.json());

      const updatedUser = res.find((u) => u._id === user.id);

      if (updatedUser) {
        if (
          JSON.stringify(updatedUser.permissions) !==
          JSON.stringify(user.permissions)
        ) {
          setUser((prev) => ({
            ...prev,
            permissions: updatedUser.permissions,
          }));
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user?.id, user?.permissions]);

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
      <Header
        user={user}
        cartItems={cartItems}
        openCart={openCart}
        setPage={setPage}
      />

      <Sidebar
        setPage={setPage}
        user={user}
        onLogout={() => setUser(null)}
        currentPage={page}
      />

      <div className="page-card">
        <div className="content">

          {page === "dashboard" && (
            <Dashboard
              user={user}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cartItems={cartItems}
            />
          )}

          {page === "products" && (
            <Products
              refreshKey={refreshKey}
              user={user}
              setPage={setPage}
              addToCart={addToCart}
            />
          )}

          {page === "orders" && (
            <Orders
              user={user}
              onSwapAccepted={() => setRefreshKey((k) => k + 1)}
            />
          )}

          {page === "Reviews" && <Reviews />}
          {page === "settings" && <Settings user={user} setPage={setPage} />}
          {page === "admin" && <AdminDashboard user={user} />}

          {page === "cart" && (
            <div style={{ maxWidth: 700, margin: "0 auto", padding: "10px 0" }}>
              <h2 style={{ marginBottom: 20, fontSize: 22 }}>🛒 Shopping Cart</h2>

              {cartItems.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "60px 20px",
                  border: "1.5px dashed rgba(0,171,240,0.3)", borderRadius: 12,
                  color: "rgba(255,255,255,0.4)",
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <p style={{ fontSize: 16 }}>Your cart is empty</p>
                  <button
                    onClick={() => setPage("dashboard")}
                    style={{
                      marginTop: 16, padding: "10px 24px",
                      background: "rgba(0,171,240,0.15)", color: "#00abf0",
                      border: "1.5px solid #00abf0", borderRadius: 8,
                      cursor: "pointer", fontWeight: 600,
                    }}
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div key={item._id} style={{
                      marginBottom: 12, padding: "14px 18px",
                      border: "1.5px solid rgba(0,171,240,0.25)",
                      borderRadius: 10, display: "flex",
                      alignItems: "center", gap: 16,
                      background: "rgba(255,255,255,0.03)",
                    }}>
                      <img
                        src={item.image || "https://via.placeholder.com/60"}
                        alt={item.name}
                        style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 4px", fontSize: 15 }}>{item.name}</h3>
                        <span style={{ color: "#00abf0", fontWeight: "bold" }}>${item.price}</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{
                          background: "rgba(220,53,69,0.12)", color: "#dc3545",
                          border: "1.5px solid #dc3545", padding: "6px 14px",
                          borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13,
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}

                  <div style={{
                    marginTop: 20, padding: "16px 20px",
                    border: "1.5px solid rgba(0,171,240,0.3)",
                    borderRadius: 10, background: "rgba(0,171,240,0.05)",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                        {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: "bold", color: "#00abf0" }}>
                        Total: ${cartItems.reduce((sum, i) => sum + Number(i.price), 0).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={buyAll}
                      style={{
                        padding: "12px 32px", background: "#00abf0",
                        color: "#000", border: "none", borderRadius: 8,
                        cursor: "pointer", fontWeight: "bold", fontSize: 15,
                      }}
                    >
                      ✅ Buy All
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>

     <AIButton setPage={setPage} />
    </div>
  );
}

export default App;