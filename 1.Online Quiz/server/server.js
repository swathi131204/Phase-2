const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = "mongodb+srv://swathi:swathi12345@admin.z7grm.mongodb.net/?retryWrites=true&w=majority&appName=admin";

mongoose
  .connect(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Quiz Schema
const quizSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});
const Quiz = mongoose.model("Quiz", quizSchema);

// 🔐 API Key Middleware
const verifyApiKey = (req, res, next) => {
  const clientKey = req.headers["x-api-key"];
  const serverKey = process.env.API_KEY;

  if (!clientKey || clientKey !== serverKey) {
    return res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }

  next();
};

// ✅ Dummy Login Route (without DB check)
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Always succeed for any username/password
  if (username && password) {
    res.status(200).json({
      message: "Login successful",
      user: { username }
    });
  } else {
    res.status(400).json({ message: "Username and password required" });
  }
});

// ✅ Create Quiz
app.post("/api/quizzes", verifyApiKey, async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get All Quizzes
app.get("/api/quizzes", verifyApiKey, async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
