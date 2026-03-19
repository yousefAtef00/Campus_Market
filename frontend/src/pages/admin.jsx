import React, { useState, useEffect } from "react";
import { productsAPI } from "../api";

const AdminDashboard = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchData = async () => {
      const prods = await productsAPI.getAll();
      setProducts(prods);
      const res = await fetch("http://localhost:5000/api/auth/users");
      const usersData = await res.json();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  const onApprove = async (id) => {
    await fetch(`http://localhost:5000/api/products/status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    });
    setProducts(products.map((p) => p._id === id ? { ...p, status: "Approved" } : p));
  };

  const onReject = async (id) => {
    await fetch(`http://localhost:5000/api/products/status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected" }),
    });
    setProducts(products.map((p) => p._id === id ? { ...p, status: "Rejected" } : p));
  };

  const onDelete = async (id) => {
    await productsAPI.delete(id);
    setProducts(products.filter((p) => p._id !== id));
  };

  const togglePermission = async (userId, permission, currentValue) => {
    if (userId === user.id) {
      alert("You cannot change your own permissions!");
      return;
    }
    const res = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [permission]: !currentValue }),
    }).then((r) => r.json());

    if (res._id) {
      setUsers(users.map((u) =>
        u._id === userId ? { ...u, [permission]: !currentValue } : u
      ));
    } else {
      alert("Failed to update permission");
    }
  };

  const pendingProducts = products.filter((p) => p.status === "Pending");
  const approvedProducts = products.filter((p) => p.status === "Approved");

  const styles = `
    .admin-wrapper {
      background: transparent;
      padding: 0;
    }

    .admin-card {
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid #00abf0;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(0, 171, 240, 0.2);
      overflow: hidden;
    }

    .admin-nav {
      display: flex;
      background: rgba(0, 0, 0, 0.3);
      padding: 10px;
      gap: 10px;
      border-bottom: 1px solid rgba(0, 171, 240, 0.3);
    }

    .admin-nav-btn {
      flex: 1;
      padding: 12px;
      border: 1px solid #00abf0;
      color: #fff;
      background: transparent;
      cursor: pointer;
      border-radius: 40px;
      font-weight: 600;
      transition: 0.3s;
    }

    .admin-nav-btn:hover {
      background: #00abf0;
      box-shadow: 0 0 15px #00abf0;
    }

    .admin-nav-btn.active {
      background: #00abf0;
      box-shadow: 0 0 15px #00abf0;
    }

    .admin-content {
      padding: 30px;
    }

    .admin-content h2 {
      color: #00abf0;
      margin-bottom: 20px;
      text-shadow: 0 0 5px #00abf0;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .admin-table th, .admin-table td {
      padding: 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      text-align: left;
      color: #fff;
    }

    .admin-table th {
      color: #00abf0;
      background: rgba(0, 0, 0, 0.2);
    }

    .admin-table tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .badge {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }

    .badge.pending { background: #fff3cd; color: #856404; }
    .badge.approved { background: #d4edda; color: #155724; }

    .action-btn {
      padding: 7px 14px;
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      margin-right: 5px;
      font-size: 13px;
      transition: 0.3s;
    }

    .action-btn:hover { opacity: 0.8; }
    .approve { background: #28a745; }
    .reject { background: #dc3545; }
    .delete { background: #6c757d; }

    .empty {
      margin-top: 20px;
      color: rgba(255, 255, 255, 0.5);
      font-style: italic;
    }
  `;

  return (
    <div className="admin-wrapper">
      <style>{styles}</style>

      <div className="admin-card">
        <div className="admin-nav">
          {user.canApprovedOrRefuseProducts && (
            <button className={`admin-nav-btn ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>
              Pending Requests
            </button>
          )}
          {user.canApprovedOrRefuseProducts && (
            <button className={`admin-nav-btn ${activeTab === "approved" ? "active" : ""}`} onClick={() => setActiveTab("approved")}>
              Approved Products
            </button>
          )}
          {user.canShowAllUsersDetails && (
            <button className={`admin-nav-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
              All Users Details
            </button>
          )}
          {user.canGivePermisionToUser && (
            <button className={`admin-nav-btn ${activeTab === "permissions" ? "active" : ""}`} onClick={() => setActiveTab("permissions")}>
              Give Permissions
            </button>
          )}
        </div>

        <div className="admin-content">

          {activeTab === "pending" && user.canApprovedOrRefuseProducts && (
            <>
              <h2>Products Awaiting Approval</h2>
              {pendingProducts.length === 0 ? (
                <p className="empty">No pending products</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th><th>Price</th><th>Owner</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.ownerEmail}</td>
                        <td><span className="badge pending">Pending</span></td>
                        <td>
                          <button className="action-btn approve" onClick={() => onApprove(product._id)}>Approve</button>
                          <button className="action-btn reject" onClick={() => onReject(product._id)}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeTab === "approved" && user.canApprovedOrRefuseProducts && (
            <>
              <h2>Live Products</h2>
              {approvedProducts.length === 0 ? (
                <p className="empty">No approved products</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th><th>Price</th><th>Owner</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.ownerEmail}</td>
                        <td><span className="badge approved">Live</span></td>
                        <td>
                          <button className="action-btn delete" onClick={() => onDelete(product._id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeTab === "users" && user.canShowAllUsersDetails && (
            <>
              <h2>System Users</h2>
              {users.length === 0 ? (
                <p className="empty">No users found</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr><th>Username</th><th>Email</th><th>Role</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeTab === "permissions" && user.canGivePermisionToUser && (
            <>
              <h2>Manage User Permissions</h2>
              {users.length === 0 ? (
                <p className="empty">No users found</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Username</th><th>Email</th><th>Approve Products</th><th>Show Users</th><th>Give Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <button
                            className={`action-btn ${u.canApprovedOrRefuseProducts ? "reject" : "approve"}`}
                            onClick={() => togglePermission(u._id, "canApprovedOrRefuseProducts", u.canApprovedOrRefuseProducts)}
                            disabled={u._id === user.id}
                            style={{ opacity: u._id === user.id ? 0.4 : 1 }}
                          >
                            {u.canApprovedOrRefuseProducts ? "Revoke" : "Give"}
                          </button>
                        </td>
                        <td>
                          <button
                            className={`action-btn ${u.canShowAllUsersDetails ? "reject" : "approve"}`}
                            onClick={() => togglePermission(u._id, "canShowAllUsersDetails", u.canShowAllUsersDetails)}
                            disabled={u._id === user.id}
                            style={{ opacity: u._id === user.id ? 0.4 : 1 }}
                          >
                            {u.canShowAllUsersDetails ? "Revoke" : "Give"}
                          </button>
                        </td>
                        <td>
                          <button
                            className={`action-btn ${u.canGivePermisionToUser ? "reject" : "approve"}`}
                            onClick={() => togglePermission(u._id, "canGivePermisionToUser", u.canGivePermisionToUser)}
                            disabled={u._id === user.id}
                            style={{ opacity: u._id === user.id ? 0.4 : 1 }}
                          >
                            {u.canGivePermisionToUser ? "Revoke" : "Give"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
