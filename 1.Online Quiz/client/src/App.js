import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Login from "./Login";
import "./App.css";


// API KEY - ATTACHED HERE 👇
const API_KEY = "22bc1a6d-b4dc-42b1-b258-9214bde27755";

// 🎯 Quiz List
const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/quizzes", {
      headers: { "x-api-key":"22bc1a6d-b4dc-42b1-b258-9214bde27755" },
    })
      .then(res => res.json())
      .then(data => setQuizzes(data));
  }, []);

  return (
    <div>
      <h2>Available Quizzes</h2>
      {quizzes.map((quiz) => (
        <div className="quiz-card" key={quiz._id} onClick={() => navigate(`/quiz/${quiz._id}`)}>
          <h3>{quiz.title}</h3>
        </div>
      ))}
    </div>
  );
};

// 🧠 Quiz Page
const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/quizzes", {
      headers: { "x-api-key": API_KEY },
    })
      .then(res => res.json())
      .then(data => {
        const selected = data.find(q => q._id === id);
        setQuiz(selected);
      });
  }, [id]);

  const handleSubmit = () => {
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });
    navigate("/result", { state: { score, total: quiz.questions.length } });
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <h2>{quiz.title}</h2>
      {quiz.questions.map((q, idx) => (
        <div key={idx}>
          <p>{q.question}</p>
          {q.options.map((opt, oidx) => (
            <label key={oidx}>
              <input
                type="radio"
                name={`q${idx}`}
                value={opt}
                onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

// 🏁 Result Page
const Result = () => {
  const { state } = useLocation();
  const { score, total } = state;

  return (
    <div>
      <h2>Result</h2>
      <p>You scored {score} out of {total}</p>
    </div>
  );
};

// 🛠️ Create Quiz
const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:5000/api/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ title, questions }),
    });
    alert("Quiz Created!");
    setTitle("");
    setQuestions([]);
  };

  return (
    <div>
      <h2>Create New Quiz</h2>
      <input placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      {questions.map((q, idx) => (
        <div key={idx}>
          <input
            placeholder="Question"
            value={q.question}
            onChange={(e) => {
              const newQ = [...questions];
              newQ[idx].question = e.target.value;
              setQuestions(newQ);
            }}
          />
          {q.options.map((opt, oidx) => (
            <input
              key={oidx}
              placeholder={`Option ${oidx + 1}`}
              value={opt}
              onChange={(e) => {
                const newQ = [...questions];
                newQ[idx].options[oidx] = e.target.value;
                setQuestions(newQ);
              }}
            />
          ))}
          <input
            placeholder="Correct Answer"
            value={q.correctAnswer}
            onChange={(e) => {
              const newQ = [...questions];
              newQ[idx].correctAnswer = e.target.value;
              setQuestions(newQ);
            }}
          />
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={handleSubmit}>Save Quiz</button>
    </div>
  );
};

// 🚀 Main App
function App() {
  return (
    <Router>
      <div className="app">
        <h1>🧠 Online Quiz System</h1>
        <nav>
           <Link to="/login">Login</Link>
          <Link to="/">Quizzes</Link>
          <Link to="/create">Create Quiz</Link>
          
        </nav>
        <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/quizzes" element={<QuizList />} />
  <Route path="/quiz/:id" element={<QuizPage />} />
  <Route path="/result" element={<Result />} />
  <Route path="/create" element={<CreateQuiz />} />
</Routes>

      </div>
    </Router>
  );
}

export default App;
