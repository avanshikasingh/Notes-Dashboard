import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Email and password are required");

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f9fafb",
      fontFamily: "Arial, sans-serif"
    }}>
      <form onSubmit={handleLogin} style={{
        width: "100%",
        maxWidth: "400px",
        background: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#4a4a4a" }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Login</button>

        <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px", color: "#555" }}>
          Don't have an account? <Link to="/register" style={{ color: "#4f46e5", fontWeight: "bold" }}>Register here</Link>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#4f46e5",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px"
};
