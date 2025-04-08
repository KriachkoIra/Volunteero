import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-5 flex justify-between items-center h-16">
      <div className="flex gap-6 items-center">
        <h3 className="text-4xl logo text-primary">Volunteero</h3>
        <Link to="/" className="hover:text-primary mt-3">
          Home
        </Link>
        <Link to="/participate" className="hover:text-primary mt-3">
          Participate
        </Link>
      </div>
      <div>
        <Link to="/profile" className="hover:text-primary mt-3">
          Profile
        </Link>
      </div>
    </nav>
  );
}
