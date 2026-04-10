const express = require("express");
const router = express.Router();
const Swap = require("../models/swap");


router.post("/", async (req, res) => {
  try {
    const {
      targetProductId,
      targetProductName,
      targetOwnerEmail,
      requesterEmail,
      offeredProduct,
    } = req.body;

    if (!targetProductId || !requesterEmail || !offeredProduct?.name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (requesterEmail === targetOwnerEmail) {
      return res.status(400).json({ message: "Cannot swap with yourself" });
    }

    const swap = await Swap.create({
      targetProductId,
      targetProductName,
      targetOwnerEmail,
      requesterEmail,
      offeredProduct,
    });

    res.status(201).json(swap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/received/:email", async (req, res) => {
  try {
    const swaps = await Swap.find({ targetOwnerEmail: req.params.email });
    res.status(200).json(swaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/sent/:email", async (req, res) => {
  try {
    const swaps = await Swap.find({ requesterEmail: req.params.email });
    res.status(200).json(swaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    swap.status = status;
    await swap.save();

  
    if (status === "Accepted") {
      const Product = require("../models/prodect");

     
      await Product.findByIdAndUpdate(swap.targetProductId, { status: "Swapped" });

      await Swap.updateMany(
        {
          targetProductId: swap.targetProductId,
          _id: { $ne: swap._id },
          status: "Pending",
        },
        { status: "Rejected" }
      );
    }

    res.status(200).json(swap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const swap = await Swap.findByIdAndDelete(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });
    res.status(200).json({ message: "Swap deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
