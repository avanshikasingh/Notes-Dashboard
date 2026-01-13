import { useState, useEffect } from "react";
import API from "../services/api";

export default function CreateNote({ editingNote, cancelEdit, onNoteAdded }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load editing note data
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and content required");

    try {
      if (editingNote) {
        await API.put(`/notes/${editingNote._id}`, { title, content });
      } else {
        await API.post("/notes", { title, content });
      }
      setTitle("");
      setContent("");
      onNoteAdded();
    } catch (err) {
      console.error(err);
      alert("Failed to save note");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "#f3f4f6",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "30px"
    }}>
      <h2 style={{ marginBottom: "15px", color: "#4a4a4a" }}>
        {editingNote ? "Edit Note" : "Create Note"}
      </h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px"
        }}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
          resize: "vertical"
        }}
      />
      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit" style={{
          background: "#4f46e5",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          {editingNote ? "Update Note" : "Add Note"}
        </button>
        {editingNote && (
          <button
            type="button"
            onClick={cancelEdit}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
