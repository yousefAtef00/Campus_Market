import { useState } from "react";
import { productsAPI } from "../api";
import imageCompression from "browser-image-compression";

const defaultCategories = [
  "Electronics",
  "Books",
  "Clothes",
  "bags",
  "Other",
];

const DEFAULT_IMAGE = "https://s3.ap-south-1.amazonaws.com/production.media.hafla.com/static_images/host/default-images/default-product.png";

function ProductModal({ setOpen, products, setProducts, user, editProduct }) {
  const [name, setName] = useState(editProduct?.name || "");
  const [description, setDescription] = useState(editProduct?.description || "");
  const [price, setPrice] = useState(editProduct?.price || "");
  const [category, setCategory] = useState(editProduct?.category || "");
  const [image, setImage] = useState(editProduct?.image || "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file) => {
    setUploading(true);

    try {
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "image0");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgiahpav3/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      if (data.secure_url) {
        setImage(data.secure_url);
      } else {
        throw new Error("No image returned");
      }

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed! Check your internet or try again.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!name || !price || !category) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);

    const finalImage = image || DEFAULT_IMAGE;

    if (editProduct) {
      const res = await productsAPI.update(editProduct._id, {
        name,
        description,
        price: Number(price),
        category,
        image: finalImage,
      });
      setLoading(false);
      if (res._id) {
        setProducts(products.map((p) => p._id === res._id ? res : p));
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setImage("");
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
        image: finalImage,
        status: "Pending",
        ownerEmail: user.email,
        isbuyer: false,
      };
      const res = await productsAPI.create(product);
      setLoading(false);
      if (res._id) {
        setProducts([...products, res]);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setImage("");
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          id="productImageUpload"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) uploadImage(file);
          }}
        />

        <button
          type="button"
          onClick={() => document.getElementById("productImageUpload").click()}
          style={{
            width: "100%",
            padding: "12px",
            background: "rgba(255,255,255,0.05)",
            border: "1.5px dashed rgba(0,171,240,0.4)",
            borderRadius: 8,
            color: uploading ? "#00abf0" : "rgba(255,255,255,0.7)",
            cursor: "pointer",
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          {uploading ? "⏳ uploading..." : "📷 upload image"}
        </button>

        <img
          src={image || DEFAULT_IMAGE}
          alt="preview"
          style={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            borderRadius: 8,
            marginTop: 8,
            marginBottom: 12,
            display: "block",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          <option value="" disabled hidden>Select category</option>
          {defaultCategories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <button onClick={save} disabled={loading || uploading}>
          {loading ? "Saving..." : editProduct ? "Update" : "Save"}
        </button>

        <button onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}

export default ProductModal;