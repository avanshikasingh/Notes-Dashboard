import { useEffect, useState } from "react";
import CreateNote from "../components/CreateNote";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCopy, AiOutlineStar, AiFillStar } from "react-icons/ai";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // ---------------- FETCH NOTES ----------------
  const loadNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch notes");
      setLoading(false);
    }
  };

  // ---------------- FETCH PROFILE ----------------
  const loadProfile = async () => {
    try {
      const res = await API.get("/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err.response || err);
      alert("Failed to fetch profile");
    }
  };

  useEffect(() => {
    loadProfile();
    loadNotes();
  }, []);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ---------------- DELETE NOTE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await API.delete(`/notes/${id}`);
      loadNotes();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ---------------- TOGGLE FAVORITE ----------------
  const toggleFavorite = async (note) => {
    try {
      await API.put(`/notes/${note._id}`, { favorite: !note.favorite });
      loadNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- COPY NOTE ----------------
  const copyNote = (content) => {
    navigator.clipboard.writeText(content);
    alert("Copied to clipboard!");
  };

  // ---------------- EDIT NOTE ----------------
  const handleEdit = (note) => setEditingNote(note);
  const cancelEdit = () => setEditingNote(null);

  // ---------------- SEARCH FILTER ----------------
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ color: "#4a4a4a" }}>My Notes</h1>
          {profile && <p style={{ color: "#555", fontSize: "14px" }}>Hello, {profile.name || profile.email}!</p>}
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "60%",
          padding: "12px 15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
          marginBottom: "30px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      />

      {/* CREATE / EDIT NOTE */}
      <CreateNote
        editingNote={editingNote}
        cancelEdit={cancelEdit}
        onNoteAdded={() => { loadNotes(); setEditingNote(null); }}
      />

      {/* NOTES GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {filteredNotes.length === 0 && (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#666", fontSize: "18px" }}>
            No notes found.
          </p>
        )}
        {filteredNotes.map(note => (
          <div
            key={note._id}
            style={{
              padding: "20px",
              borderRadius: "12px",
              background: note.favorite ? "#fef9c3" : "#ffffff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              position: "relative"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <h3 style={{ color: "#333", marginBottom: "10px" }}>{note.title}</h3>
            <p style={{ color: "#555", minHeight: "60px" }}>
              {note.content.length > 100 ? note.content.substring(0, 100) + "..." : note.content}
            </p>

            {/* CARD ACTIONS */}
            <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleEdit(note)} style={iconButtonStyle}><AiOutlineEdit size={20} /></button>
                <button onClick={() => handleDelete(note._id)} style={iconButtonStyle}><AiOutlineDelete size={20} /></button>
                <button onClick={() => copyNote(note.content)} style={iconButtonStyle}><AiOutlineCopy size={20} /></button>
              </div>
              <button onClick={() => toggleFavorite(note)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                {note.favorite ? <AiFillStar size={22} color="#facc15" /> : <AiOutlineStar size={22} color="#999" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const iconButtonStyle = {
  background: "#4f46e5",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
  transition: "background 0.2s"
};

export default Dashboard;
