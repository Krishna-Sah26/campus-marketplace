const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    campus: { type: String, default: "", trim: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", trim: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    sessionToken: { type: String, default: null },
    savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    firebaseUid: { type: String, default: null, unique: true, sparse: true },
    sellerQrCode: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
