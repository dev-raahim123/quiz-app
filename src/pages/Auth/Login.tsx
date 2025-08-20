"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface User {
  name: string
  email: string
  password: string
  role: "Admin" | "User"
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false) // 👁️ toggle
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Redirect if already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user: User = JSON.parse(currentUser)
      if (user.role === "Admin") {
        navigate("/admin/dashboard", { replace: true })
      } else {
        navigate("/user/dashboard", { replace: true })
      }
    }
  }, [navigate])

  // ✅ Seed fake users into localStorage (runs once)
  useEffect(() => {
    const existingUsers = localStorage.getItem("users")
    if (!existingUsers) {
      const seedUsers: User[] = [
        { name: "Admin", email: "admin@example.com", password: "admin123", role: "Admin" },
        { name: "Test User", email: "user@example.com", password: "user123", role: "User" },
      ]
      localStorage.setItem("users", JSON.stringify(seedUsers))
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    setPasswordError("")
    setIsLoading(true)

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!email) {
      setEmailError("Email is required")
      setIsLoading(false)
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format")
      setIsLoading(false)
      return
    }
    if (!password) {
      setPasswordError("Password is required")
      setIsLoading(false)
      return
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    const foundUser = users.find((u) => u.email === email)

    if (!foundUser) {
      setEmailError("No account found with this email")
      setIsLoading(false)
      return
    }
    if (foundUser.password !== password) {
      setPasswordError("Incorrect password")
      setIsLoading(false)
      return
    }

    // ✅ Save current logged-in user
    localStorage.setItem("currentUser", JSON.stringify(foundUser))

    if (foundUser.role === "Admin") {
      navigate("/admin/dashboard")
    } else {
      navigate("/user/dashboard")
    }
    setIsLoading(false)
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 animate-fade-in">
      <div className="card p-5 shadow-lg glass-effect animate-slide-up" style={{ width: "450px" }}>
        {/* Enhanced Header */}
        <div className="text-center mb-4">
          <div className="mb-3">
            <i className="fas fa-graduation-cap fa-3x text-gradient float-animation"></i>
          </div>
          <h2 className="text-gradient mb-2">🔐 Welcome Back!</h2>
          <p className="text-light-muted">Sign in to continue your learning journey</p>
        </div>

        {/* Demo Credentials Info */}
        <div className="alert alert-info mb-4 animate-fade-in glass-effect">
          <small>
            <strong>🎯 Demo Credentials:</strong>
            <br />
            👨‍💼 Admin: admin@example.com / admin123
            <br />👤 User: user@example.com / user123
          </small>
        </div>

        <form onSubmit={handleLogin}>
          {/* Enhanced Email Field */}
          <div className="mb-4">
            <label className="form-label text-light fw-semibold">
              <i className="fas fa-envelope me-2 text-primary"></i>Email Address
            </label>
            <div className="position-relative">
              <input
                type="email"
                className={`form-control form-control-lg glass-effect ${emailError ? "is-invalid border-danger" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{ paddingRight: "45px" }}
                disabled={isLoading}
              />
              <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                <i className="fas fa-user text-muted"></i>
              </div>
              {emailError && (
                <div className="invalid-feedback animate-fade-in">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {emailError}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Password Field */}
          <div className="mb-4">
            <label className="form-label text-light fw-semibold">
              <i className="fas fa-lock me-2 text-primary"></i>Password
            </label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control form-control-lg glass-effect ${passwordError ? "is-invalid border-danger" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ paddingRight: "45px" }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y me-2 hover-scale"
                onClick={() => setShowPassword(!showPassword)}
                style={{ border: "none", background: "transparent", zIndex: 10 }}
                disabled={isLoading}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-muted`}></i>
              </button>
              {passwordError && (
                <div className="invalid-feedback animate-fade-in">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {passwordError}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Submit Button */}
          <button
            type="submit"
            className="btn btn-gradient-primary btn-lg w-100 hover-scale pulse-animation position-relative overflow-hidden"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Signing In...
              </>
            ) : (
              <>
                <span className="position-relative z-index-1">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Sign In to Dashboard
                </span>
              </>
            )}
          </button>
        </form>

        {/* Enhanced Footer */}
        <div className="text-center mt-4">
          <p className="text-light-muted mb-3">
            Don't have an account?{" "}
            <span
              className="text-gradient fw-bold cursor-pointer hover-scale d-inline-block"
              onClick={() => navigate("/signup")}
            >
              Create Account ✨
            </span>
          </p>

          {/* Social Login Placeholder */}
          <div className="d-flex align-items-center mb-3">
            <hr className="flex-grow-1 text-muted" />
            <span className="px-3 text-muted small">Or continue with</span>
            <hr className="flex-grow-1 text-muted" />
          </div>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-outline-light btn-sm hover-scale" disabled>
              <i className="fab fa-google me-1"></i> Google
            </button>
            <button className="btn btn-outline-light btn-sm hover-scale" disabled>
              <i className="fab fa-github me-1"></i> GitHub
            </button>
          </div>
          <small className="text-muted d-block mt-2">🚀 Coming Soon</small>
        </div>
      </div>
    </div>
  )
}

export default Login
