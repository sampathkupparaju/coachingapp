// frontend/src/components/Login.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password1');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Base URL for our backend API (strip any trailing slash)
  const baseUrl = process.env.REACT_APP_API_URL.replace(/\/$/, '');

  // If a token already exists in localStorage, redirect immediately to /problems
  useEffect(() => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      console.log('Token already in localStorage—redirecting to /problems');
      navigate('/problems', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // 1) Send POST /api/auth/login
      const resp = await axios.post(
        `${baseUrl}/api/auth/login`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // 2) Log the raw response data for debugging
      console.log('Login response data:', resp.data);

      // 3) Extract token and userId
      const token = resp.data.token;
      const userId = resp.data.userId;

      if (!token || !userId) {
        throw new Error(
          'Login succeeded but response is missing token or userId'
        );
      }

      // 4) Store both under the exact keys ProblemList expects
      localStorage.setItem('jwt-token', token);
      localStorage.setItem('user-id', String(userId));

      console.log(
        `Wrote to localStorage → jwt-token=${token.slice(0, 10)}… user-id=${userId}`
      );

      // 5) Redirect to /problems, replacing /login so Back won’t return here
      navigate('/problems', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Invalid email or password. Please try again.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '100px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff',
      }}
    >
      <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Login</h2>
      {errorMsg && (
        <div style={{ marginBottom: '16px', color: 'red' }}>{errorMsg}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '4px' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="password"
            style={{ display: 'block', marginBottom: '4px' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
