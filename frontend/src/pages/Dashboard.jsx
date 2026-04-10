import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";
import { productsAPI } from "../api";

function Dashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await productsAPI.getAll();
      const approved = data.filter((p) => p.status === "Approved");
      setProducts(approved);
      const cats = [...new Set(approved.map((p) => p.category))];
      setCategories(cats);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products
    .filter((p) => selected === "All" || p.category === selected)
    .filter((p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      String(p.price).includes(search)
    );

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3>Available Products</h3>

      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <input
          type="text"
          placeholder="Search by name, description, category or price..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            height: 42,
            background: "rgba(255,255,255,0.06)",
            border: "1.5px solid rgba(0,171,240,0.35)",
            borderRadius: 40,
            color: "#fff",
            fontSize: 13,
            padding: "0 42px 0 18px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(0,171,240,0.7)",
            fontSize: 15,
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
      </div>
      {search && (
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      <Categories
        categories={categories}
        setCategories={setCategories}
        selected={selected}
        setSelected={setSelected}
      />

      <div className="products-grid">
        {filtered.length === 0 ? (
          <p>No products match your search</p>
        ) : (
          filtered.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              products={products}
              setProducts={setProducts}
              user={user}
              onEdit={null}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
