import { useState } from "react";
import { productsAPI, swapAPI } from "../api";

function ProductCard({ product, products, setProducts, user, onEdit }) {
  const isOwner = product.ownerEmail === user.email;

  const [showSwap, setShowSwap] = useState(false);
  const [swapSent, setSwapSent] = useState(false);
  const [swapForm, setSwapForm] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    condition: "",
  });

  const remove = async () => {
    const res = await productsAPI.delete(product._id);
    if (res.message === "Product deleted successfully") {
      setProducts(products.filter((p) => p._id !== product._id));
    } else {
      alert("Failed to delete product");
    }
  };

  const buy = async () => {
    const res = await fetch(`http://localhost:5000/api/products/buy/${product._id}`, {
      method: "PUT",
    }).then((r) => r.json());

    if (res._id) {
      setProducts(products.map((p) =>
        p._id === product._id ? { ...p, isbuyer: true } : p
      ));
    } else {
      alert(res.message || "Failed to buy product");
    }
  };

  const sendSwap = async () => {
    if (!swapForm.name) {
      alert("Please enter your product name");
      return;
    }
    const res = await swapAPI.send({
      targetProductId: product._id,
      targetProductName: product.name,
      targetOwnerEmail: product.ownerEmail,
      requesterEmail: user.email,
      offeredProduct: swapForm,
    });

    if (res._id) {
      setSwapSent(true);
    } else {
      alert(res.message || "Failed to send swap request");
    }
  };

  const closeSwap = () => {
    setShowSwap(false);
    setSwapSent(false);
    setSwapForm({ name: "", description: "", image: "", price: "", condition: "" });
  };

  return (
    <> 
      <div className="product-card">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: 8,
              float: "left",
              marginRight: 10,
            }}
          />
        )}
        <h3>{product.name}</h3>
        <p>Description: {product.description}</p>
        <p>Price: {product.price}</p>
        <p>Category: {product.category}</p>
      <p>Status: {product.isbuyer ? "Sold" : product.status === "Swapped" ? "Swapped" : "Available"}</p>

        {isOwner ? (
          <div style={{ marginTop: 8, display: "flex", gap: 8, clear: "both" }}>
            {onEdit && product.status === "Pending" && (
              <button
                onClick={() => onEdit(product)}
                style={{ background: "#ffc107", color: "#000", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer" }}
              >
                Edit
              </button>
            )}
            <button
              onClick={remove}
              style={{ background: "#dc3545", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        ) : !product.isbuyer ? (
          <div style={{ display: "flex", gap: 8, marginTop: 8, clear: "both" }}>
            <button
              onClick={buy}
              style={{ flex: 1, background: "#28a745", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer" }}
            >
              Buy
            </button>
            <button
              onClick={() => setShowSwap(true)}
              style={{ flex: 1, background: "transparent", color: "#f0a500", border: "1.5px solid #f0a500", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 500 }}
            >
              ⇄ Swap
            </button>
          </div>
        ) : (
          <span style={{ color: "#dc3545", fontWeight: "bold", marginTop: 8, display: "block", clear: "both" }}>
            Sold Out
          </span>
        )}
      </div>

    
      {showSwap && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            {swapSent ? (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <h3 style={{ marginBottom: 6 }}>Swap request sent!</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
                  The seller will review your offer and respond soon.
                </p>
                <button onClick={closeSwap}>Done</button>
              </div>
            ) : (
              <>
                <h3>⇄ Swap Request</h3>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
                  You want: <strong style={{ color: "#fff" }}>{product.name}</strong> from {product.ownerEmail}
                </p>
                <input
                  placeholder="Your product name *"
                  value={swapForm.name}
                  onChange={(e) => setSwapForm({ ...swapForm, name: e.target.value })}
                />
                <textarea
                  placeholder="Description of your product"
                  value={swapForm.description}
                  onChange={(e) => setSwapForm({ ...swapForm, description: e.target.value })}
                  style={{ resize: "none", height: 60 }}
                />
                <input
                  placeholder="Image URL"
                  value={swapForm.image}
                  onChange={(e) => setSwapForm({ ...swapForm, image: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Estimated value ($)"
                  value={swapForm.price}
                  onChange={(e) => setSwapForm({ ...swapForm, price: e.target.value })}
                />
                <select
                  value={swapForm.condition}
                  onChange={(e) => setSwapForm({ ...swapForm, condition: e.target.value })}
                >
                  <option value="">Condition</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Used</option>
                </select>
                <button onClick={sendSwap}>Send Offer</button>
                <button onClick={closeSwap}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
