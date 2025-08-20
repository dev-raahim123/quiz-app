import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const EditQuiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()

  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    category: "",
    duration: "",
    questions: ""
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`https://6899e7ecfed141b96ba13488.mockapi.io/quizzes/${quizId}`)
        if (!res.ok) throw new Error("Failed to fetch quiz")
        const data = await res.json()
        setQuizData({
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          category: data.category,
          duration: String(data.duration),
          questions: String(data.questions)
        })
      } catch (error) {
        console.error(error)
        setMessage({ type: "error", text: "❌ Error fetching quiz" })
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [quizId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setQuizData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (Number(quizData.duration) <= 0 || Number(quizData.questions) <= 0) {
      setMessage({ type: "error", text: "⚠️ Duration and number of questions must be greater than 0" })
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`https://6899e7ecfed141b96ba13488.mockapi.io/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quizData,
          duration: Number(quizData.duration),
          questions: Number(quizData.questions)
        })
      })

      if (!res.ok) throw new Error("Failed to update quiz")

      setMessage({ type: "success", text: "✅ Quiz updated successfully!" })
      setTimeout(() => navigate("/admin/manage-quizzes"), 1500)
    } catch (error) {
      console.error(error)
      setMessage({ type: "error", text: "❌ Failed to update quiz" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading quiz...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5 animate-fade-in">
      <div className="card bg-dark-secondary glass-effect p-4 shadow-lg animate-slide-up">
        <h2 className="text-gradient mb-4">Edit Quiz</h2>

        {/* Toast Message */}
        {message && (
          <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
            {message.text}
          </div>
        )}

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
                min="1"
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
                min="1"
                value={quizData.questions}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gradient-primary w-100 mt-3 hover-scale"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span> Updating...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i> Update Quiz
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditQuiz
