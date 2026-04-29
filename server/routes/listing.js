const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE LISTING
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, quantity } = req.body;
    // VALIDATION
    if (!title || !description || !quantity) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // trim check (handles "   ")
    if (title.trim() === "" || description.trim() === "") {
      return res.status(400).json({
        message: "Fields cannot be empty",
      });
    }

    // quantity check
    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    if (req.user.role !== "business") {
      return res.status(403).json({ message: "Only businesses can add listings" });
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 30 * 60 * 1000);

    const listing = new Listing({
      title: title.trim(),
      description: description.trim(),
      quantity,
      createdBy: req.user.id, // ✅ MUST
      createdAt,
      expiresAt,
      status: "charity-only",
    });

    await listing.save();

    res.json({ message: "Listing created", listing });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET LISTINGS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const listings = await Listing.find();
    const now = new Date();

    const updatedListings = listings.map((listing) => {
      if (listing.status === "charity-only" && now > listing.expiresAt) {
        listing.status = "open";
      }
      return listing;
    });

    const filteredListings = updatedListings.filter((listing) => {

      // Remove claimed listings for non-business users
      if (listing.quantity === 0 && req.user.role !== "business") {
        return false;
      }

      // Charity sees all remaining (only available now)
      if (req.user.role === "charity") {
        return true;
      }

      // Community sees only open listings
      if (req.user.role === "community") {
        return listing.status === "open";
      }

      // Business sees everything
      return true;
    });

    res.json(filteredListings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CLAIM LISTING
router.post("/claim/:id", authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (req.user.role === "business") {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (listing.quantity <= 0) {
      return res.status(400).json({ message: "No quantity left" });
    }

    listing.quantity -= 1;

    if (listing.quantity === 0) {
      listing.status = "claimed";
    }

    listing.claimedBy = req.user.id;

    await listing.save();

    res.json({ message: "Item claimed", listing });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // only business can delete
    if (req.user.role !== "business") {
      return res.status(403).json({ message: "Only businesses can delete" });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;