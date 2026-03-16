import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";
import { productsAPI } from "../api";

function Dashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);

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

  const filtered =
    selected === "All"
      ? products
      : products.filter((p) => p.category === selected);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3>Available Products</h3>
      <Categories
        categories={categories}
        setCategories={setCategories}
        selected={selected}
        setSelected={setSelected}
      />
      <div className="products-grid">
        {filtered.length === 0 ? (
          <p>No approved products yet</p>
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
