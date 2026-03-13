const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    price: {
      type: Number,
      required: true,
    },
image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
      status: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    category: {
  type: String,
  required: true,
},
 isbuyer: {
      type: Boolean,
      default: false,
    },


  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
