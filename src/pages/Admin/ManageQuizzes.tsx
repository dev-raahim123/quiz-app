import React, { useEffect, useState } from "react"
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

const ManageQuizzes: React.FC = () => {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const res = await fetch("https://6899e7ecfed141b96ba13488.mockapi.io/quizzes")
      if (!res.ok) throw new Error("Failed to fetch quizzes")
      const data = await res.json()
      setQuizzes(data)
    } catch (err) {
      console.error(err)
      setError("❌ Error fetching quizzes. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  // Delete quiz
  const handleDelete = async (id: string) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this quiz?")) return
    try {
      await fetch(`https://6899e7ecfed141b96ba13488.mockapi.io/quizzes/${id}`, {
        method: "DELETE",
      })
      setQuizzes(quizzes.filter((q) => q.id !== id))
      alert("✅ Quiz deleted successfully")
    } catch (error) {
      console.error(error)
      alert("❌ Failed to delete quiz")
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading quizzes...</span>
          </div>
          <h4 className="text-gradient">Loading Quizzes...</h4>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">{error}</h4>
      </div>
    )
  }

  return (
    <div className="container py-5 animate-fade-in">
      <div className="card bg-dark-secondary glass-effect p-4 shadow-lg animate-slide-up">
        <h2 className="text-gradient mb-4">Manage Quizzes</h2>

        {quizzes.length === 0 ? (
          <p className="text-light-muted text-center">
            No quizzes available. Create one to get started 🚀
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Quiz ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Category</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Questions</th>
                  <th scope="col">Duration</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="animate-fade-in">
                    <td>{quiz.id}</td>
                    <td>{quiz.title}</td>
                    <td>{quiz.category}</td>
                    <td>
                      <span
                        className={`badge ${
                          quiz.difficulty === "Hard"
                            ? "bg-danger"
                            : quiz.difficulty === "Medium"
                            ? "bg-warning text-dark"
                            : "bg-success"
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td>{quiz.questions}</td>
                    <td>{quiz.duration} min</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <button
                          className="btn btn-sm btn-gradient-info hover-scale"
                          onClick={() =>
                            navigate(`/admin/manage-questions/${quiz.id}`)
                          }
                        >
                          <i className="fas fa-question-circle"></i> Manage Qs
                        </button>
                        <button
                          className="btn btn-sm btn-gradient-primary hover-scale"
                          onClick={() =>
                            navigate(`/admin/add-questions/${quiz.id}`)
                          }
                        >
                          <i className="fas fa-plus"></i> Add Qs
                        </button>
                        <button
                          className="btn btn-sm btn-gradient-warning hover-scale"
                          onClick={() =>
                            navigate(`/admin/edit-quiz/${quiz.id}`)
                          }
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-gradient-danger hover-scale"
                          onClick={() => handleDelete(quiz.id)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageQuizzes
