const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const Product = require("./models/prodect");

const app = express();
app.use(cors());
app.use(express.json());

async function callGemini(model, userMessage, productList) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{
              text: `You are a smart assistant that recommends products ONLY from the list below.

Available products:
${productList}

If the product is not in the list, say it is not available.

User question: ${userMessage}`
            }]
          }
        ]
      }),
    }
  );

  return await response.json();
}

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const products = await Product.find().limit(5);

    const productList = products.map(p =>
      `- name: ${p.name}, description: ${p.description}, price: ${p.price}, category: ${p.category}`
    ).join("\n");

    let data = await callGemini("gemini-2.5-flash", userMessage, productList);

    console.log("GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.log("Primary model failed, switching to fallback...");

      data = await callGemini("gemini-2.5-flash-lite", userMessage, productList);
    }

    if (data.error) {
      return res.json({ reply: data.error.message });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ reply: reply || "No response from Gemini" });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

app.get("/", (req, res) => res.send("API Running..."));

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/productRoute");
app.use("/api/products", productRoutes);

const swapRoutes = require("./routes/swapRoute");
app.use("/api/swaps", swapRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    const User = require("./models/user");
    const bcrypt = require("bcrypt");
    const existing = await User.findOne({ email: "0@gmail.com" });

    if (!existing) {
      console.log("Creating admin user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("0", salt);
      await User.create({
        name: "Admin",
        email: "0@gmail.com",
        password: hashedPassword,
        role: "student",
        permissions: [
          "canApproveOrRejectProducts",
          "canDeleteApprovedProduct",
          "canShowAllUsersDetails",
          "canGivePermissionToUser"
        ],
      });
      console.log("Admin created!");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));