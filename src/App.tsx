import type React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ new

// Auth pages
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

// User pages
import UserDashboard from "./pages/User/UserDashboard";
import TakeQuiz from "./pages/User/TakeQuiz";
import Result from "./Result";
import UserStats from "./pages/User/UserStats";

// Admin pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateQuiz from "./pages/Admin/CreateQuiz";
import ManageUsers from "./pages/Admin/ManageUsers";
import AddQuestions from "./pages/Admin/AddQuestions";
import ManageQuizzes from "./pages/Admin/ManageQuizzes";
import EditQuiz from "./pages/Admin/EditQuiz";
import ManageQuestions from "./pages/Admin/ManageQuestions";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container min-vh-100">
        <main className="main-content">
          <Routes>
            {/* ================= AUTH ROUTES ================= */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* ================= USER ROUTES ================= */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute role="User">
                  <Navbar role="user" />
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/take-quiz/:quizId"
              element={
                <ProtectedRoute role="User">
                  <Navbar role="user" />
                  <TakeQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/result/:quizId"
              element={
                <ProtectedRoute role="User">
                  <Navbar role="user" />
                  <Result />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/stats"
              element={
                <ProtectedRoute role="User">
                  <Navbar role="user" />
                  <UserStats />
                </ProtectedRoute>
              }
            />

            {/* ================= ADMIN ROUTES ================= */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="Admin">
                  <Navbar role="admin" />
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-quiz"
              element={
                <ProtectedRoute role="Admin">
                  <Navbar role="admin" />
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-users"
              element={
                <ProtectedRoute role="Admin">
                  <Navbar role="admin" />
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-quizzes"
              element={
                <ProtectedRoute role="Admin">
                  <Navbar role="admin" />
                  <ManageQuizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-quiz/:quizId"
              element={
                <ProtectedRoute role="Admin">
                  <Navbar role="admin" />
                  <EditQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-questions/:quizId"
              element={
                <ProtectedRoute role="Admin">
                  <Navbar role="admin" />
                  <AddQuestions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-questions/:quizId"
              element={
                <ProtectedRoute role="Admin">
                  <Navbar role="admin" />
                  <ManageQuestions />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
