import { useState, useEffect } from "react";
import { swapAPI } from "../api";

function Orders({ user, onSwapAccepted }) {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [tab, setTab] = useState("received");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSwaps = async () => {
      setLoading(true);
      const [rec, sen] = await Promise.all([
        swapAPI.getReceived(user.email),
        swapAPI.getSent(user.email),
      ]);
      setReceived(Array.isArray(rec) ? rec : []);
      setSent(Array.isArray(sen) ? sen : []);
      setLoading(false);
    };
    fetchSwaps();
  }, [user]);

  const handleStatus = async (id, status) => {
    const res = await swapAPI.updateStatus(id, status);
    if (res._id) {
      setReceived(received.map((s) => {
        if (s._id === id) return { ...s, status };
        if (status === "Accepted" && s.targetProductName === res.targetProductName && s.status === "Pending") {
          return { ...s, status: "Rejected" };
        }
        return s;
      }));

    
      if (status === "Accepted" && onSwapAccepted) {
        onSwapAccepted();
      }
    }
  };

  const handleDelete = async (id) => {
    const res = await swapAPI.delete(id);
    if (res.message) {
      setSent(sent.filter((s) => s._id !== id));
    }
  };

  if (loading) return <p>Loading...</p>;

  const statusColor = (s) =>
    s === "Accepted" ? "#28a745" : s === "Rejected" ? "#dc3545" : "#ffc107";

  return (
    <div>
      <h2>Swap Requests</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["received", "sent"].map((t) => (
          <button
            key={t}
            className="btn"
            style={{
              width: "auto",
              padding: "8px 20px",
              background: tab === t ? "#00abf0" : "rgba(255,255,255,0.1)",
              color: "#fff",
            }}
            onClick={() => setTab(t)}
          >
            {t === "received" ? `Received (${received.length})` : `Sent (${sent.length})`}
          </button>
        ))}
      </div>

      {tab === "received" && (
        <div>
          {received.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.5)" }}>No swap requests received</p>
          ) : (
            received.map((s) => (
              <div key={s._id} className="product-card" style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "#00abf0", fontWeight: 600, marginBottom: 4 }}>
                      Swap request for: {s.targetProductName}
                    </p>
                    <p style={{ fontSize: 13, opacity: 0.7 }}>From: {s.requesterEmail}</p>
                    <p style={{ marginTop: 8 }}>
                      Offering: <strong>{s.offeredProduct?.name}</strong>
                    </p>
                    {s.offeredProduct?.description && (
                      <p style={{ fontSize: 13, opacity: 0.8 }}>{s.offeredProduct.description}</p>
                    )}
                    {s.offeredProduct?.price && (
                      <p style={{ fontSize: 13 }}>Price: {s.offeredProduct.price}</p>
                    )}
                    {s.offeredProduct?.condition && (
                      <p style={{ fontSize: 13 }}>Condition: {s.offeredProduct.condition}</p>
                    )}
                    {s.offeredProduct?.image && (
                      <img
                        src={s.offeredProduct.image}
                        alt="offered"
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, marginTop: 8 }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      background: statusColor(s.status),
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {s.status}
                  </span>
                </div>

                {s.status === "Pending" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => handleStatus(s._id, "Accepted")}
                      style={{ background: "#28a745", color: "#fff", border: "none", padding: "7px 16px", borderRadius: 6, cursor: "pointer" }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatus(s._id, "Rejected")}
                      style={{ background: "#dc3545", color: "#fff", border: "none", padding: "7px 16px", borderRadius: 6, cursor: "pointer" }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "sent" && (
        <div>
          {sent.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.5)" }}>No swap requests sent</p>
          ) : (
            sent.map((s) => (
              <div key={s._id} className="product-card" style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "#00abf0", fontWeight: 600, marginBottom: 4 }}>
                      Swap request for: {s.targetProductName}
                    </p>
                    <p style={{ fontSize: 13, opacity: 0.7 }}>To: {s.targetOwnerEmail}</p>
                    <p style={{ marginTop: 8 }}>
                      You offered: <strong>{s.offeredProduct?.name}</strong>
                    </p>
                  </div>
                  <span
                    style={{
                      background: statusColor(s.status),
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {s.status}
                  </span>
                </div>

                {s.status === "Pending" && (
                  <button
                    onClick={() => handleDelete(s._id)}
                    style={{ background: "#dc3545", color: "#fff", border: "none", padding: "7px 16px", borderRadius: 6, cursor: "pointer", marginTop: 10 }}
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Orders;