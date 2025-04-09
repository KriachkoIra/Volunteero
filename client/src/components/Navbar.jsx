import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { name, role } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <nav className="py-5 px-6 flex justify-between items-center h-16">
      <div className="flex gap-6 items-center">
        <h3 className="text-4xl logo text-primary">Volunteero</h3>
        <Link to="/" className="hover:text-primary mt-3">
          Home
        </Link>
        <Link to="/participate" className="hover:text-primary mt-3">
          {role == "organizer" ? "All Tasks" : "Participate"}
        </Link>
        {role == "organizer" && (
          <Link to="/add-task" className="hover:text-primary mt-3">
            Create Task
          </Link>
        )}
      </div>
      <div>
        {name ? (
          <Link to="/profile" className="hover:text-primary mt-3">
            Profile
          </Link>
        ) : (
          <button
            className="bg-primary text-white px-6 py-1 hover:opacity-80"
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </button>
        )}
      </div>
    </nav>
  );
}
