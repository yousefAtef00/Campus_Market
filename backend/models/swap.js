const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    targetProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    targetProductName: {
      type: String,
      required: true,
    },
    targetOwnerEmail: {
      type: String,
      required: true,
    },
    requesterEmail: {
      type: String,
      required: true,
    },
    offeredProduct: {
      name: { type: String, required: true },
      description: { type: String },
      image: { type: String },
      price: { type: Number },
      condition: { type: String },
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Swap", swapSchema);
