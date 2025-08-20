import React from "react"
import { useNavigate } from "react-router-dom"

interface QuizCardProps {
  quiz: {
    id: string
    title: string
    description: string
    difficulty: string
    questions: number
    duration: number
    category: string
  }
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const navigate = useNavigate()

  const handleTakeQuiz = () => {
    navigate(`/user/take-quiz/${quiz.id}`)
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return <span className="badge bg-success ms-2">Easy</span>
      case "medium":
        return <span className="badge bg-warning text-dark ms-2">Medium</span>
      case "hard":
        return <span className="badge bg-danger ms-2">Hard</span>
      default:
        return null
    }
  }

  return (
    <div className="card bg-dark-secondary border-0 shadow-lg glass-effect animate-fade-in quiz-card-hover h-100 hover-scale">
      <div className="card-body p-4 position-relative">
        {/* ✨ Optional "New" badge (you can toggle this later dynamically) */}
        {/* <span className="badge bg-gradient position-absolute top-0 end-0 m-3">✨ New</span> */}

        <h4 className="text-gradient mb-2 d-flex align-items-center">
          {quiz.title}
          {getDifficultyBadge(quiz.difficulty)}
        </h4>
        <p className="text-light-muted small mb-3">{quiz.description}</p>

        <p className="text-light mb-1">
          <i className="fas fa-layer-group me-2 text-primary"></i>
          <strong>Category:</strong> {quiz.category}
        </p>
        <p className="text-light mb-1">
          <i className="fas fa-list-ol me-2 text-warning"></i>
          <strong>Questions:</strong> {quiz.questions}
        </p>
        <p className="text-light mb-1">
          <i className="fas fa-clock me-2 text-danger"></i>
          <strong>Duration:</strong> {quiz.duration} minutes
        </p>

        <button
          className="btn btn-gradient-primary btn-sm mt-3 w-100 hover-scale pulse-animation"
          onClick={handleTakeQuiz}
        >
          <i className="fas fa-play-circle me-2"></i>Take Quiz
        </button>
      </div>
    </div>
  )
}

export default QuizCard
