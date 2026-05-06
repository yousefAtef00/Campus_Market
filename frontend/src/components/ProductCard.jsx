import { useState } from "react";
import { productsAPI, swapAPI } from "../api";

function ProductCard({
  product,
  products,
  setProducts,
  user,
  onEdit,
  addToCart,
  removeFromCart,
  cartItems,
}) {
  const isOwner = product.ownerEmail === user.email;
  const isInCart = cartItems?.some((item) => item._id === product._id);

  const [showSwap, setShowSwap] = useState(false);
  const [swapSent, setSwapSent] = useState(false);
const DEFAULT_IMAGE = "https://s3.ap-south-1.amazonaws.com/production.media.hafla.com/static_images/host/default-images/default-product.png";
  const [uploadingSwap, setUploadingSwap] = useState(false);

  const [swapForm, setSwapForm] = useState({
    name: "", description: "", image: "", price: "", condition: "",
  });

  const remove = async () => {
    const res = await productsAPI.delete(product._id);
    if (res.message === "Product deleted successfully") {
      setProducts(products.filter((p) => p._id !== product._id));
    } else {
      alert("Failed to delete product");
    }
  };

  const sendSwap = async () => {
    if (!swapForm.name) { alert("Please enter your product name"); return; }
    const res = await swapAPI.send({
      targetProductId: product._id,
      targetProductName: product.name,
      targetOwnerEmail: product.ownerEmail,
      requesterEmail: user.email,
      offeredProduct: swapForm,
    });
    if (res._id) setSwapSent(true);
    else alert(res.message || "Failed to send swap request");
  };

  const closeSwap = () => {
    setShowSwap(false);
    setSwapSent(false);
    setSwapForm({ name: "", description: "", image: "", price: "", condition: "" });
  };

  const isSold = product.isbuyer || product.status === "Swapped";

  return (
    <>
      <div className="product-card" style={{ position: "relative", overflow: "hidden" }}>
        
        {isSold && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.55)", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2,
          }}>
            <span style={{
              background: "#dc3545", color: "#fff", fontWeight: "bold",
              fontSize: 18, padding: "8px 24px", borderRadius: 8,
              transform: "rotate(-15deg)", letterSpacing: 2,
            }}>
              {product.status === "Swapped" ? "SWAPPED" : "SOLD"}
            </span>
          </div>
        )}

       <img
  src={product.image || DEFAULT_IMAGE}
  onError={(e) => (e.target.src = DEFAULT_IMAGE)}
  alt={product.name}
  style={{
  
   width: "100%",
    height: "auto",
    objectFit: "unset",
    borderRadius: 8,
    marginBottom: 12,

  }}
/>

        <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>{product.name}</h3>
        <p style={{ margin: "0 0 6px", fontSize: 16, color: "rgba(255,255,255,0.6)" }}>
          {product.description}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0" }}>
          <span style={{ color: "#00abf0", fontWeight: "bold", fontSize: 15 }}>
            ${product.price}
          </span>
          <span style={{
            fontSize: 11, padding: "2px 10px", borderRadius: 20,
            background: "rgba(0,171,240,0.15)", color: "#00abf0",
          }}>
            {product.category}
          </span>
        </div>

        {isOwner ? (
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {onEdit && product.status === "Pending" && (
              <button onClick={() => onEdit(product)} style={{
                flex: 1, background: "#ffc107", color: "#000",
                border: "none", padding: "8px 0", borderRadius: 6, cursor: "pointer", fontWeight: 600,
              }}>
                ✏️ Edit
              </button>
            )}
            <button onClick={remove} style={{
              flex: 1, background: "rgba(220,53,69,0.15)", color: "#dc3545",
              border: "1.5px solid #dc3545", padding: "8px 0",
              borderRadius: 6, cursor: "pointer", fontWeight: 600,
            }}>
              🗑 Delete
            </button>
          </div>

        ) : !isSold ? (
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>

            {isInCart ? (
              <button onClick={() => removeFromCart(product._id)} style={{
                flex: 1, background: "rgba(220,53,69,0.15)", color: "#dc3545",
                border: "1.5px solid #dc3545", padding: "8px 0",
                borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13,
              }}>
                ✕ Remove
              </button>
            ) : (
              <button onClick={() => addToCart(product)} style={{
                flex: 1, background: "rgba(0,171,240,0.15)", color: "#00abf0",
                border: "1.5px solid #00abf0", padding: "8px 0",
                borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13,
              }}>
                🛒 Add to Cart
              </button>
            )}

            <button
              onClick={() => setShowSwap(true)}
              style={{
                flex: 1, background: "transparent", color: "#f0a500",
                border: "1.5px solid #f0a500", padding: "8px 0",
                borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13,
              }}
            >
              ⇄ Swap
            </button>
          </div>
        ) : null}
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

                <input placeholder="Your product name *" value={swapForm.name}
                  onChange={(e) => setSwapForm({ ...swapForm, name: e.target.value })} />

                <textarea placeholder="Description" value={swapForm.description}
                  onChange={(e) => setSwapForm({ ...swapForm, description: e.target.value })} />

                <input
                  type="file"
                  accept="image/*"
                  id="imageUpload"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setUploadingSwap(true);

                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("upload_preset", "image0");

                      const res = await fetch(
                        "https://api.cloudinary.com/v1_1/dgiahpav3/image/upload",
                        { method: "POST", body: formData }
                      );

                      if (!res.ok) throw new Error();

                      const data = await res.json();

                      if (data.secure_url) {
                        setSwapForm(prev => ({
                          ...prev,
                          image: data.secure_url
                        }));
                      }

                    } catch {
                      alert("Upload failed");
                    } finally {
                      setUploadingSwap(false);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => document.getElementById("imageUpload").click()}
                >
                  {uploadingSwap ? "⏳ uploading..." : "📷 upload image"}
                </button>

                <img
                  src={swapForm.image || "https://via.placeholder.com/150?text=No+Image"}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />

                <input type="number" placeholder="Price" value={swapForm.price}
                  onChange={(e) => setSwapForm({ ...swapForm, price: e.target.value })} />

                <select value={swapForm.condition}
                  onChange={(e) => setSwapForm({ ...swapForm, condition: e.target.value })}>
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