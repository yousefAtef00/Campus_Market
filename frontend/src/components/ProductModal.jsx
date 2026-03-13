import { useState } from "react";
import { productsAPI } from "../api";

const defaultCategories = [
  "Electronics",
  "Books",
  "Clothes",
  "bags",
  "Other",
];

function ProductModal({ setOpen, products, setProducts, user }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!name || !price || !category || !image) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    const product = {
      name,
      description,
      price: Number(price),
      category,
      image,
      status: "Pending",
      ownerEmail: user.email,
      isbuyer: false,
    };
    const res = await productsAPI.create(product);
    setLoading(false);
    if (res._id) {
      setProducts([...products, res]);
      setOpen(false);
    } else {
      alert("Failed to create product");
    }
  };

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <h3>Add Product</h3>
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <input placeholder="Image URL" onChange={(e) => setImage(e.target.value)} />
        <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
        <select onChange={(e) => setCategory(e.target.value)} defaultValue="">
          <option value="" disabled hidden>Select category</option>
          {defaultCategories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
        <button onClick={save} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}

export default ProductModal;
