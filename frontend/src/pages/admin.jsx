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

  const pendingProducts = products.filter((p) => p.status === "Pending");
  const approvedProducts = products.filter((p) => p.status === "Approved");

  const styles = `
    .admin-wrapper {
      font-family: Poppins, sans-serif;
      background: #f4f7f6;
      min-height: 100vh;
      padding: 40px;
    }

    .admin-card {
      max-width: 1000px;
      margin: auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .admin-nav {
      display: flex;
      background: #081b29;
      padding: 10px;
      gap: 10px;
    }

    .nav-btn {
      flex: 1;
      padding: 12px;
      border: none;
      color: #fff;
      background: transparent;
      cursor: pointer;
      border-radius: 8px;
      font-weight: 600;
    }

    .nav-btn.active {
      background: #00abf0;
    }

    .admin-content {
      padding: 30px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th, td {
      padding: 15px;
      border-bottom: 1px solid #eee;
      text-align: left;
    }

    th {
      background: #f8f9fa;
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
    }

    .approve { background: #28a745; }
    .reject { background: #dc3545; }
    .delete { background: #6c757d; }

    .empty {
      margin-top: 20px;
      color: #777;
      font-style: italic;
    }
  `;
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
  return (
    <div className="admin-wrapper">
      <style>{styles}</style>

      <div className="admin-card">
        <div className="admin-nav">
         
          {user.canApprovedOrRefuseProducts && (
            <button
              className={`nav-btn ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Requests
            </button>
          )}

          {user.canApprovedOrRefuseProducts && (
            <button
              className={`nav-btn ${activeTab === "approved" ? "active" : ""}`}
              onClick={() => setActiveTab("approved")}
            >
              Approved Products
            </button>
          )}

          {user.canShowAllUsersDetails && (
            <button
              className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              All Users Details
            </button>
          )}

          {user.canGivePermisionToUser && (
            <button
              className={`nav-btn ${activeTab === "permissions" ? "active" : ""}`}
              onClick={() => setActiveTab("permissions")}
            >
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
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.ownerEmail}</td>
                        <td>
                          <span className="badge pending">Pending</span>
                        </td>
                        <td>
                          <button className="action-btn approve" onClick={() => onApprove(product._id)}>
                            Approve
                          </button>
                          <button className="action-btn reject" onClick={() => onReject(product._id)}>
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* Approved Products */}
          {activeTab === "approved" && user.canApprovedOrRefuseProducts && (
            <>
              <h2>Live Products</h2>
              {approvedProducts.length === 0 ? (
                <p className="empty">No approved products</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.ownerEmail}</td>
                        <td>
                          <span className="badge approved">Live</span>
                        </td>
                        <td>
                          <button className="action-btn delete" onClick={() => onDelete(product._id)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* Users */}
          {activeTab === "users" && user.canShowAllUsersDetails && (
            <>
              <h2>System Users</h2>
              {users.length === 0 ? (
                <p className="empty">No users found</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
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

          {/* Permissions */}
    
{activeTab === "permissions" && user.canGivePermisionToUser && (
  <>
    <h2>Manage User Permissions</h2>
    {users.length === 0 ? (
      <p className="empty">No users found</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Approve Products</th>
            <th>Show Users</th>
            <th>Give Permissions</th>
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
                >
                  {u.canApprovedOrRefuseProducts ? "dontGive" : "Give"}
                </button>
              </td>
              <td>
                <button
                  className={`action-btn ${u.canShowAllUsersDetails ? "reject" : "approve"}`}
                  onClick={() => togglePermission(u._id, "canShowAllUsersDetails", u.canShowAllUsersDetails)}
                >
                  {u.canShowAllUsersDetails ? "dontGive" : "give"}
                </button>
              </td>
              <td>
                <button
                  className={`action-btn ${u.canGivePermisionToUser ? "reject" : "approve"}`}
                  onClick={() => togglePermission(u._id, "canGivePermisionToUser", u.canGivePermisionToUser)}
                >
                  {u.canGivePermisionToUser ? "dontGive" : "give"}
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
