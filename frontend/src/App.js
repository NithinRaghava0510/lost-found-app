// /frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import LostItems from './components/LostItems';
import FoundItems from './components/FoundItems';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/lost" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/lost"
            element={
              <PrivateRoute>
                <LostItems />
              </PrivateRoute>
            }
          />
          <Route
            path="/found"
            element={
              <PrivateRoute>
                <FoundItems />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          {/* Catch-all: redirect unknown routes to /lost */}
          <Route path="*" element={<Navigate to="/lost" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
