// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';

function App() {
  const [user, setUser] = useState(null);

  // Simple login persistence in localStorage
  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) setUser(JSON.parse(loggedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          user ? (
            user.role === 'admin' ? 
              <Navigate to="/admin" /> : 
              <Navigate to="/staff" />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } />
        <Route path="/admin" element={
          user && user.role === 'admin' ? 
            <AdminDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/" />
        } />
        <Route path="/staff" element={
          user && user.role === 'staff' ? 
            <StaffDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/" />
        } />
      </Routes>
    </Router>
  );
}

export default App;
