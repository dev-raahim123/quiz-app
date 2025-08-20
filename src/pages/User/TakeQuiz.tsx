"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Question {
  id: string;
  quizid: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  questions: number;
  duration: number;
  category: string;
}

const TakeQuiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizRes = await fetch(
          `https://6899e7ecfed141b96ba13488.mockapi.io/quizzes/${quizId}`
        );
        const quizData = await quizRes.json();
        console.log("✅ Quiz fetched:", quizData);
        setQuiz(quizData);

        const questionsRes = await fetch(
          `https://6899e7ecfed141b96ba13488.mockapi.io/questions`
        );
        const allQuestions: Question[] = await questionsRes.json();

        // ✅ Filter questions by quizId
        const filteredQuestions = allQuestions.filter(
          (q) => q.quizid === quizId
        );
        console.log("✅ Filtered Questions:", filteredQuestions);
        setQuestions(filteredQuestions);
      } catch (error) {
        console.error("❌ Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        calculatedScore++;
      }
    });

    // Save result to localStorage
    localStorage.setItem(
      "quizResult",
      JSON.stringify({
        quizId,
        totalQuestions: questions.length,
        correctAnswers: calculatedScore,
        incorrectAnswers: questions.length - calculatedScore,
      })
    );

    // Navigate to result page
    navigate(`/user/result/${quizId}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3 loading-spinner"
            role="status"
          >
            <span className="visually-hidden">Loading quiz...</span>
          </div>
          <h4 className="text-gradient">Preparing your quiz...</h4>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center mt-5 text-light">
        <h2>Quiz not found</h2>
        <button
          className="btn btn-gradient-primary mt-3"
          onClick={() => navigate("/user/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container py-5 animate-fade-in">
      <div className="card bg-dark-secondary p-4 glass-effect text-light animate-slide-up">
        <h2 className="text-gradient">{quiz.title}</h2>
        <p>{quiz.description}</p>
        <p className="small text-muted">
          Difficulty: {quiz.difficulty} | Category: {quiz.category}
        </p>

        {currentQuestion && (
          <div key={currentQuestion.id} className="mt-4 animate-slide-in">
            <h5>
              Question {currentQuestionIndex + 1} of {questions.length}
            </h5>
            <p className="mb-3">{currentQuestion.question}</p>

            <div>
              {currentQuestion.options.map((opt, idx) => (
                <div key={idx} className="form-check mb-2">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={opt}
                    checked={answers[currentQuestion.id] === opt}
                    onChange={() => handleAnswerSelect(currentQuestion.id, opt)}
                    className="form-check-input"
                  />
                  <label className="form-check-label">{opt}</label>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-outline-light"
                disabled={currentQuestionIndex === 0}
                onClick={handlePrev}
              >
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  className="btn btn-gradient-primary"
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                >
                  Next
                </button>
              ) : (
                <button
                  className="btn btn-gradient-success"
                  onClick={handleSubmit}
                  disabled={!answers[currentQuestion.id]}
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
