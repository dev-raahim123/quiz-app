"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import QuizCard from "./QuizCard"

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  questions: number
  duration: number
  category: string
}

const UserDashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("https://6899e7ecfed141b96ba13488.mockapi.io/quizzes")
        if (!res.ok) throw new Error("Failed to fetch quizzes")
        const data: Quiz[] = await res.json()
        setQuizzes(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 animate-fade-in">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading quizzes...</span>
          </div>
          <h5 className="text-gradient">Loading quizzes...</h5>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5 text-center animate-fade-in">
        <h4 className="text-danger">❌ Error: {error}</h4>
      </div>
    )
  }

  return (
    <div className="container py-5 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-gradient">📚 Available Quizzes</h2>
        <button
          className="btn btn-gradient-info hover-scale"
          onClick={() => navigate("/user/stats")}
        >
          <i className="fas fa-chart-line me-2"></i> My Stats
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center text-light mt-5 animate-slide-up">
          <i className="fas fa-info-circle fa-2x mb-3 text-muted"></i>
          <h5>No quizzes available yet. Please check back later!</h5>
        </div>
      ) : (
        <div className="row">
          {quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className="col-lg-4 col-md-6 mb-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <QuizCard quiz={quiz} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserDashboard
