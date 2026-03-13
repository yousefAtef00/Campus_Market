import { useState } from "react";

function Sidebar({ setPage, user, onLogout }) {
  const [active, setActive] = useState(false);

  return (
    <div className={active ? "sidebar active" : "sidebar"}>
      <div className="logo-content">
        <div className="logo"><h1>SWAPSTER</h1></div>
        <button id="btn" onClick={() => setActive(!active)}>☰</button>
      </div>
      <ul>
        <li onClick={() => setPage("dashboard")}>Dashboard</li>
        <li onClick={() => setPage("products")}>Products</li>
        <li onClick={() => setPage("orders")}>Orders</li>
        <li onClick={() => setPage("messages")}>Messages</li>
        <li onClick={() => setPage("settings")}>Settings</li>
      </ul>
      <div style={{ padding: "20px", color: "#fff", marginTop: "auto" }}>
        <button onClick={onLogout} style={{ marginTop: 10, cursor: "pointer" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;