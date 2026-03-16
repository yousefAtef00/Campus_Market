const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    password: {
      type: String,
      required: true,
    },
email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "worker"],
      required: true,
    },
    canGivePermisionToUser: {
      type: Boolean,
      default: false,
    },
    canApprovedOrRefuseProducts: { type: Boolean,
      default: false,
    },
    canShowAllUsersDetails: {
    type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
