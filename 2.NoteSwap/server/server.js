// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/noteswap", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Schemas
const UserSchema = new mongoose.Schema({
    name: String,
    email: String
});

const NoteSchema = new mongoose.Schema({
    title: String,
    content: String,
    subject: String,
    tags: [String],
    quality: String,
    rating: { type: Number, default: 0 },
    reviews: [{ user: String, comment: String }]
});

const User = mongoose.model("User", UserSchema);
const Note = mongoose.model("Note", NoteSchema);

// ✅ Routes
// 1. User Login
app.post("/api/login", async (req, res) => {
    const { name, email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        user = new User({ name, email });
        await user.save();
    }
    res.json({ message: "Login successful", user });
});

// 2. Add Note
app.post("/api/notes", async (req, res) => {
    const note = new Note(req.body);
    await note.save();
    res.json({ message: "Note added successfully", note });
});

// 3. Get All Notes
app.get("/api/notes", async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

// 4. Update Note
app.put("/api/notes/:id", async (req, res) => {
    const { id } = req.params;
    const updatedNote = await Note.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: "Note updated successfully", updatedNote });
});

// 5. Delete Note
app.delete("/api/notes/:id", async (req, res) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.json({ message: "Note deleted successfully" });
});

// ✅ Start Server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
