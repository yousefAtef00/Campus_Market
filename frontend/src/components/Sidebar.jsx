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
    height: 55px;

    display: flex;
    justify-content: center;
    align-items: center;

    margin-bottom: 10px;
    background: transparent;
    border: 1px solid #00abf0;
    color: #fff;
    cursor: pointer;
    border-radius: 40px;
    transition: 0.3s;
    font-size: 15px;

    box-sizing: border-box;
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



  @media (max-width: 768px) {
    .sidebar {
      width: 70px;
      padding: 10px;
    }

    .sidebar .logo h1 {
      font-size: 14px;
      margin-bottom: 20px;
    }

    .sidebar ul li {
      height: 45px;
      font-size: 12px;
      border-radius: 20px;
    }

    .content {
      margin-left: 70px;
      padding: 15px;
    }

    .user-info p {
      font-size: 11px;
    }

    .user-info span {
      font-size: 10px;
    }

    .logout-btn {
      padding: 10px;
      font-size: 12px;
    }
  }

  /* very small phones */
  @media (max-width: 420px) {
    .sidebar {
      width: 60px;
    }

    .content {
      margin-left: 60px;
    }

    .sidebar ul li {
      font-size: 11px;
      height: 40px;
    }
  }
`;

function Sidebar({ setPage, user, onLogout, currentPage }) {
  return (
    <div className="sidebar">
      <style>{sidebarStyles}</style>

      {/* Logo */}
      <div className="logo">
        <h1 style={{ fontSize: '1.5rem' }}>SWAPSTER</h1>
      </div>

      <ul>
        <h1 style={{ marginBottom: '20px', fontSize: '1.5rem' }}></h1>

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
          className={currentPage === "Reviews" ? "active-page" : ""}
          onClick={() => setPage("Reviews")}
        >
          Reviews
        </li>

        <li
          className={currentPage === "settings" ? "active-page" : ""}
          onClick={() => setPage("settings")}
        >
          Settings
        </li>

        {(
          user?.permissions?.includes("canGivePermissionToUser") ||
          user?.permissions?.includes("canApproveOrRejectProducts") ||
          user?.permissions?.includes("canShowAllUsersDetails") ||
          user?.permissions?.includes("canDeleteApprovedProduct")
        ) && (
          <li
            className={currentPage === "admin" ? "active-page" : ""}
            onClick={() => setPage("admin")}
          >
            Admin Panel
          </li>
        )}
      </ul>

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