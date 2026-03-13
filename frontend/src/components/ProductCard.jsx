import { productsAPI } from "../api";

function ProductCard({ product, products, setProducts }) {
  const remove = async () => {
    const res = await productsAPI.delete(product._id); 
    if (res.message === "Product deleted successfully") {
      setProducts(products.filter((p) => p._id !== product._id));
    } else {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="product-card">
      {product.image && (
        <img src={product.image} alt={product.name} 
     style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: 8, float: "left", marginRight: 10 }} ></img>
      )}
      <h3>{product.name}</h3>
      <p>description: {product.description}</p>
      <p>Price: {product.price}</p>
      <p>Category: {product.category}</p>
      <p>Status: {product.status}</p>
      <button onClick={remove}>Delete</button>
    </div>
  );
}

export default ProductCard;