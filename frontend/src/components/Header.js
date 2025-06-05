// frontend/src/components/Header.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation(); // To prevent navigating to /login if already there

  // This state tracks the presence of a token to quickly update UI.
  // The 'user' prop from App.js is the source of truth for displayed user details.
  const [hasToken, setHasToken] = useState(!!localStorage.getItem('jwt-token'));

  useEffect(() => {
    // Sync hasToken with localStorage for cross-tab consistency or direct manipulation
    const syncTokenState = () => {
      setHasToken(!!localStorage.getItem('jwt-token'));
    };
    window.addEventListener('storage', syncTokenState);
    syncTokenState(); // Initial check
    return () => window.removeEventListener('storage', syncTokenState);
  }, []);

  // If the user prop changes (e.g., App.js sets it after login/logout),
  // update hasToken to ensure consistency.
  useEffect(() => {
    setHasToken(!!user);
  }, [user]);

  const handleLoginClick = () => {
    // Navigate to login only if not already on the login page
    if (location.pathname !== '/login') {
      navigate('/login');
    }
  };

  const handleLogoutClick = () => {
    // Clear auth-related items from localStorage
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('user-id');
    localStorage.removeItem('user-email'); // Ensure email is also cleared

    setHasToken(false); // Update local UI state immediately

    if (onLogout) {
      onLogout(); // Trigger callback passed from App.js to update global state
    }
    // App.js routing logic should handle redirecting to /login if necessary
    // Forcing navigation here can sometimes conflict with App.js's own auth flow.
    // However, if App.js doesn't redirect on user=null, explicit navigation is needed.
    if (location.pathname !== '/login') { // Avoid redirect loop if already on login
        navigate('/login', { replace: true });
    }
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 25px', // Adjusted padding
        borderBottom: '1px solid #e9ecef', // Lighter border
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 1050,
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)' // Softer shadow
      }}
    >
      <div
        style={{
          fontSize: '1.7rem', // Responsive font size
          fontWeight: 'bold',
          color: '#007bff',
          cursor: 'pointer',
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" // Modern sans-serif
        }}
        onClick={() => navigate('/problems')} // Always navigate to problems dashboard
      >
        MakeCodingEasy
      </div>
      <div>
        {hasToken && user ? ( // Show user info and Logout if both token and user object exist
          <>
            {user.email && (
              <span style={{
                marginRight: '20px',
                color: '#495057',
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogoutClick}
              style={{
                padding: '9px 18px',
                fontSize: '0.9rem',
                fontWeight: 500,
                borderRadius: '6px',
                border: '1px solid #ced4da',
                backgroundColor: '#f8f9fa',
                color: '#343a40',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e9ecef'; e.currentTarget.style.borderColor = '#adb5bd';}}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.borderColor = '#ced4da';}}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            style={{
              padding: '9px 18px',
              fontSize: '0.9rem',
              fontWeight: 500,
              borderRadius: '6px',
              border: '1px solid #0069d9',
              backgroundColor: '#007bff',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0062cc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    email: PropTypes.string,
  }), // User can be null
  onLogout: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};

export default Header;
