const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const mongoose = require("mongoose");

// Minimal Note model
const Note = mongoose.model("Note", new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
  favorite: { type: Boolean, default: false },
}));

// GET all notes for user
router.get("/", authMiddleware, async (req, res) => {
  const notes = await Note.find({ userId: req.userId });
  res.json(notes);
});

// POST new note
router.post("/", authMiddleware, async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.userId });
  res.json(note);
});

// PUT update note
router.put("/:id", authMiddleware, async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(note);
});

// DELETE note
router.delete("/:id", authMiddleware, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
