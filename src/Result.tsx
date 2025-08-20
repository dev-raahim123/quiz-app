"use client"

import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import confetti from "canvas-confetti"

const Result: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const storedResult = localStorage.getItem("quizResult")
    if (storedResult) {
      const parsed = JSON.parse(storedResult)
      if (parsed.quizId === quizId) {
        setResult(parsed)

        // 🎉 Confetti for good performance
        const scorePercent = (parsed.correctAnswers / parsed.totalQuestions) * 100
        if (scorePercent >= 60) {
          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
            })
          }, 500)
        }

        // ✅ Save this attempt into quizHistory (only once per attemptId)
        const history = JSON.parse(localStorage.getItem("quizHistory") || "[]")

        // if no attemptId exists, generate one now
        if (!parsed.attemptId) {
          parsed.attemptId = Date.now()
          localStorage.setItem("quizResult", JSON.stringify(parsed))
        }

        const alreadyExists = history.some(
          (h: any) => h.attemptId === parsed.attemptId
        )

        if (!alreadyExists) {
          history.push({
            attemptId: parsed.attemptId,
            quizId,
            title: parsed.title || "Untitled Quiz",
            correctAnswers: parsed.correctAnswers,
            incorrectAnswers: parsed.incorrectAnswers,
            totalQuestions: parsed.totalQuestions,
            date: new Date().toISOString(),
          })
          localStorage.setItem("quizHistory", JSON.stringify(history))
        }
      }
    }
  }, [quizId])

  if (!result) {
    return (
      <div className="text-center mt-5 text-light">
        <h2>No result found for this quiz</h2>
        <button
          className="btn btn-gradient-primary mt-3"
          onClick={() => navigate("/user/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="container py-5 text-center">
      <div
        className="card p-5 glass-effect shadow-lg"
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          borderRadius: "20px",
          animation: "fadeInUp 0.8s ease-in-out",
        }}
      >
        <h1 className="text-gradient mb-4">🎉 Quiz Completed!</h1>

        <div style={{ fontSize: "1.2rem" }}>
          <p>
            <strong>Total Questions:</strong> {result.totalQuestions}
          </p>
          <p style={{ color: "#4CAF50", fontWeight: "bold", fontSize: "1.5rem" }}>
            ✅ Correct Answers: {result.correctAnswers}
          </p>
          <p style={{ color: "#FF5252", fontWeight: "bold", fontSize: "1.5rem" }}>
            ❌ Incorrect Answers: {result.incorrectAnswers}
          </p>
        </div>

        <div
          className="progress mt-4"
          style={{
            height: "20px",
            borderRadius: "50px",
            overflow: "hidden",
          }}
        >
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-success"
            style={{
              width: `${(result.correctAnswers / result.totalQuestions) * 100}%`,
            }}
          ></div>
        </div>

        <h3 className="mt-4 text-gradient">
          Score: {((result.correctAnswers / result.totalQuestions) * 100).toFixed(0)}%
        </h3>

        <button
          className="btn btn-gradient-primary mt-4"
          onClick={() => navigate("/user/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}

export default Result
