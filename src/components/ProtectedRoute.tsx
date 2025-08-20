import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "User" | "Admin"; // Optional role restriction
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    // 🚫 Not logged in → redirect
    return <Navigate to="/login" replace />;
  }

  const parsedUser = JSON.parse(currentUser);

  // ✅ Fix: Make role comparison case-insensitive
  if (role && parsedUser.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allowed
  return <>{children}</>;
};

export default ProtectedRoute;
