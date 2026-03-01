const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(cors()); 
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running...");
});
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
