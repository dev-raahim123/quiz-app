import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface QuizResult {
  attemptId: number
  quizId: string
  title?: string
  correctAnswers: number
  incorrectAnswers: number
  totalQuestions: number
  date: string
}

const UserStats: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const stored = localStorage.getItem("quizHistory")
      if (stored) {
        const parsed: QuizResult[] = JSON.parse(stored)

        // Sort newest → oldest
        const sorted = parsed.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        // ✅ Remove accidental duplicates by attemptId
        const unique = sorted.filter(
          (res, index, self) =>
            index === self.findIndex((r) => r.attemptId === res.attemptId)
        )

        setResults(unique)
      }
    } catch (err) {
      console.error("❌ Failed to load quiz history", err)
      setResults([])
    }
  }, [])

  if (results.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card glass-effect p-5 shadow-lg bg-dark-secondary">
          <h2 className="text-light mb-3">📊 No quiz history yet</h2>
          <p className="text-muted">Take some quizzes to see your stats here!</p>
          <button
            className="btn btn-gradient-primary mt-3"
            onClick={() => navigate("/user/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ✅ Calculate average score
  const averageScore = (
    results.reduce((acc, res) => acc + (res.correctAnswers / res.totalQuestions) * 100, 0) /
    results.length
  ).toFixed(1)

  return (
    <div className="container py-5 animate-fade-in">
      <div className="card bg-dark-secondary glass-effect p-4 shadow-lg animate-slide-up">
        <h2 className="text-gradient mb-4">📊 Your Quiz History</h2>

        {/* Summary Section */}
        <div className="alert alert-dark text-light d-flex justify-content-between align-items-center mb-4">
          <span>
            <strong>Total Attempts:</strong> {results.length}
          </span>
          <span>
            <strong>Average Score:</strong>{" "}
            <span
              className={`badge ${
                Number(averageScore) >= 60 ? "bg-success" : "bg-danger"
              }`}
            >
              {averageScore}%
            </span>
          </span>
        </div>

        {/* Table Section */}
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>Date</th>
                <th>Quiz Title</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Incorrect</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => {
                const percent = ((res.correctAnswers / res.totalQuestions) * 100).toFixed(0)
                return (
                  <tr key={res.attemptId} className="animate-fade-in">
                    <td>{new Date(res.date).toLocaleString()}</td>
                    <td>{res.title || `Quiz ${res.quizId}`}</td>
                    <td>
                      <span
                        className={`badge ${
                          Number(percent) >= 60 ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {percent}%
                      </span>
                    </td>
                    <td>{res.correctAnswers}</td>
                    <td>{res.incorrectAnswers}</td>
                    <td>{res.totalQuestions}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <button
          className="btn btn-gradient-primary mt-3"
          onClick={() => navigate("/user/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default UserStats
