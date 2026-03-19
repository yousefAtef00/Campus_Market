import { useState } from "react";

const sidebarStyles = `
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 250px;
    background: #081b29;
    border-right: 2px solid #00abf0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    transition: 0.3s ease;
    z-index: 100;
  }

  .sidebar .logo h1 {
    color: #00abf0;
    font-size: 22px;
    text-align: center;
    margin-bottom: 30px;
    text-shadow: 0 0 10px #00abf0;
    letter-spacing: 2px;
  }

  .sidebar ul {
    list-style: none;
    flex: 1;
  }

  .sidebar ul li {
    width: 100%;
    padding: 13px 20px;
    margin-bottom: 10px;
    background: transparent;
    border: 1px solid #00abf0;
    color: #fff;
    cursor: pointer;
    border-radius: 40px;
    transition: 0.3s;
    font-size: 15px;
    text-align: center;
  }

  .sidebar ul li:hover {
    background: #00abf0;
    box-shadow: 0 0 15px #00abf0;
  }

  .sidebar ul li.active-page {
    background: #00abf0;
    box-shadow: 0 0 15px #00abf0;
  }

  .logout-btn {
    width: 100%;
    padding: 13px 20px;
    background: transparent;
    border: 1px solid #e74c3c;
    color: #e74c3c;
    cursor: pointer;
    border-radius: 40px;
    transition: 0.3s;
    font-size: 15px;
    margin-top: 10px;
  }

  .logout-btn:hover {
    background: #e74c3c;
    color: #fff;
    box-shadow: 0 0 15px #e74c3c;
  }

  .content {
    margin-left: 250px;
    padding: 30px;
    transition: 0.3s ease;
  }

  .user-info {
    padding: 10px 0;
    border-top: 1px solid rgba(0, 171, 240, 0.3);
    margin-bottom: 10px;
  }

  .user-info p {
    color: #fff;
    font-size: 13px;
    text-align: center;
  }

  .user-info span {
    color: #00abf0;
    font-size: 11px;
    display: block;
    text-align: center;
    opacity: 0.8;
  }
`;

function Sidebar({ setPage, user, onLogout, currentPage }) {
  return (
    <div className="sidebar">
      <style>{sidebarStyles}</style>

      {/* Logo */}
      <div className="logo">
        <h1>SWAPSTER</h1>
      </div>

      {/* Nav Links */}
      <ul>
        <li
          className={currentPage === "dashboard" ? "active-page" : ""}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </li>
        <li
          className={currentPage === "products" ? "active-page" : ""}
          onClick={() => setPage("products")}
        >
          Products
        </li>
        <li
          className={currentPage === "orders" ? "active-page" : ""}
          onClick={() => setPage("orders")}
        >
          Orders
        </li>
        <li
          className={currentPage === "messages" ? "active-page" : ""}
          onClick={() => setPage("messages")}
        >
          Messages
        </li>
        <li
          className={currentPage === "settings" ? "active-page" : ""}
          onClick={() => setPage("settings")}
        >
          Settings
        </li>
      </ul>

      {/* User Info + Logout */}
      <div className="user-info">
        <p>{user?.name}</p>
        <span>{user?.role}</span>
      </div>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
