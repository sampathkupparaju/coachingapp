// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Login from './components/Login';
import ProblemList from './components/ProblemList';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL.replace(/\/$/, '');
  const token = localStorage.getItem('jwt-token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // 1) We have a token → verify it by hitting /api/auth/me
      axios
        .get(`${baseUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // res.data should be { id: 1, email: "alice@example.com" }
          setUser(res.data);

          // If we’re currently on /login, replace it with /problems
          if (window.location.pathname === '/login') {
            navigate('/problems', { replace: true });
          }
        })
        .catch((err) => {
          console.error('Token invalid or expired:', err);
          localStorage.removeItem('jwt-token');
          localStorage.removeItem('user-id');
          navigate('/login', { replace: true });
        });
    } else {
      // 2) No token present → if not already on /login, redirect to /login
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    }
    // We deliberately omit dependencies for a one‐time mount effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Header will show "Login" or the user's email + Logout */}
      <Header user={user} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/problems" element={<ProblemList />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
