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

const Signup: React.FC = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Validation states
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [formError, setFormError] = useState("")

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState(0)

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

  // Password strength calculation
  useEffect(() => {
    let strength = 0
    if (password.length >= 6) strength += 1
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1
    if (password.match(/\d/)) strength += 1
    if (password.match(/[^a-zA-Z\d]/)) strength += 1
    setPasswordStrength(strength)
  }, [password])

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-danger"
      case 2:
        return "bg-warning"
      case 3:
        return "bg-info"
      case 4:
        return "bg-success"
      default:
        return "bg-secondary"
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Strong"
      default:
        return ""
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setIsLoading(true)

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let valid = true

    // Validate Name
    if (!name.trim()) {
      setNameError("⚠️ Name is required")
      valid = false
    } else if (name.trim().length < 2) {
      setNameError("⚠️ Name must be at least 2 characters")
      valid = false
    } else {
      setNameError("")
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setEmailError("⚠️ Email is required")
      valid = false
    } else if (!emailRegex.test(email)) {
      setEmailError("⚠️ Invalid email format")
      valid = false
    } else {
      setEmailError("")
    }

    // Validate Password
    if (!password.trim()) {
      setPasswordError("⚠️ Password is required")
      valid = false
    } else if (password.length < 6) {
      setPasswordError("⚠️ Password must be at least 6 characters")
      valid = false
    } else {
      setPasswordError("")
    }

    // Validate Confirm Password
    if (password !== confirmPassword) {
      setConfirmPasswordError("⚠️ Passwords do not match")
      valid = false
    } else {
      setConfirmPasswordError("")
    }

    if (!valid) {
      setIsLoading(false)
      return
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")

    if (users.some((u) => u.email === email)) {
      setFormError("⚠️ Email already registered")
      setIsLoading(false)
      return
    }

    const newUser: User = { name, email, password, role: "User" }
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // ✅ Auto-login after signup
    localStorage.setItem("currentUser", JSON.stringify(newUser))

    setIsLoading(false)
    navigate("/user/dashboard", { replace: true })
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 animate-fade-in">
      <div className="card p-5 shadow-lg glass-effect animate-slide-up" style={{ width: "450px" }}>
        {/* Enhanced Header */}
        <div className="text-center mb-4">
          <div className="mb-3">
            <i className="fas fa-user-plus fa-3x text-gradient float-animation"></i>
          </div>
          <h2 className="text-gradient mb-2">📝 Join QuizMaster</h2>
          <p className="text-light-muted">Create your account and start learning today</p>
        </div>

        {formError && (
          <div className="alert alert-danger animate-fade-in glass-effect mb-4">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {formError}
          </div>
        )}

        <form onSubmit={handleSignup}>
          {/* Enhanced Full Name Field */}
          <div className="mb-4">
            <label className="form-label text-light fw-semibold">
              <i className="fas fa-user me-2 text-primary"></i>Full Name
            </label>
            <input
              type="text"
              className={`form-control form-control-lg glass-effect ${nameError ? "is-invalid border-danger" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
            {nameError && (
              <div className="invalid-feedback animate-fade-in">
                <i className="fas fa-exclamation-triangle me-1"></i>
                {nameError}
              </div>
            )}
          </div>

          {/* Enhanced Email Field */}
          <div className="mb-4">
            <label className="form-label text-light fw-semibold">
              <i className="fas fa-envelope me-2 text-primary"></i>Email Address
            </label>
            <input
              type="email"
              className={`form-control form-control-lg glass-effect ${emailError ? "is-invalid border-danger" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
            {emailError && (
              <div className="invalid-feedback animate-fade-in">
                <i className="fas fa-exclamation-triangle me-1"></i>
                {emailError}
              </div>
            )}
          </div>

          {/* Enhanced Password Field with Strength Indicator */}
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
                placeholder="Create a strong password"
                style={{ paddingRight: "45px" }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y me-2 hover-scale"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{ border: "none", background: "transparent", zIndex: 10 }}
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
            {password && (
              <div className="mt-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-light-muted">Password Strength:</small>
                  <small className={`text-${getPasswordStrengthColor().replace("bg-", "")}`}>
                    {getPasswordStrengthText()}
                  </small>
                </div>
                <div className="progress" style={{ height: "4px" }}>
                  <div
                    className={`progress-bar ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Confirm Password Field */}
          <div className="mb-4">
            <label className="form-label text-light fw-semibold">
              <i className="fas fa-shield-alt me-2 text-primary"></i>Confirm Password
            </label>
            <div className="position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control form-control-lg glass-effect ${confirmPasswordError ? "is-invalid border-danger" : ""}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                style={{ paddingRight: "45px" }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y me-2 hover-scale"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                style={{ border: "none", background: "transparent", zIndex: 10 }}
              >
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-muted`}></i>
              </button>
              {confirmPasswordError && (
                <div className="invalid-feedback animate-fade-in">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {confirmPasswordError}
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="terms" required disabled={isLoading} />
              <label className="form-check-label text-light-muted small" htmlFor="terms">
                I agree to the <span className="text-gradient cursor-pointer">Terms of Service</span> and{" "}
                <span className="text-gradient cursor-pointer">Privacy Policy</span>
              </label>
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
                Creating Account...
              </>
            ) : (
              <>
                <span className="position-relative z-index-1">
                  <i className="fas fa-user-plus me-2"></i>
                  Create My Account
                </span>
              </>
            )}
          </button>
        </form>

        {/* Enhanced Footer */}
        <div className="text-center mt-4">
          <p className="text-light-muted mb-0">
            Already have an account?{" "}
            <span
              className="text-gradient fw-bold cursor-pointer hover-scale d-inline-block"
              onClick={() => navigate("/login")}
            >
              Sign In Here ✨
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
