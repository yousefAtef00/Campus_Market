const express = require("express");
const router = express.Router();
const Product = require("../models/prodect");
// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET products by owner email
router.get("/user/:email", async (req, res) => {
  try {
    const products = await Product.find({ ownerEmail: req.params.email });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// GET products by category
router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Get prodect by isBuyer
router.get("/buyer/:isbuyer", async (req, res) => {
  try {    const isbuyer = req.params.isbuyer === "true"; 
    const products = await Product.find({ isbuyer });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } });

// POST create product
router.post("/", async (req, res) => {
  try {
    const { name, price, image, description, status, ownerEmail, category, isbuyer } = req.body;
    const product = await Product.create({ name, price, image, description, status, ownerEmail, category, isbuyer });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const updatedData = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update product status
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//buy prodect
router.put("/buy/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.status !== "Approved") return res.status(400).json({ message: "Product not approved for sale" });
    if (product.isbuyer) return res.status(400).json({ message: "Product already sold" });
    product.isbuyer = true;
    await product.save();
    res.status(200).json(product);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }});
// UPDATE STATUS - Admin
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = status;
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
