import { useState } from "react";
import { productsAPI } from "../api";

const defaultCategories = [
  "Electronics",
  "Books",
  "Clothes",
  "bags",
  "Other",
];

function ProductModal({ setOpen, products, setProducts, user, editProduct }) {
 
  const [name, setName] = useState(editProduct?.name || "");
  const [description, setDescription] = useState(editProduct?.description || "");
  const [price, setPrice] = useState(editProduct?.price || "");
  const [category, setCategory] = useState(editProduct?.category || "");
  const [image, setImage] = useState(editProduct?.image || "");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!name || !price || !category || !image) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);

    if (editProduct) {
  
      const res = await productsAPI.update(editProduct._id, {
        name,
        description,
        price: Number(price),
        category,
        image,
      });
      setLoading(false);
      if (res._id) {
        setProducts(products.map((p) => p._id === res._id ? res : p));
        setOpen(false);
      } else {
        alert("Failed to update product");
      }
    } else {
     
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
    }
  };

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modal-content">

        <h3>{editProduct ? "Edit Product" : "Add Product"}</h3>
        <input
          placeholder="Name"
          defaultValue={editProduct?.name || ""}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          defaultValue={editProduct?.description || ""}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Image URL"
          defaultValue={editProduct?.image || ""}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          defaultValue={editProduct?.price || ""}
          onChange={(e) => setPrice(e.target.value)}
        />
        <select
          onChange={(e) => setCategory(e.target.value)}
          defaultValue={editProduct?.category || ""}
        >
          <option value="" disabled hidden>Select category</option>
          {defaultCategories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
        <button onClick={save} disabled={loading}>
          {loading ? "Saving..." : editProduct ? "Update" : "Save"}
        </button>
        <button onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}

export default ProductModal;
