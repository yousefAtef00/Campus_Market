import { productsAPI } from "../api";

function ProductCard({ product, products, setProducts, user, onEdit }) {
  const isOwner = product.ownerEmail === user.email;

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

  return (
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
      <p>Status: {product.isbuyer ? "Sold" : "Available"}</p>

      {isOwner ? (
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
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
        <button
          onClick={buy}
          style={{ background: "#28a745", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer", marginTop: 8 }}
        >
          Buy
        </button>
      ) : (
        <span style={{ color: "#dc3545", fontWeight: "bold", marginTop: 8, display: "block" }}>
          Sold Out
        </span>
      )}
    </div>
  );
}

export default ProductCard;
