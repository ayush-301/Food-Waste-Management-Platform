const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  quantity: Number,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  expiresAt: Date,

  status: {
    type: String,
    enum: ["charity-only", "open", "claimed"],
    default: "charity-only"
  },

  claimedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
}
});



module.exports = mongoose.model("Listing", listingSchema);