const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const User = require("./models/User");
const Listing = require("./models/Listing");

const FIREBASE_WEB_API_KEY =
  process.env.FIREBASE_WEB_API_KEY || "AIzaSyAlETWn2OommOqrbdlJ8lQ6Rn1zAkfaDxg";

// Initialize Firebase Admin
try {
  const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized with service account");
  } else {
    admin.initializeApp({
      projectId: "campusmarketpla",
    });
    console.warn("Service account key not found, initializing Firebase Admin with project ID only");
  }
} catch (error) {
  console.warn("Firebase Admin fallback init failed, using project ID only");
  admin.initializeApp({
    projectId: "campusmarketpla",
  });
}
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/campus-market";

app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));

const createToken = () => crypto.randomBytes(24).toString("hex");
const makeAvatar = (nameOrEmail) => {
  const seed = encodeURIComponent(nameOrEmail || "student");
  return `https://api.dicebear.com/8.x/initials/svg?seed=${seed}`;
};
const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  campus: user.campus,
  avatar: user.avatar,
  bio: user.bio,
  role: user.role,
  savedListings: user.savedListings || [],
  createdAt: user.createdAt,
});
const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim();
};
const normalizeFirebaseIdentity = (identity) => ({
  email: identity?.email || "",
  name: identity?.name || identity?.displayName || identity?.email || "Google User",
  uid: identity?.uid || identity?.localId || "",
  picture: identity?.picture || identity?.photoUrl || "",
});

const verifyFirebaseIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return normalizeFirebaseIdentity(decodedToken);
  } catch (adminError) {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message =
        data?.error?.message ||
        adminError.message ||
        "Unable to verify Firebase token.";
      throw new Error(message);
    }

    return normalizeFirebaseIdentity(data?.users?.[0]);
  }
};

const requireAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const user = await User.findOne({ sessionToken: token });
    if (!user) {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    req.authUser = user;
    req.authToken = token;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Auth check failed.", error: error.message });
  }
};

const seedListings = async () => {
  const count = await Listing.countDocuments();
  if (count > 0) return;

  // Seed demo marketplace items so the app works on first run.
  await Listing.insertMany([
    {
      name: "Calculus Textbook",
      price: 25,
      description: "Used calculus textbook in good condition.",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
      category: "Books",
      condition: "Good",
      verified: true,
      featured: true,
      sellerName: "Campus Market",
    },
    {
      name: "Lab Equipment Set",
      price: 50,
      description: "Complete lab equipment set for chemistry and physics classes.",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
      category: "Lab Equipment",
      condition: "Very Good",
      verified: true,
      featured: true,
      sellerName: "Campus Market",
    },
    {
      name: "Drawing Kit",
      price: 30,
      description: "Professional drawing kit with pencils, scale, and sketch sheets.",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800",
      category: "Drawing Kits",
      condition: "Used",
      sellerName: "Campus Market",
    },
    {
      name: "Laptop Charger",
      price: 15,
      description: "Compatible charger for various laptop models.",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800",
      category: "Electronics",
      condition: "Good",
      verified: true,
      sellerName: "Campus Market",
    },
    {
      name: "Hostel Bedding Set",
      price: 40,
      description: "Complete bedding set for hostel room.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      category: "Hostel Items",
      condition: "Good",
      sellerName: "Campus Market",
    },
    {
      name: "Chef Apron",
      price: 10,
      description: "Professional chef apron for cooking classes.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      category: "Aprons",
      condition: "New",
      verified: true,
      sellerName: "Campus Market",
    },
  ]);
};

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Campus Market API is healthy." });
});

// Register a new student account and start a session immediately.
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, campus } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sessionToken = createToken();
    const avatar = makeAvatar(name || normalizedEmail);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      campus: campus || "",
      avatar,
      sessionToken,
    });

    return res.status(201).json({ user: toSafeUser(user), token: sessionToken });
  } catch (error) {
    return res.status(500).json({ message: "Unable to register user.", error: error.message });
  }
});

// Login and rotate the session token so the session stays server-controlled.
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    user.sessionToken = createToken();
    await user.save();

    return res.json({ user: toSafeUser(user), token: user.sessionToken });
  } catch (error) {
    return res.status(500).json({ message: "Unable to login.", error: error.message });
  }
});

// Validate the current session and return the logged-in profile.
app.get("/api/auth/me", requireAuth, async (req, res) => {
  res.json({ user: toSafeUser(req.authUser), token: req.authToken });
});

// End the current session.
app.post("/api/auth/logout", requireAuth, async (req, res) => {
  try {
    req.authUser.sessionToken = null;
    await req.authUser.save();
    return res.json({ message: "Logged out successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to logout.", error: error.message });
  }
});

// Firebase auth endpoint
app.post("/api/auth/firebase", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "ID token required" });
    }

    const { email, name, uid, picture } = await verifyFirebaseIdToken(idToken);
    if (!email) {
      return res.status(400).json({ message: "Google account email missing from Firebase token." });
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      // Create new user
      const sessionToken = createToken();
      const avatar = picture || makeAvatar(name || email);
      user = await User.create({
        name: name || email.split("@")[0],
        email: String(email).toLowerCase(),
        password: await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10), // Random password for Firebase users
        campus: "",
        avatar,
        sessionToken,
        firebaseUid: uid || null
      });
    } else {
      if (!user.firebaseUid && uid) {
        user.firebaseUid = uid;
      }
      // Update session token
      user.sessionToken = createToken();
      await user.save();
    }

    return res.json({ user: toSafeUser(user), token: user.sessionToken });
  } catch (error) {
    console.error("Firebase auth error:", error);
    return res.status(500).json({ message: "Firebase auth failed", error: error.message });
  }
});

// Public listing feed with search and filter support.
app.get("/api/listings", async (req, res) => {
  try {
    const { search = "", category = "", featured = "", sellerId = "", mine = "", status } = req.query;
    const filter = {};

    // If mine is true, show all seller's listings
    if (mine === "true") {
      const token = getTokenFromRequest(req);
      const user = token ? await User.findOne({ sessionToken: token }) : null;
      if (!user) {
        return res.status(401).json({ message: "Login required to view your listings." });
      }
      filter.sellerId = user._id;
    } else {
      // Public feed only shows approved items
      filter.status = status || "approved";
    }

    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    if (sellerId) filter.sellerId = sellerId;

    if (search) {
      const regex = new RegExp(escapeRegExp(search), "i");
      filter.$or = [
        { name: regex },
        { description: regex },
        { category: regex },
        { sellerName: regex },
      ];
    }

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .populate("sellerId", "name email campus avatar");

    return res.json({ listings });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load listings.", error: error.message });
  }
});

// Upload payment screenshot endpoint
app.patch("/api/listings/:id/upload-screenshot", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentScreenshot } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (String(listing.sellerId) !== String(req.authUser._id)) {
      return res.status(403).json({ message: "You can only update your own listings." });
    }

    listing.paymentScreenshot = paymentScreenshot;
    listing.status = "pending-verification";
    await listing.save();

    return res.json({ listing });
  } catch (error) {
    return res.status(500).json({ message: "Unable to upload screenshot.", error: error.message });
  }
});

// Admin verify payment endpoint
app.patch("/api/listings/:id/verify-payment", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.authUser.role !== "admin") {
      return res.status(403).json({ message: "Only admins can verify payments." });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    listing.status = "approved";
    await listing.save();

    return res.json({ listing });
  } catch (error) {
    return res.status(500).json({ message: "Unable to verify payment.", error: error.message });
  }
});

// Mark item as sold endpoint
app.patch("/api/listings/:id/mark-sold", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (String(listing.sellerId) !== String(req.authUser._id)) {
      return res.status(403).json({ message: "You can only update your own listings." });
    }

    listing.status = "sold";
    await listing.save();

    return res.json({ listing });
  } catch (error) {
    return res.status(500).json({ message: "Unable to mark item as sold.", error: error.message });
  }
});

// Get all pending verification listings (admin only)
app.get("/api/admin/pending-listings", requireAuth, async (req, res) => {
  try {
    if (req.authUser.role !== "admin") {
      return res.status(403).json({ message: "Only admins can access this endpoint." });
    }

    const listings = await Listing.find({ status: "pending-verification" })
      .sort({ createdAt: -1 })
      .populate("sellerId", "name email campus avatar");

    return res.json({ listings });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load pending listings.", error: error.message });
  }
});

// Create a new listing and save it in MongoDB.
app.post("/api/listings", async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    const loggedInUser = token ? await User.findOne({ sessionToken: token }) : null;
    const {
      name,
      price,
      description,
      image,
      category,
      condition,
      campus,
      verified,
      featured,
    } = req.body || {};

    if (!name || price === undefined || !description || !image || !category) {
      return res.status(400).json({ message: "Name, price, description, image, and category are required." });
    }

    const listingFee = Math.round(Number(price) * 0.1); // 10% listing fee

    const listing = await Listing.create({
      name,
      price: Number(price),
      description,
      image,
      category,
      condition: condition || "Used",
      campus: campus || loggedInUser?.campus || "",
      verified: Boolean(verified),
      featured: Boolean(featured),
      sellerId: loggedInUser?._id || null,
      sellerName: loggedInUser?.name || req.body?.sellerName || "Anonymous Seller",
      sellerEmail: loggedInUser?.email || req.body?.sellerEmail || "",
      listingFee,
      status: "pending-payment",
    });

    return res.status(201).json({ listing });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create listing.", error: error.message });
  }
});

// Read one listing and bump the view counter.
app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("sellerId", "name email campus avatar");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    listing.views += 1;
    await listing.save();

    return res.json({ listing });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load listing.", error: error.message });
  }
});

// Update a listing only when the owner is logged in.
app.put("/api/listings/:id", requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    const ownsListing = String(listing.sellerId) === String(req.authUser._id);
    const isAdmin = req.authUser.role === "admin";
    if (!ownsListing && !isAdmin) {
      return res.status(403).json({ message: "You can only edit your own listing." });
    }

    const updatableFields = ["name", "price", "description", "image", "category", "condition", "status", "featured", "verified", "campus"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    await listing.save();
    return res.json({ listing });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update listing.", error: error.message });
  }
});

// Remove a listing when the owner decides to delete it.
app.delete("/api/listings/:id", requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    const ownsListing = String(listing.sellerId) === String(req.authUser._id);
    const isAdmin = req.authUser.role === "admin";
    if (!ownsListing && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own listing." });
    }

    await listing.deleteOne();
    await User.updateMany({}, { $pull: { savedListings: listing._id } });

    return res.json({ message: "Listing deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete listing.", error: error.message });
  }
});

// Toggle save/unsave for a logged-in user.
app.patch("/api/listings/:id/save", requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    const user = req.authUser;
    const alreadySaved = user.savedListings.some((savedId) => String(savedId) === String(listing._id));

    if (alreadySaved) {
      user.savedListings = user.savedListings.filter((savedId) => String(savedId) !== String(listing._id));
      listing.savedBy = listing.savedBy.filter((userId) => String(userId) !== String(user._id));
    } else {
      user.savedListings.push(listing._id);
      listing.savedBy.push(user._id);
    }

    await user.save();
    await listing.save();

    return res.json({
      saved: !alreadySaved,
      listing,
      user: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to toggle save.", error: error.message });
  }
});

// Return only the listings saved by the logged-in user.
app.get("/api/users/me/saved", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.authUser._id).populate("savedListings");
    return res.json({ listings: user.savedListings || [] });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load saved items.", error: error.message });
  }
});

// Return the listings posted by one user.
app.get("/api/users/:id/listings", async (req, res) => {
  try {
    const listings = await Listing.find({ sellerId: req.params.id }).sort({ createdAt: -1 });
    return res.json({ listings });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load user listings.", error: error.message });
  }
});

// Read and update the current user profile.
app.get("/api/users/me", requireAuth, async (req, res) => {
  return res.json({ user: toSafeUser(req.authUser) });
});

app.put("/api/users/me", requireAuth, async (req, res) => {
  try {
    const updatableFields = ["name", "campus", "avatar", "bio"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.authUser[field] = req.body[field];
      }
    });

    if (req.body.password) {
      req.authUser.password = await bcrypt.hash(req.body.password, 10);
    }

    await req.authUser.save();
    return res.json({ user: toSafeUser(req.authUser) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update profile.", error: error.message });
  }
});

// Basic dashboard stats for the landing page and future admin views.
app.get("/api/stats/overview", async (req, res) => {
  try {
    const [users, listings, featuredListings, savedCount] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ featured: true }),
      Listing.aggregate([{ $project: { savedTotal: { $size: "$savedBy" } } }, { $group: { _id: null, total: { $sum: "$savedTotal" } } }]),
    ]);

    return res.json({
      users,
      listings,
      featuredListings,
      savedCount: savedCount[0]?.total || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load stats.", error: error.message });
  }
});

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await seedListings();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

