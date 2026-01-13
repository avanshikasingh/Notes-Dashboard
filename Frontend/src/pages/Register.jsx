import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("All fields are required");

    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleRegister} style={{
      maxWidth: "400px", margin: "50px auto", padding: "20px",
      borderRadius: "12px", background: "#f3f4f6"
    }}>
      <h2 style={{ marginBottom: "20px" }}>Register</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>Register</button>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#4f46e5",
  color: "white",
  fontSize: "16px",
  cursor: "pointer"
};
