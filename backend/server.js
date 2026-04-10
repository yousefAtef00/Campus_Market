const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const ngrok = require("ngrok");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/productRoute");
app.use("/api/products", productRoutes);

const swapRoutes = require("./routes/swapRoute");
app.use("/api/swaps", swapRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);

      ngrok.connect({
        addr: PORT,
        authtoken: "3BsFIoB752pXHt2VBqls4ujDwTm_5LCXzeRkSxxkMsT6waHHw",
        hostname: "curdy-nonputrescent-kerrie.ngrok-free.dev"
      }).then((url) => {
        console.log(`Ngrok URL: ${url}`);
        console.log(`Use this in frontend: ${url}/api`);
      }).catch((err) => console.log("Ngrok Error:", err));

    });
  })
  .catch((err) => console.log(err));
