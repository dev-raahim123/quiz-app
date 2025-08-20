import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CreateQuizForm {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  duration: string;   // keep as string for the input
  questions: string;  // keep as string for the input
}

const CreateQuiz: React.FC = () => {
  const [quizData, setQuizData] = useState<CreateQuizForm>({
    title: "",
    description: "",
    difficulty: "Easy",
    category: "",
    duration: "",
    questions: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQuizData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://6899e7ecfed141b96ba13488.mockapi.io/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quizData,
          duration: Number(quizData.duration),
          questions: Number(quizData.questions)
        })
      });

      if (!response.ok) throw new Error("Failed to create quiz");

      const newQuiz = await response.json();
      console.log("✅ Quiz Created:", newQuiz);
      alert("🎉 Quiz created successfully!");

      // Redirect admin to AddQuestions for this quiz
      navigate(`/admin/add-questions/${newQuiz.id}`);
    } catch (error) {
      console.error("❌ Error creating quiz:", error);
      alert("Something went wrong while creating the quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="card bg-dark-secondary glass-effect p-4 shadow-lg animate-slide-up">
        <h2 className="text-gradient mb-4">Create New Quiz</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Quiz Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={quizData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={quizData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Difficulty</label>
              <select
                className="form-control"
                name="difficulty"
                value={quizData.difficulty}
                onChange={handleChange}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Category</label>
              <input
                type="text"
                className="form-control"
                name="category"
                value={quizData.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                name="duration"
                value={quizData.duration}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Number of Questions</label>
              <input
                type="number"
                className="form-control"
                name="questions"
                value={quizData.questions}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gradient-primary w-100 mt-3 hover-scale"
            disabled={loading}
          >
            {loading ? "Creating..." : (
              <>
                <i className="fas fa-plus-circle me-2"></i>Create Quiz
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
