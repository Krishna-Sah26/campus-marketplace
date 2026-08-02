const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    condition: { type: String, default: "Used" },
    campus: { type: String, default: "", trim: true },
    status: { 
      type: String, 
      enum: ["pending-payment", "pending-verification", "approved", "sold"], 
      default: "pending-payment" 
    },
    listingFee: { type: Number, required: true, min: 0 },
    paymentScreenshot: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    sellerName: { type: String, default: "Anonymous Seller" },
    sellerEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
