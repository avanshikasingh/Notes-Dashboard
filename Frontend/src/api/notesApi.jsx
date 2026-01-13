import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchNotes = () => API.get("/notes");
export const createNote = (data) => API.post("/notes", data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
