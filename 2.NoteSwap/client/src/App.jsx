import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ name: "", email: "" });
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({
    title: "",
    content: "",
    subject: "",
    tags: "",
    quality: ""
  });

  const API = "http://localhost:5000/api";

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes`);
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, loginData);
      setUser(res.data.user);

      // ✅ Popup message after successful login
      alert(`✅ Login Successful! Welcome ${res.data.user.name}`);
    } catch (error) {
      alert("❌ Login Failed. Please check your details.");
    }
  };

  const addNote = async () => {
    try {
      await axios.post(`${API}/notes`, {
        ...note,
        tags: note.tags.split(",").map((tag) => tag.trim())
      });

      // Reset note fields
      setNote({ title: "", content: "", subject: "", tags: "", quality: "" });

      fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="app">
      <h1>📚 NoteSwap</h1>

      {!user ? (
        <div className="login">
          <h2>Login</h2>
          <input
            placeholder="Name"
            value={loginData.name}
            onChange={(e) =>
              setLoginData({ ...loginData, name: e.target.value })
            }
          />
          <input
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
          <div className="note-form">
            <input
              placeholder="Title"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
            />
            <textarea
              placeholder="Content"
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
            ></textarea>
            <input
              placeholder="Subject"
              value={note.subject}
              onChange={(e) => setNote({ ...note, subject: e.target.value })}
            />
            <input
              placeholder="Tags (comma separated)"
              value={note.tags}
              onChange={(e) => setNote({ ...note, tags: e.target.value })}
            />
            <input
              placeholder="Quality"
              value={note.quality}
              onChange={(e) => setNote({ ...note, quality: e.target.value })}
            />
            <button onClick={addNote}>Add Note</button>
          </div>

          <h3>All Notes</h3>
          <div className="notes-list">
            {notes.map((n) => (
              <div key={n._id} className="note-card">
                <h4>{n.title}</h4>
                <p>{n.content}</p>
                <p>
                  <b>Subject:</b> {n.subject}
                </p>
                <p>
                  <b>Tags:</b> {n.tags.join(", ")}
                </p>
                <p>
                  <b>Quality:</b> {n.quality}
                </p>
                <button onClick={() => deleteNote(n._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
