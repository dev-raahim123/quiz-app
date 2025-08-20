import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  role: "user" | "admin";
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();

  const currentUser = localStorage.getItem("currentUser");
  const parsedUser = currentUser ? JSON.parse(currentUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark-custom sticky-top shadow-lg">
      <div className="container-fluid">
        {/* Brand */}
        <Link
          to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
          className="navbar-brand fw-bold fs-3 text-gradient animate-fade-in"
        >
          QuizMaster Pro
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {role === "user" ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-light px-3 hover-scale"
                    to="/user/dashboard"
                  >
                    <i className="fas fa-home me-1"></i> Dashboard
                  </Link>
                </li>
                {parsedUser && (
                  <li className="nav-item">
                    <span className="nav-link text-light px-3 user-welcome">
                      Welcome, {parsedUser.name}
                    </span>
                  </li>
                )}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-light px-3 hover-scale"
                    to="/admin/dashboard"
                  >
                    <i className="fas fa-tachometer-alt me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-light px-3 hover-scale"
                    to="/admin/create-quiz"
                  >
                    <i className="fas fa-plus-circle me-1"></i> Create Quiz
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-light px-3 hover-scale"
                    to="/admin/manage-users"
                  >
                    <i className="fas fa-users-cog me-1"></i> Manage Users
                  </Link>
                </li>
              </>
            )}

            {/* ✅ Logout only if logged in */}
            {parsedUser && (
              <li className="nav-item">
                <button
                  className="btn btn-danger btn-sm ms-2 hover-scale"
                  style={{ borderRadius: "8px" }} // ✅ more square
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt me-1"></i>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
