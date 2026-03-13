const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const ngrok = require("ngrok");
const app = express();
const cors = require("cors");
app.use(cors()); 
app.use(express.json());

// Connect to MongoDB
app.get("/", (req, res) => {
  res.send("API Running...");

});
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const productRoutes = require("./routes/productRoute");
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      ngrok.connect(PORT).then((url) => {
        console.log(`Ngrok URL: ${url}`);
      }).catch((err) => console.log("Ngrok Error:", err));

    });
      

  })
  .catch((err) => console.log(err));