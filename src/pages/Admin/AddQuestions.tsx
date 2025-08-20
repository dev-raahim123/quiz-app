import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number | null; // index of correct option
}

const AddQuestions: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: null }
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = optIndex;
    setQuestions(updated);
  };

  const addNewQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: null }]);
  };

  const validateQuestions = (): boolean => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`⚠️ Question ${i + 1} is empty`);
        return false;
      }
      if (q.options.some((opt) => !opt.trim())) {
        setError(`⚠️ All options must be filled for Question ${i + 1}`);
        return false;
      }
      if (q.correctAnswer === null) {
        setError(`⚠️ Please select a correct answer for Question ${i + 1}`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateQuestions()) return;

    try {
      for (const q of questions) {
        await fetch("https://6899e7ecfed141b96ba13488.mockapi.io/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizid: quizId,
            question: q.question,
            options: q.options,
            correctAnswer: q.options[q.correctAnswer as number]
          })
        });
      }

      alert("✅ Questions added successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error saving questions:", err);
      setError("❌ Something went wrong while saving questions.");
    }
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="card bg-dark-secondary glass-effect p-4 shadow-lg animate-slide-up">
        <h2 className="text-gradient mb-4">
          <i className="fas fa-question-circle me-2"></i> Add Questions
        </h2>

        {error && (
          <div className="alert alert-danger animate-fade-in mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-4 p-3 rounded glass-effect border border-secondary animate-fade-in">
              <h5 className="text-light mb-3">Question {qIndex + 1}</h5>

              {/* Question input */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter question"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                required
              />

              {/* Options with radio buttons */}
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="input-group mb-2">
                  <div className="input-group-text bg-dark border-secondary">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswer === optIndex}
                      onChange={() => handleCorrectAnswerChange(qIndex, optIndex)}
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-gradient-primary w-100 mb-3 hover-scale"
            onClick={addNewQuestion}
          >
            <i className="fas fa-plus-circle me-2"></i> Add Another Question
          </button>

          <button type="submit" className="btn btn-success w-100 hover-scale">
            <i className="fas fa-save me-2"></i> Save All Questions
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuestions;
