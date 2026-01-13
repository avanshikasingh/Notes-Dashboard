const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

module.exports = router;
