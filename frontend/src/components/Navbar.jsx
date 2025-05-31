// /frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, clearAuthData, isAdmin } from '../utils/auth';

function Navbar() {
  const navigate = useNavigate();
  const user = isAuthenticated() ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Lost/Found
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated() ? (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/lost">
                  Lost Items
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/found">
                  Found Items
                </Link>
              </li>
              {isAdmin() && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Admin
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
