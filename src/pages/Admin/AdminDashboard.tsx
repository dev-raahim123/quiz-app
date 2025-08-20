"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  questions: number
  duration: number
  category: string
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("https://6899e7ecfed141b96ba13488.mockapi.io/quizzes")
        const data = await res.json()
        setQuizzes(data)
      } catch (error) {
        console.error("Error fetching quizzes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  const totalQuizzes = quizzes.length
  const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions, 0)
  const avgQuestionsPerQuiz = totalQuizzes > 0 ? Math.round(totalQuestions / totalQuizzes) : 0

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="loading-spinner spinner-border text-primary mb-4" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-gradient animate-pulse">Loading Admin Dashboard...</h4>
          <p className="text-light-muted">Preparing your management tools</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5 animate-fade-in">
      {/* Enhanced Header */}
      <div className="text-center mb-5">
        <div className="mb-4">
          <i className="fas fa-crown fa-4x text-gradient float-animation"></i>
        </div>
        <h1 className="text-gradient-enhanced animate-slide-up">Admin Command Center</h1>
        <p className="text-light-muted fs-5 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Manage quizzes, users, and monitor platform performance
        </p>
      </div>

      {/* Enhanced Stats Section */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div
            className="stat-card glass-effect hover-lift animate-bounce-in cursor-pointer"
            onClick={() => navigate("/admin/manage-quizzes")}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <i className="fas fa-clipboard-list fa-2x text-primary"></i>
              <span className="badge bg-primary">Active</span>
            </div>
            <h2 className="text-gradient mb-1">{totalQuizzes}</h2>
            <p className="text-light-muted mb-0">Total Quizzes</p>
            <div className="mt-2">
              <small className="text-success">
                <i className="fas fa-arrow-up me-1"></i>
                Click to manage
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="stat-card glass-effect hover-lift animate-bounce-in" style={{ animationDelay: "0.1s" }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <i className="fas fa-question-circle fa-2x text-warning"></i>
              <span className="badge bg-warning text-dark">Total</span>
            </div>
            <h2 className="text-gradient mb-1">{totalQuestions}</h2>
            <p className="text-light-muted mb-0">Total Questions</p>
            <div className="mt-2">
              <small className="text-info">
                <i className="fas fa-calculator me-1"></i>
                Avg: {avgQuestionsPerQuiz} per quiz
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div
            className="stat-card glass-effect hover-lift animate-bounce-in cursor-pointer"
            onClick={() => navigate("/admin/manage-users")}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <i className="fas fa-users fa-2x text-success"></i>
              <span className="badge bg-success">Manage</span>
            </div>
            <h2 className="text-gradient mb-1">∞</h2>
            <p className="text-light-muted mb-0">Platform Users</p>
            <div className="mt-2">
              <small className="text-success">
                <i className="fas fa-user-cog me-1"></i>
                Click to manage
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="stat-card glass-effect hover-lift animate-bounce-in" style={{ animationDelay: "0.3s" }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <i className="fas fa-chart-line fa-2x text-info"></i>
              <span className="badge bg-info text-dark">Analytics</span>
            </div>
            <h2 className="text-gradient mb-1">100%</h2>
            <p className="text-light-muted mb-0">System Health</p>
            <div className="mt-2">
              <small className="text-success">
                <i className="fas fa-check-circle me-1"></i>
                All systems operational
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="mb-5">
        <h3 className="text-gradient mb-4">
          <i className="fas fa-bolt me-2"></i>
          Quick Actions
        </h3>
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div
              className="card bg-dark-secondary glass-effect hover-lift animate-slide-up cursor-pointer h-100"
              onClick={() => navigate("/admin/create-quiz")}
            >
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-plus-circle fa-4x text-gradient pulse-animation"></i>
                </div>
                <h5 className="text-light mb-3">Create New Quiz</h5>
                <p className="text-light-muted mb-3">Design engaging quizzes with custom questions and settings</p>
                <div className="d-flex justify-content-center">
                  <span className="badge bg-gradient px-3 py-2">
                    <i className="fas fa-magic me-1"></i>
                    Start Creating
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div
              className="card bg-dark-secondary glass-effect hover-lift animate-slide-up cursor-pointer h-100"
              onClick={() => navigate("/admin/manage-quizzes")}
              style={{ animationDelay: "0.1s" }}
            >
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-tasks fa-4x text-gradient pulse-animation"></i>
                </div>
                <h5 className="text-light mb-3">Manage Quizzes</h5>
                <p className="text-light-muted mb-3">Edit, delete, and organize your existing quiz collection</p>
                <div className="d-flex justify-content-center">
                  <span className="badge bg-gradient px-3 py-2">
                    <i className="fas fa-cog me-1"></i>
                    Manage Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div
              className="card bg-dark-secondary glass-effect hover-lift animate-slide-up cursor-pointer h-100"
              onClick={() => navigate("/admin/manage-users")}
              style={{ animationDelay: "0.2s" }}
            >
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-users-cog fa-4x text-gradient pulse-animation"></i>
                </div>
                <h5 className="text-light mb-3">User Management</h5>
                <p className="text-light-muted mb-3">Control user access, roles, and platform permissions</p>
                <div className="d-flex justify-content-center">
                  <span className="badge bg-gradient px-3 py-2">
                    <i className="fas fa-shield-alt me-1"></i>
                    Manage Users
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-5">
        <h3 className="text-gradient mb-4">
          <i className="fas fa-history me-2"></i>
          Recent Activity
        </h3>
        <div className="card bg-dark-secondary glass-effect">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6 className="text-light mb-3">
                  <i className="fas fa-clock me-2 text-primary"></i>
                  Latest Quizzes
                </h6>
                {quizzes.slice(0, 3).map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="d-flex align-items-center mb-2 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="me-3">
                      <i className="fas fa-file-alt text-muted"></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="text-light">{quiz.title}</div>
                      <small className="text-muted">
                        {quiz.category} • {quiz.questions} questions
                      </small>
                    </div>
                    <span
                      className={`badge ${quiz.difficulty === "Hard" ? "bg-danger" : quiz.difficulty === "Medium" ? "bg-warning text-dark" : "bg-success"}`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                <h6 className="text-light mb-3">
                  <i className="fas fa-chart-bar me-2 text-success"></i>
                  Quick Stats
                </h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-light-muted">Easy Quizzes:</span>
                  <span className="text-success">{quizzes.filter((q) => q.difficulty === "Easy").length}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-light-muted">Medium Quizzes:</span>
                  <span className="text-warning">{quizzes.filter((q) => q.difficulty === "Medium").length}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-light-muted">Hard Quizzes:</span>
                  <span className="text-danger">{quizzes.filter((q) => q.difficulty === "Hard").length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="card bg-dark-secondary glass-effect">
          <div className="card-body p-5">
            <i className="fas fa-rocket fa-3x text-gradient mb-3 float-animation"></i>
            <h4 className="text-gradient mb-3">Ready to Create Something Amazing?</h4>
            <p className="text-light-muted mb-4">
              Start building engaging quizzes that will challenge and educate your users
            </p>
            <button
              className="btn btn-gradient-primary btn-lg hover-scale pulse-animation"
              onClick={() => navigate("/admin/create-quiz")}
            >
              <i className="fas fa-plus-circle me-2"></i>
              Create Your First Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
 