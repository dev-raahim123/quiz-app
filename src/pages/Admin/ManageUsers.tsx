import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  role: "User" | "Admin";
}

const ManageUsers: React.FC = () => {
  // Mock user data (fake but interactive)
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Alice Johnson", role: "User" },
    { id: 2, name: "Bob Smith", role: "Admin" },
    { id: 3, name: "Charlie Brown", role: "User" },
  ]);

  // Delete user (with confirmation)
  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Toggle role (promote/demote)
  const handleToggleRole = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, role: user.role === "User" ? "Admin" : "User" }
          : user
      )
    );
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="card bg-dark-secondary glass-effect p-4 shadow-lg animate-slide-up">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-gradient">👥 Manage Users</h2>
          <span className="badge bg-info fs-6">
            Total Users: {users.length}
          </span>
        </div>

        {users.length === 0 ? (
          <p className="text-light text-center">🚫 No users available.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="animate-fade-in">
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "Admin" ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-gradient-danger me-2 hover-scale"
                        onClick={() => handleDelete(user.id)}
                        title="Delete User"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-gradient-primary hover-scale"
                        onClick={() => handleToggleRole(user.id)}
                        title={
                          user.role === "User"
                            ? "Promote to Admin"
                            : "Demote to User"
                        }
                      >
                        <i
                          className={`fas ${
                            user.role === "User"
                              ? "fa-arrow-up"
                              : "fa-arrow-down"
                          } me-1`}
                        ></i>
                        {user.role === "User" ? "Promote" : "Demote"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
