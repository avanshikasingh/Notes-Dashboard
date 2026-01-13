const Note = require("../models/Note");

// CREATE
exports.createNote = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const note = await Note.create({
      title,
      content,
      category,
      userId: req.user
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// READ
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
