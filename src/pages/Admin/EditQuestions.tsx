import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

interface Question {
  id: string
  quizid: string
  question: string
  options: string[]
  correctAnswer: string
}

const EditQuestions: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // For editing
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        `https://6899e7ecfed141b96ba13488.mockapi.io/questions?quizid=${quizId}`
      )
      if (!res.ok) throw new Error("Failed to fetch questions")
      const data = await res.json()
      setQuestions(data)
    } catch (err) {
      setError("❌ Failed to load questions.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [quizId])

  // Delete question
  const handleDelete = async (id: string) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this question?")) return
    try {
      await fetch(`https://6899e7ecfed141b96ba13488.mockapi.io/questions/${id}`, {
        method: "DELETE",
      })
      setQuestions(questions.filter((q) => q.id !== id))
      alert("✅ Question deleted successfully")
    } catch (err) {
      alert("❌ Failed to delete question")
      console.error(err)
    }
  }

  // Save edit
  const handleSave = async () => {
    if (!editingQuestion) return
    try {
      const res = await fetch(
        `https://6899e7ecfed141b96ba13488.mockapi.io/questions/${editingQuestion.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingQuestion),
        }
      )
      if (!res.ok) throw new Error("Failed to update question")

      const updated = await res.json()
      setQuestions(
        questions.map((q) => (q.id === updated.id ? updated : q))
      )
      setShowModal(false)
      alert("✅ Question updated successfully")
    } catch (err) {
      alert("❌ Failed to update question")
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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
        <h2 className="text-gradient mb-4">Manage Questions</h2>

        {questions.length === 0 ? (
          <p className="text-light-muted text-center">
            No questions added yet. Add some questions first 🚀
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Options</th>
                  <th>Correct Answer</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="animate-fade-in">
                    <td>{q.question}</td>
                    <td>
                      <ul className="mb-0">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <span className="badge bg-success">
                        {q.correctAnswer}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-gradient-warning me-2 hover-scale"
                        onClick={() => {
                          setEditingQuestion({ ...q })
                          setShowModal(true)
                        }}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-gradient-danger hover-scale"
                        onClick={() => handleDelete(q.id)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && editingQuestion && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title text-gradient">Edit Question</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  value={editingQuestion.question}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: e.target.value,
                    })
                  }
                />
                {editingQuestion.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    className="form-control mb-2"
                    value={opt}
                    onChange={(e) => {
                      const updatedOpts = [...editingQuestion.options]
                      updatedOpts[i] = e.target.value
                      setEditingQuestion({
                        ...editingQuestion,
                        options: updatedOpts,
                      })
                    }}
                  />
                ))}
                <input
                  type="text"
                  className="form-control mt-2"
                  value={editingQuestion.correctAnswer}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      correctAnswer: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditQuestions
