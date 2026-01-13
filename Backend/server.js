const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// --- Minimal User model ---
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// --- Auth Middleware ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// --- Routes ---

// Test route
app.get("/", (req, res) => res.send("Server is running"));

// Register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await require("bcrypt").hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Registration failed" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await require("bcrypt").compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = require("jsonwebtoken").sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// Profile
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Minimal Note model
const NoteSchema = new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
  favorite: { type: Boolean, default: false },
});
const Note = mongoose.model("Note", NoteSchema);

// Notes CRUD
app.get("/api/notes", authMiddleware, async (req, res) => {
  const notes = await Note.find({ userId: req.userId });
  res.json(notes);
});
app.post("/api/notes", authMiddleware, async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.userId });
  res.json(note);
});
app.put("/api/notes/:id", authMiddleware, async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(note);
});
app.delete("/api/notes/:id", authMiddleware, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// --- Connect MongoDB & Start Server ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
