import { useState, useEffect } from "react";
import ProductModal from "../components/ProductModal";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import { productsAPI } from "../api";

function Products({ user, refreshKey, addToCart })  {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data =
        user.role === "admin"
          ? await productsAPI.getAll()
          : await productsAPI.getByEmail(user.email);
      setProducts(data);
      const cats = [...new Set(data.map((p) => p.category))];
      setCategories(cats);
      setLoading(false);
    };
    fetchProducts();
  }, [user, refreshKey]);

  const filtered =
    selected === "All"
      ? products
      : products.filter((p) => p.category === selected);

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <Categories
        categories={categories}
        setCategories={setCategories}
        selected={selected}
        setSelected={setSelected}
      />
      {user.role !== "admin" && (
        <button className="btn" onClick={() => { setEditProduct(null); setOpen(true); }}>
          Add Product
        </button>
      )}
  
      <div className="products-grid">
 {filtered.map((p) => (
  <ProductCard
    key={p._id}
    product={p}
    products={products}
    setProducts={setProducts}
    user={user}
    onEdit={(product) => {
      setEditProduct(product);
      setOpen(true);
    }}
    addToCart={addToCart}
  />
))}
      </div>
      {open && (
        <ProductModal
          setOpen={() => { setOpen(false); setEditProduct(null); }}
          products={products}
          setProducts={setProducts}
          user={user}
          editProduct={editProduct}
        />
      )}
    </div>
  );
}

export default Products;