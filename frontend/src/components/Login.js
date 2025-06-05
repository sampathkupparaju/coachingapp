// frontend/src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api/problems'; // Import the login API function
import PropTypes from 'prop-types';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('alice@example.com'); // Default for convenience during development
  const [password, setPassword] = useState('password1'); // Default for convenience
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To get 'from' state for redirection

  // If a token already exists, App.js should ideally handle redirection.
  // This is a secondary check.
  useEffect(() => {
    if (localStorage.getItem('jwt-token')) {
      console.log('Login.js: Token exists, navigating to /problems (or intended path).');
      const from = location.state?.from?.pathname || "/problems";
      navigate(from, { replace: true });
    }
  }, [navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.data && response.data.token && response.data.userId) {
        const { token, userId } = response.data;

        localStorage.setItem('jwt-token', token);
        localStorage.setItem('user-id', String(userId));
        // Store the email used for login, so App.js can retrieve it
        localStorage.setItem('user-email', email);

        console.log(`Login successful. Token, userId, and email stored.`);

        if (onLoginSuccess) {
          onLoginSuccess(); // Notify App.js about successful login
        }
        // App.js's useEffect watching auth state should now handle navigation
        // But we can also navigate from here as a fallback or primary action
        const from = location.state?.from?.pathname || "/problems";
        navigate(from, { replace: true });

      } else {
        throw new Error('Login response missing token or userId.');
      }
    } catch (err) {
      console.error('Login API error:', err.response || err.message || err);
      let displayError = 'Login failed. Please check your credentials or network connection.';
      if (err.response && err.response.data) {
        displayError = typeof err.response.data === 'string'
          ? err.response.data
          : (err.response.data.message || displayError);
      }
      setErrorMsg(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '420px',
        margin: '80px auto',
        padding: '35px', // Increased padding
        border: '1px solid #e0e0e0', // Lighter border
        borderRadius: '10px', // More rounded
        backgroundColor: '#ffffff',
        boxShadow: '0 5px 15px rgba(0,0,0,0.07)' // Softer shadow
      }}
    >
      <h2 style={{
        marginBottom: '30px', // More space
        textAlign: 'center',
        color: '#333', // Darker heading
        fontSize: '1.8rem', // Larger font
        fontWeight: '600'
      }}>
        User Login
      </h2>
      {errorMsg && (
        <div style={{
          marginBottom: '20px',
          color: '#721c24', // Darker red for text
          backgroundColor: '#f8d7da',
          padding: '12px 18px', // More padding
          borderRadius: '5px',
          border: '1px solid #f5c6cb',
          fontSize: '0.95rem'
        }}>
          {errorMsg}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '22px' }}>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057', fontSize: '0.95rem' }}
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 15px',
              boxSizing: 'border-box',
              border: `1px solid ${errorMsg && !email ? '#dc3545' : '#ced4da'}`, // Highlight if error and empty
              borderRadius: '5px',
              fontSize: '1rem',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label
            htmlFor="password"
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057', fontSize: '0.95rem' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 15px',
              boxSizing: 'border-box',
              border: `1px solid ${errorMsg && !password ? '#dc3545' : '#ced4da'}`,
              borderRadius: '5px',
              fontSize: '1rem',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px 15px', // Taller button
            backgroundColor: isLoading ? '#6c757d' : '#007bff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '1.05rem', // Slightly larger font
            fontWeight: '500',
            transition: 'background-color 0.2s ease',
            letterSpacing: '0.5px' // Added letter spacing
          }}
        >
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired, // Make it required if App.js relies on it
};

export default Login;
