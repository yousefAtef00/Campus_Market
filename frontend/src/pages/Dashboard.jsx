import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { productsAPI } from "../api";

function Dashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await productsAPI.getAll();
      // ✅ Approved بس
      setProducts(data.filter((p) => p.status === "Approved"));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3>Available Products</h3>
      <div className="products-grid">
        {products.length === 0 ? (
          <p>No approved products yet</p>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              products={products}
              setProducts={setProducts}
              user={user}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;